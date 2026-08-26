import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPaddleWebhookSignature, mapPaddleStatus, getPlanFromPaddlePriceId } from '@/lib/paddle';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function verifyStripeSignature(payload: string, header: string, secret: string): boolean {
  try {
    const parts = header.split(',').reduce((acc: any, part: string) => {
      const [key, value] = part.split('=');
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {});

    const timestamp = parts.t;
    const signature = parts.v1;

    if (!timestamp || !signature) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const paddleSig = req.headers.get('paddle-signature');
    const stripeSig = req.headers.get('stripe-signature');
    const paddleWebhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: any;

    // 1. Check if event is from Paddle (Primary)
    if (paddleSig) {
      if (paddleWebhookSecret) {
        const isValid = verifyPaddleWebhookSignature(rawBody, paddleSig, paddleWebhookSecret);
        if (!isValid) {
          return NextResponse.json({ error: 'Paddle webhook signature verification failed' }, { status: 400 });
        }
      }
      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
      }

      const eventType = event.event_type || event.type;
      const dataObject = event.data || {};
      const customData = dataObject.custom_data || {};
      
      const paddleSubId = dataObject.id;
      const paddleCustomerId = dataObject.customer_id;
      const paddlePriceId = dataObject.items?.[0]?.price?.id || dataObject.details?.line_items?.[0]?.price_id;
      const plan = customData.plan || getPlanFromPaddlePriceId(paddlePriceId);
      const rawStatus = dataObject.status || 'active';
      const mappedStatus = mapPaddleStatus(rawStatus);

      // Resolve user ID with multiple fallback mechanisms
      let targetUserId = customData.userId;
      
      if (!targetUserId && paddleCustomerId) {
        const subRecord = await prisma.subscription.findFirst({
          where: { paddleCustomerId: String(paddleCustomerId) }
        });
        if (subRecord) {
          targetUserId = subRecord.userId;
        }
      }

      if (!targetUserId && dataObject.customer?.email) {
        const userRecord = await prisma.user.findUnique({
          where: { email: dataObject.customer.email.toLowerCase().trim() }
        });
        if (userRecord) {
          targetUserId = userRecord.id;
        }
      }

      const periodEnd = dataObject.current_billing_period?.ends_at
        ? new Date(dataObject.current_billing_period.ends_at)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const isCancelScheduled = !!(dataObject.scheduled_change?.action === 'cancel' || rawStatus === 'canceled');

      if (targetUserId) {
        if (eventType.startsWith('subscription.') || eventType === 'transaction.completed') {
          await prisma.subscription.upsert({
            where: { userId: targetUserId },
            create: {
              userId: targetUserId,
              plan,
              status: mappedStatus,
              paddleCustomerId: paddleCustomerId ? String(paddleCustomerId) : null,
              paddleSubscriptionId: paddleSubId ? String(paddleSubId) : null,
              paddlePriceId: paddlePriceId ? String(paddlePriceId) : null,
              currentPeriodStart: new Date(),
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: isCancelScheduled
            },
            update: {
              plan,
              status: mappedStatus,
              paddleCustomerId: paddleCustomerId ? String(paddleCustomerId) : undefined,
              paddleSubscriptionId: paddleSubId ? String(paddleSubId) : undefined,
              paddlePriceId: paddlePriceId ? String(paddlePriceId) : undefined,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: isCancelScheduled
            }
          });

          await prisma.auditLog.create({
            data: {
              userId: targetUserId,
              action: 'PADDLE_SUBSCRIPTION_SYNC',
              details: `Paddle Sandbox Event [${eventType}]: Plan ${plan}, Status: ${mappedStatus}, Sub ID: ${paddleSubId}`
            }
          });
        }
      }

      return NextResponse.json({ success: true, provider: 'paddle', eventType });
    }

    // 2. Fallback: Stripe webhook support
    if (stripeSig && stripeWebhookSecret) {
      const isValid = verifyStripeSignature(rawBody, stripeSig, stripeWebhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: 'Stripe webhook signature verification failed' }, { status: 400 });
      }
    }

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventType = event.type || event.event_type;
    const dataObject = event.data?.object || event.data || {};

    if (eventType === 'checkout.session.completed') {
      const userId = dataObject.metadata?.userId || dataObject.client_reference_id;
      const plan = dataObject.metadata?.plan || 'PRO';
      const customerId = dataObject.customer;
      const subscriptionId = dataObject.subscription;

      if (userId) {
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan,
            status: 'ACTIVE',
            stripeCustomerId: customerId ? String(customerId) : null,
            stripeSubscriptionId: subscriptionId ? String(subscriptionId) : null,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          },
          update: {
            plan,
            status: 'ACTIVE',
            stripeCustomerId: customerId ? String(customerId) : undefined,
            stripeSubscriptionId: subscriptionId ? String(subscriptionId) : undefined,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

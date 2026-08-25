import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
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
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: any;

    if (webhookSecret && sig) {
      const isValid = verifyStripeSignature(rawBody, sig, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
      }
      event = JSON.parse(rawBody);
    } else {
      // In development/test mode without signature
      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
      }
    }

    const eventType = event.type;
    const dataObject = event.data?.object;

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

        await prisma.auditLog.create({
          data: {
            userId,
            action: 'BILLING_ACTIVATION',
            details: `Subscription activated: ${plan} (Customer: ${customerId})`
          }
        });
      }
    } else if (eventType === 'customer.subscription.updated') {
      const subscriptionId = dataObject.id;
      const status = dataObject.status === 'active' ? 'ACTIVE' : dataObject.status === 'past_due' ? 'PAST_DUE' : 'ACTIVE';
      const periodEnd = dataObject.current_period_end ? new Date(dataObject.current_period_end * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const existingSub = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscriptionId }
      });

      if (existingSub) {
        await prisma.subscription.update({
          where: { id: existingSub.id },
          data: {
            status,
            currentPeriodEnd: periodEnd
          }
        });
      }
    } else if (eventType === 'customer.subscription.deleted') {
      const subscriptionId = dataObject.id;
      const existingSub = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscriptionId }
      });

      if (existingSub) {
        await prisma.subscription.update({
          where: { id: existingSub.id },
          data: {
            plan: 'FREE',
            status: 'CANCELED'
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

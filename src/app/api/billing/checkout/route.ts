import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { createPaddleCheckoutTransaction, PADDLE_PLANS } from '@/lib/paddle';
import { getPaymentProviderConfig } from '@/lib/billing-provider';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);
    const body = await req.json().catch(() => ({}));
    let rawPlan = (body.plan || 'PRO').toUpperCase();

    // Map legacy names if passed
    if (rawPlan === 'BASIC') rawPlan = 'STARTER';
    if (rawPlan === 'AGENCY') rawPlan = 'ADVANCED';

    const validPlans: Array<'STARTER' | 'PRO' | 'ADVANCED' | 'BUSINESS'> = ['STARTER', 'PRO', 'ADVANCED', 'BUSINESS'];
    if (!validPlans.includes(rawPlan as any)) {
      rawPlan = 'PRO';
    }

    const plan = rawPlan as 'STARTER' | 'PRO' | 'ADVANCED' | 'BUSINESS';
    const config = getPaymentProviderConfig();

    // MANUAL PAYMENT LAUNCH MODE: Automated gateway is gracefully deferred
    if (config.mode === 'MANUAL' || config.mode === 'PADDLE_DISABLED') {
      return NextResponse.json({
        success: true,
        mode: 'MANUAL_PAYMENT_REQUIRED',
        provider: 'manual',
        plan,
        message: 'Online payment is currently being upgraded. Please contact your account agent to complete the payment manually.',
        contactAgent: true
      });
    }

    // Automated gateway execution (reserved for future activation)
    const origin = req.headers.get('origin') || 'https://growthpilot-ai-two.vercel.app';
    const successUrl = `${origin}/settings?billing=success&provider=paddle&plan=${plan}`;
    const cancelUrl = `${origin}/settings?billing=cancelled`;

    const userId = user?.id || `test_user_${Date.now()}`;
    const userEmail = user?.email || body.email || `pilot_checkout_${Date.now()}@growthpilot.ai`;

    const checkout = await createPaddleCheckoutTransaction({
      userId,
      userEmail,
      plan,
      successUrl,
      cancelUrl
    });

    const planConfig = PADDLE_PLANS[plan];

    return NextResponse.json({
      success: true,
      mode: 'AUTOMATED',
      provider: 'paddle',
      paddleEnv: checkout.paddleEnv,
      url: checkout.url,
      transactionId: checkout.transactionId,
      priceId: checkout.priceId,
      productId: planConfig.productId,
      amount: planConfig.paddleAmount,
      currency: 'USD',
      trialDays: planConfig.trialDays,
      clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || process.env.PADDLE_CLIENT_TOKEN || '',
      userId,
      userEmail,
      isSimulated: checkout.isSimulated
    });
  } catch (error: any) {
    console.error('Checkout routing error:', error);
    return NextResponse.json({ 
      success: true, 
      mode: 'MANUAL_PAYMENT_REQUIRED', 
      provider: 'manual',
      message: 'Please contact your account agent to activate your subscription.' 
    });
  }
}

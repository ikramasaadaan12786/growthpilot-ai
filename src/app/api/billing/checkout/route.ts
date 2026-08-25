import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { createStripeCheckoutSession } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { plan, returnUrl } = body;

    if (!plan || !['BASIC', 'PRO', 'AGENCY', 'BUSINESS'].includes(plan.toUpperCase())) {
      return NextResponse.json({ success: false, error: 'Invalid subscription plan' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://growthpilot-ai-two.vercel.app';
    const successUrl = `${origin}/settings?billing=success`;
    const cancelUrl = `${origin}/settings?billing=cancelled`;

    const checkout = await createStripeCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      plan: plan.toUpperCase() as any,
      successUrl,
      cancelUrl
    });

    return NextResponse.json({
      success: true,
      url: checkout.url,
      sessionId: checkout.sessionId,
      isSimulated: checkout.isSimulated
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { createStripeCustomerPortalSession } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const sub = await prisma.subscription.findUnique({
      where: { userId: user.id }
    });

    const customerId = sub?.stripeCustomerId || `sim_cust_${user.id}`;
    const origin = req.headers.get('origin') || 'https://growthpilot-ai-two.vercel.app';
    const returnUrl = `${origin}/settings`;

    const portal = await createStripeCustomerPortalSession({
      customerId,
      returnUrl
    });

    return NextResponse.json({
      success: true,
      url: portal.url,
      isSimulated: portal.isSimulated
    });
  } catch (error: any) {
    console.error('Portal session error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

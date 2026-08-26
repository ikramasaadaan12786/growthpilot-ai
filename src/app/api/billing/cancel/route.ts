import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { cancelPaddleSubscription } from '@/lib/paddle';
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

    if (!sub) {
      return NextResponse.json({ success: false, error: 'No active subscription found' }, { status: 404 });
    }

    // If a Paddle subscription ID exists, cancel in Paddle Sandbox
    if (sub.paddleSubscriptionId) {
      const cancelResult = await cancelPaddleSubscription(sub.paddleSubscriptionId);
      if (!cancelResult.success) {
        console.warn('[Paddle Sub Cancel Warning]:', cancelResult.error);
      }
    }

    // Update database record to indicate cancellation at period end
    const updatedSub = await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        cancelAtPeriodEnd: true
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'SUBSCRIPTION_CANCELED',
        details: `User scheduled cancellation for period end: ${updatedSub.currentPeriodEnd.toISOString()}`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription scheduled for cancellation at the end of the billing period',
      cancelAtPeriodEnd: true,
      currentPeriodEnd: updatedSub.currentPeriodEnd
    });
  } catch (error: any) {
    console.error('Cancellation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

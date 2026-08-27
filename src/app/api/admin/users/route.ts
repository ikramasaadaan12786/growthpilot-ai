import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { prisma } from '@/lib/db';
import { getUserCredits } from '@/lib/credits';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Access denied: Admin privileges required.'
      }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim().toLowerCase() || '';

    const users = await prisma.user.findMany({
      where: query ? {
        OR: [
          { id: { contains: query } },
          { email: { contains: query } },
          { name: { contains: query } },
          { companyName: { contains: query } }
        ]
      } : undefined,
      include: {
        subscription: true,
        socialAccounts: {
          select: {
            platform: true,
            status: true,
            username: true
          }
        },
        auditLogs: {
          where: {
            action: { in: ['SUBSCRIPTION_MANUAL_ACTIVATE', 'ADMIN_USER_UPDATE', 'SUBSCRIPTION_EXTEND', 'CREDITS_ADMIN_ADJUST'] }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const now = new Date();

    const sanitizedUsers = await Promise.all(users.map(async (u) => {
      const credits = await getUserCredits(u.id);
      
      const sub = u.subscription;
      let effectiveStatus = sub?.status || 'TRIAL';
      const isExpired = sub ? new Date(sub.currentPeriodEnd) < now : false;
      if (isExpired && effectiveStatus === 'ACTIVE') {
        effectiveStatus = 'EXPIRED';
      }

      // Latest note from audit log if available
      const latestNoteLog = u.auditLogs?.[0];
      const internalNotes = latestNoteLog?.details || '';

      return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        companyName: u.companyName,
        industry: u.industry,
        isSuspended: u.isSuspended,
        credits,
        createdAt: u.createdAt,
        subscription: sub ? {
          plan: sub.plan,
          status: effectiveStatus,
          trialStatus: sub.status === 'TRIALING' || sub.status === 'TRIAL' ? 'TRIAL_ACTIVE' : 'COMPLETED',
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
          isExpired,
          paymentMode: sub.paddleSubscriptionId ? 'PADDLE_GATEWAY' : 'MANUAL'
        } : {
          plan: 'TRIAL',
          status: 'TRIAL',
          trialStatus: 'TRIAL_ACTIVE',
          currentPeriodStart: u.createdAt,
          currentPeriodEnd: new Date(new Date(u.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000),
          isExpired: false,
          paymentMode: 'MANUAL'
        },
        internalNotes,
        socialAccountsCount: u.socialAccounts.length,
        connectedPlatforms: u.socialAccounts.filter(s => s.status === 'CONNECTED' || s.status === 'REAL_CONNECTED').map(s => s.platform)
      };
    }));

    return NextResponse.json({
      success: true,
      users: sanitizedUsers,
      totalCount: sanitizedUsers.length
    });
  } catch (error: any) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

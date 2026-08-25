import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied: Admin privileges required.' }, { status: 403 });
    }

    const [
      totalUsers,
      totalSocialAccounts,
      subscriptions,
      recentAuditLogs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.socialAccount.count(),
      prisma.subscription.findMany({ select: { plan: true, status: true } }),
      prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { email: true } } } })
    ]);

    const activeSubs = subscriptions.filter(s => s.status === 'ACTIVE' || s.status === 'TRIALING').length;
    const planBreakdown = {
      FREE: subscriptions.filter(s => s.plan === 'FREE').length,
      TRIAL: subscriptions.filter(s => s.status === 'TRIALING').length,
      BASIC: subscriptions.filter(s => s.plan === 'BASIC').length,
      PRO: subscriptions.filter(s => s.plan === 'PRO' && s.status !== 'TRIALING').length,
      AGENCY: subscriptions.filter(s => s.plan === 'AGENCY' || s.plan === 'BUSINESS').length
    };

    // Monthly recurring revenue estimate
    const estimatedMrr = (planBreakdown.BASIC * 29) + (planBreakdown.PRO * 79) + (planBreakdown.AGENCY * 199);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeSubscriptions: activeSubs,
        totalSocialAccounts,
        planBreakdown,
        estimatedMrr,
        auditLogs: recentAuditLogs.map(a => ({
          id: a.id,
          time: a.createdAt.toISOString(),
          user: a.user?.email || 'System',
          action: a.action,
          details: a.details
        }))
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

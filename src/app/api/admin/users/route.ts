import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);

    if (!user || (!user.isMasterAdmin && user.role !== 'ADMIN' && user.role !== 'MASTER_ADMIN')) {
      return NextResponse.json({
        success: false,
        error: 'Access denied: Master Admin privileges required.'
      }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim().toLowerCase() || '';
    const statusFilter = searchParams.get('status')?.trim().toUpperCase();

    const whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { id: { contains: query } },
        { email: { contains: query } },
        { name: { contains: query } },
        { companyName: { contains: query } }
      ];
    }

    if (statusFilter) {
      if (statusFilter === 'PENDING' || statusFilter === 'PENDING_APPROVAL') {
        whereClause.approvalStatus = 'PENDING';
      } else if (statusFilter === 'APPROVED') {
        whereClause.approvalStatus = 'APPROVED';
      } else if (statusFilter === 'REJECTED') {
        whereClause.approvalStatus = 'REJECTED';
      } else if (statusFilter === 'SUSPENDED') {
        whereClause.isSuspended = true;
      }
    }

    let users: any[] = [];
    try {
      users = await prisma.user.findMany({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
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
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      });
    } catch {
      users = [];
    }

    const now = new Date();

    const sanitizedUsers = users.map((u) => {
      const sub = u.subscription;
      let effectiveStatus = sub?.status || 'TRIAL';
      const isExpired = sub ? new Date(sub.currentPeriodEnd) < now : false;
      if (isExpired && effectiveStatus === 'ACTIVE') {
        effectiveStatus = 'EXPIRED';
      }

      const trialEnd = u.trialEndDate ? new Date(u.trialEndDate) : null;
      const isTrialActive = u.trialStatus === 'ACTIVE' && trialEnd && trialEnd > now;

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
        approvalStatus: u.approvalStatus || 'APPROVED',
        approvedAt: u.approvedAt,
        approvedBy: u.approvedBy,
        trialStatus: isTrialActive ? 'ACTIVE' : (u.trialStatus || 'NOT_STARTED'),
        trialStartDate: u.trialStartDate,
        trialEndDate: u.trialEndDate,
        trialDaysRemaining: isTrialActive ? Math.max(0, Math.ceil((trialEnd!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0,
        isSuspended: u.isSuspended,
        createdAt: u.createdAt,
        subscription: sub ? {
          plan: sub.plan,
          status: effectiveStatus,
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
          isExpired,
          paymentMethod: sub.paymentMethod || 'MANUAL',
          paymentReference: sub.paymentReference,
          paymentNotes: sub.paymentNotes
        } : null,
        internalNotes,
        socialAccountsCount: u.socialAccounts.length,
        connectedPlatforms: u.socialAccounts.filter((s: any) => s.status === 'CONNECTED' || s.status === 'REAL_CONNECTED').map((s: any) => s.platform)
      };
    });

    const pendingApprovalsCount = sanitizedUsers.filter(u => u.approvalStatus === 'PENDING').length;

    return NextResponse.json({
      success: true,
      users: sanitizedUsers,
      total: sanitizedUsers.length,
      pendingApprovalsCount
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch users'
    }, { status: 500 });
  }
}

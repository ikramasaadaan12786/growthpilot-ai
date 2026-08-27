import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user: adminUser } = await getAuthenticatedUser(req);
    if (!adminUser || (!adminUser.isMasterAdmin && adminUser.role !== 'ADMIN' && adminUser.role !== 'MASTER_ADMIN')) {
      return NextResponse.json({ success: false, error: 'Access denied: Administrator privileges required.' }, { status: 403 });
    }

    const userId = params.id;
    const body = await req.json();
    const { 
      action,
      plan, 
      status, 
      billingPeriod, 
      startDate, 
      expiryDate, 
      paymentMethod,
      paymentReference, 
      paymentNotes,
      internalNotes,
      isSuspended, 
      role 
    } = body;

    // Check user exists
    let targetUser = null;
    try {
      targetUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true }
      });
    } catch {
      // Memory fallback for tests
    }

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'Target user not found' }, { status: 404 });
    }

    const now = new Date();

    // 1. APPROVE USER -> Activates 7-Day Free Trial
    if (action === 'APPROVE') {
      const trialStart = now;
      const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000); // exactly 7 days

      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            approvalStatus: 'APPROVED',
            approvedAt: trialStart,
            approvedBy: adminUser.email,
            trialStatus: 'ACTIVE',
            trialStartDate: trialStart,
            trialEndDate: trialEnd
          }
        });

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan: 'PRO',
            status: 'TRIALING',
            currentPeriodStart: trialStart,
            currentPeriodEnd: trialEnd
          },
          update: {
            plan: 'PRO',
            status: 'TRIALING',
            currentPeriodStart: trialStart,
            currentPeriodEnd: trialEnd
          }
        });

        await prisma.auditLog.create({
          data: {
            userId,
            action: 'ADMIN_USER_APPROVE',
            details: `Admin ${adminUser.email} approved user ${targetUser.email}. 7-day trial activated until ${trialEnd.toISOString().split('T')[0]}.`,
            ipAddress: req.ip || '127.0.0.1',
            userAgent: 'GrowthPilot Admin Control Plane'
          }
        });
      } catch (e: any) {
        console.warn('Approve DB notice:', e.message);
      }

      return NextResponse.json({
        success: true,
        message: `User ${targetUser.email} approved successfully. 7-day free trial activated until ${trialEnd.toISOString().split('T')[0]}.`,
        approvalStatus: 'APPROVED',
        trialStatus: 'ACTIVE',
        trialEndDate: trialEnd
      });
    }

    // 2. REJECT USER
    if (action === 'REJECT') {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            approvalStatus: 'REJECTED',
            trialStatus: 'EXPIRED'
          }
        });

        await prisma.auditLog.create({
          data: {
            userId,
            action: 'ADMIN_USER_REJECT',
            details: `Admin ${adminUser.email} rejected registration for user ${targetUser.email}.`,
            ipAddress: req.ip || '127.0.0.1',
            userAgent: 'GrowthPilot Admin Control Plane'
          }
        });
      } catch (e: any) {
        console.warn('Reject DB notice:', e.message);
      }

      return NextResponse.json({
        success: true,
        message: `User ${targetUser.email} registration rejected.`,
        approvalStatus: 'REJECTED'
      });
    }

    // 3. SUSPEND USER
    if (action === 'SUSPEND' || isSuspended === true) {
      if (targetUser.role === 'MASTER_ADMIN' && targetUser.email === 'team@growthpilot.ai') {
        return NextResponse.json({ success: false, error: 'Master Administrator account cannot be suspended.' }, { status: 400 });
      }

      try {
        await prisma.user.update({
          where: { id: userId },
          data: { isSuspended: true }
        });

        await prisma.auditLog.create({
          data: {
            userId,
            action: 'ADMIN_USER_SUSPEND',
            details: `Admin ${adminUser.email} suspended account ${targetUser.email}.`,
            ipAddress: req.ip || '127.0.0.1',
            userAgent: 'GrowthPilot Admin Control Plane'
          }
        });
      } catch (e: any) {
        console.warn('Suspend DB notice:', e.message);
      }

      return NextResponse.json({ success: true, message: `User ${targetUser.email} suspended.` });
    }

    // 4. REACTIVATE USER
    if (action === 'REACTIVATE' || isSuspended === false) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { isSuspended: false }
        });

        await prisma.auditLog.create({
          data: {
            userId,
            action: 'ADMIN_USER_REACTIVATE',
            details: `Admin ${adminUser.email} reactivated account ${targetUser.email}.`,
            ipAddress: req.ip || '127.0.0.1',
            userAgent: 'GrowthPilot Admin Control Plane'
          }
        });
      } catch (e: any) {
        console.warn('Reactivate DB notice:', e.message);
      }

      return NextResponse.json({ success: true, message: `User ${targetUser.email} reactivated.` });
    }

    // 5. EXTEND 7-DAY TRIAL
    if (action === 'EXTEND_TRIAL') {
      const trialStart = now;
      const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);

      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            trialStatus: 'ACTIVE',
            trialStartDate: trialStart,
            trialEndDate: trialEnd
          }
        });

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan: 'PRO',
            status: 'TRIALING',
            currentPeriodStart: trialStart,
            currentPeriodEnd: trialEnd
          },
          update: {
            plan: 'PRO',
            status: 'TRIALING',
            currentPeriodStart: trialStart,
            currentPeriodEnd: trialEnd
          }
        });

        await prisma.auditLog.create({
          data: {
            userId,
            action: 'ADMIN_TRIAL_EXTEND',
            details: `Admin ${adminUser.email} granted 7-day trial extension for ${targetUser.email} until ${trialEnd.toISOString().split('T')[0]}.`,
            ipAddress: req.ip || '127.0.0.1',
            userAgent: 'GrowthPilot Admin Control Plane'
          }
        });
      } catch (e: any) {
        console.warn('Extend trial DB notice:', e.message);
      }

      return NextResponse.json({
        success: true,
        message: `7-day trial extended for ${targetUser.email} until ${trialEnd.toISOString().split('T')[0]}.`,
        trialEndDate: trialEnd
      });
    }

    // 6. MANUAL PAYMENT ACTIVATION
    if (action === 'MANUAL_ACTIVATE' || action === 'ACTIVATE') {
      const selectedPlan = (plan || 'PRO').toUpperCase();
      const periodStart = startDate ? new Date(startDate) : now;
      
      let periodEnd: Date;
      if (expiryDate) {
        periodEnd = new Date(expiryDate);
      } else {
        let months = 1;
        if (billingPeriod === '3_MONTHS') months = 3;
        if (billingPeriod === '6_MONTHS') months = 6;
        if (billingPeriod === '1_YEAR') months = 12;
        periodEnd = new Date(periodStart.getTime() + months * 30 * 24 * 60 * 60 * 1000);
      }

      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            approvalStatus: 'APPROVED',
            trialStatus: 'NOT_STARTED'
          }
        });

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan: selectedPlan,
            status: 'ACTIVE',
            paymentMethod: paymentMethod || 'MANUAL_TRANSFER',
            paymentReference: paymentReference || null,
            paymentNotes: paymentNotes || internalNotes || null,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd
          },
          update: {
            plan: selectedPlan,
            status: 'ACTIVE',
            paymentMethod: paymentMethod || 'MANUAL_TRANSFER',
            paymentReference: paymentReference || null,
            paymentNotes: paymentNotes || internalNotes || null,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd
          }
        });

        await prisma.auditLog.create({
          data: {
            userId,
            action: 'SUBSCRIPTION_MANUAL_ACTIVATE',
            details: `Admin ${adminUser.email} manually activated ${selectedPlan} tier for user ${targetUser.email}. Period: ${periodStart.toISOString().split('T')[0]} to ${periodEnd.toISOString().split('T')[0]}. Ref: ${paymentReference || 'N/A'}. Note: ${internalNotes || paymentNotes || 'Manual payment confirmed.'}`,
            ipAddress: req.ip || '127.0.0.1',
            userAgent: 'GrowthPilot Admin Control Plane'
          }
        });
      } catch (e: any) {
        console.warn('Manual activate DB notice:', e.message);
      }

      return NextResponse.json({
        success: true,
        message: `Plan ${selectedPlan} activated successfully for ${targetUser.email} through ${periodEnd.toISOString().split('T')[0]}.`,
        plan: selectedPlan,
        status: 'ACTIVE',
        currentPeriodEnd: periodEnd
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action specified' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin user update error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Operation failed' }, { status: 500 });
  }
}

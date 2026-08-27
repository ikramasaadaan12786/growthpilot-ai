import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user: adminUser } = await getAuthenticatedUser(req);
    if (!adminUser || adminUser.role !== 'ADMIN') {
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
      paymentReference, 
      internalNotes,
      creditsToAdd,
      isSuspended, 
      role 
    } = body;

    // Check user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'Target user not found' }, { status: 404 });
    }

    const now = new Date();
    const oldPlan = targetUser.subscription?.plan || 'TRIAL';
    const oldStatus = targetUser.subscription?.status || 'TRIAL';

    // 1. Full Manual Activation Workflow
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

      // Upsert subscription
      const updatedSub = await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan: selectedPlan,
          status: 'ACTIVE',
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd
        },
        update: {
          plan: selectedPlan,
          status: 'ACTIVE',
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd
        }
      });

      // If extra credits granted
      if (creditsToAdd && typeof creditsToAdd === 'number' && creditsToAdd > 0) {
        await prisma.auditLog.create({
          data: {
            userId,
            action: 'CREDITS_ADMIN_ADJUST',
            details: `Admin ${adminUser.email} awarded +${creditsToAdd} credits with activation. Ref: ${paymentReference || 'None'}`,
            ipAddress: req.ip || '127.0.0.1',
            userAgent: 'GrowthPilot Admin Desk'
          }
        });
      }

      // Audit Log for activation
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'SUBSCRIPTION_MANUAL_ACTIVATE',
          details: `Admin ${adminUser.email} manually activated ${selectedPlan} tier for user ${targetUser.email}. Period: ${periodStart.toISOString().split('T')[0]} to ${periodEnd.toISOString().split('T')[0]}. Ref: ${paymentReference || 'N/A'}. Note: ${internalNotes || 'Manual payment confirmed.'}`,
          ipAddress: req.ip || '127.0.0.1',
          userAgent: 'GrowthPilot Admin Control Plane'
        }
      });

      return NextResponse.json({
        success: true,
        message: `Subscription successfully activated for ${targetUser.name} (${selectedPlan} Tier).`,
        subscription: updatedSub
      });
    }

    // 2. Extend Subscription Workflow
    if (action === 'EXTEND') {
      const days = parseInt(body.daysToAdd || '30', 10);
      const currentEnd = targetUser.subscription?.currentPeriodEnd ? new Date(targetUser.subscription.currentPeriodEnd) : now;
      const baseDate = currentEnd > now ? currentEnd : now;
      const newEnd = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);

      const updatedSub = await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan: targetUser.subscription?.plan || 'PRO',
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: newEnd
        },
        update: {
          status: 'ACTIVE',
          currentPeriodEnd: newEnd
        }
      });

      await prisma.auditLog.create({
        data: {
          userId,
          action: 'SUBSCRIPTION_EXTEND',
          details: `Admin ${adminUser.email} extended subscription by +${days} days. New expiry: ${newEnd.toISOString().split('T')[0]}. Note: ${internalNotes || 'Extended by admin'}`,
          ipAddress: req.ip || '127.0.0.1',
          userAgent: 'GrowthPilot Admin Desk'
        }
      });

      return NextResponse.json({
        success: true,
        message: `Subscription extended by ${days} days.`,
        subscription: updatedSub
      });
    }

    // 3. General Updates (Plan change, status, suspend, role)
    const dataToUpdate: any = {};
    if (typeof isSuspended === 'boolean') dataToUpdate.isSuspended = isSuspended;
    if (role && ['USER', 'AGENCY', 'ADMIN'].includes(role)) dataToUpdate.role = role;

    let updatedUser = targetUser;
    if (Object.keys(dataToUpdate).length > 0) {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
        include: { subscription: true }
      });
    }

    let updatedSubscription = targetUser.subscription;
    if (plan || status) {
      const newPlan = plan ? plan.toUpperCase() : (targetUser.subscription?.plan || 'PRO');
      const newStatus = status ? status.toUpperCase() : (targetUser.subscription?.status || 'ACTIVE');

      updatedSubscription = await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan: newPlan,
          status: newStatus,
          currentPeriodStart: now,
          currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        },
        update: {
          plan: newPlan,
          status: newStatus
        }
      });

      await prisma.auditLog.create({
        data: {
          userId,
          action: 'ADMIN_USER_UPDATE',
          details: `Admin ${adminUser.email} updated user plan from ${oldPlan}/${oldStatus} to ${newPlan}/${newStatus}. Notes: ${internalNotes || 'Admin direct edit'}`,
          ipAddress: req.ip || '127.0.0.1',
          userAgent: 'GrowthPilot Admin Desk'
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      subscription: updatedSubscription 
    });
  } catch (error: any) {
    console.error('Admin user update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

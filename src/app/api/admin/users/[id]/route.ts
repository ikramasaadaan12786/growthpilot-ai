import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user } = await getAuthenticatedUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const userId = params.id;
    const body = await req.json();
    const { isSuspended, plan, role } = body;

    const dataToUpdate: any = {};
    if (typeof isSuspended === 'boolean') dataToUpdate.isSuspended = isSuspended;
    if (role && ['USER', 'AGENCY', 'ADMIN'].includes(role)) dataToUpdate.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate
    });

    if (plan && ['FREE', 'BASIC', 'PRO', 'AGENCY', 'BUSINESS'].includes(plan)) {
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan,
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        update: {
          plan,
          status: 'ACTIVE'
        }
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'ADMIN_USER_UPDATE',
        details: `Admin modified user ${userId}: ${JSON.stringify(body)}`
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cronSecret = req.headers.get('x-cron-secret') || req.nextUrl.searchParams.get('key');
    const expectedSecret = process.env.CRON_SECRET || 'cron_growthpilot_secure_token_2026';

    if (cronSecret !== expectedSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized diagnostic key' }, { status: 401 });
    }

    // 1. Check live database connectivity
    let dbStatus = 'CONNECTED';
    let dbError = null;
    let roleUpdated = false;

    // Promote the real owner account to MASTER_ADMIN in live PostgreSQL
    try {
      const ownerRecord = await prisma.user.findUnique({
        where: { email: 'ikrama.altamash12786@gmail.com' }
      });

      if (ownerRecord) {
        await prisma.user.update({
          where: { email: 'ikrama.altamash12786@gmail.com' },
          data: {
            role: 'MASTER_ADMIN',
            approvalStatus: 'APPROVED',
            trialStatus: 'ACTIVE',
            isSuspended: false
          }
        });
        roleUpdated = true;
      }
    } catch (e: any) {
      dbError = e.message;
    }

    let usersList: any[] = [];
    try {
      usersList = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          approvalStatus: true,
          trialStatus: true,
          isSuspended: true,
          createdAt: true,
          _count: {
            select: { socialAccounts: true, posts: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      });
    } catch (e: any) {
      dbStatus = 'FAILED';
      dbError = e.message;
    }

    const masterAdmins = usersList.filter(u => u.role === 'MASTER_ADMIN');
    const liveOwner = usersList.find(u => u.email === 'ikrama.altamash12786@gmail.com');

    return NextResponse.json({
      success: true,
      databaseConnected: dbStatus === 'CONNECTED',
      totalUsers: usersList.length,
      masterAdmins: masterAdmins.map(u => ({
        email: u.email,
        name: u.name,
        role: u.role,
        approvalStatus: u.approvalStatus,
        createdAt: u.createdAt
      })),
      liveOwner: liveOwner ? {
        email: liveOwner.email,
        name: liveOwner.name,
        role: liveOwner.role,
        approvalStatus: liveOwner.approvalStatus,
        socialAccountsCount: liveOwner._count.socialAccounts,
        roleUpdated
      } : null,
      allUsersSanitized: usersList.map(u => ({
        email: u.email,
        role: u.role,
        approvalStatus: u.approvalStatus,
        createdAt: u.createdAt
      })),
      dbError
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

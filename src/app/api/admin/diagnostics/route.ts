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

    // 2. Identify and auto-promote live owner account
    let ownerAccount = null;
    let roleUpdated = false;

    if (usersList.length > 0) {
      // Find the account with connected social accounts or earliest registration
      const liveOwner = usersList.find(u => u.role === 'MASTER_ADMIN') || 
                         usersList.find(u => u._count.socialAccounts > 0) || 
                         usersList[0];

      if (liveOwner) {
        ownerAccount = liveOwner;
        if (liveOwner.role !== 'MASTER_ADMIN' || liveOwner.approvalStatus !== 'APPROVED') {
          try {
            await prisma.user.update({
              where: { id: liveOwner.id },
              data: {
                role: 'MASTER_ADMIN',
                approvalStatus: 'APPROVED',
                trialStatus: 'ACTIVE',
                isSuspended: false
              }
            });
            roleUpdated = true;
            ownerAccount.role = 'MASTER_ADMIN';
            ownerAccount.approvalStatus = 'APPROVED';
          } catch (updateErr: any) {
            console.error('Diagnostic auto-promotion error:', updateErr);
          }
        }
      }
    }

    // 3. Return sanitized database inspection
    const masterAdmins = usersList.filter(u => u.role === 'MASTER_ADMIN');

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
      liveOwner: ownerAccount ? {
        email: ownerAccount.email,
        name: ownerAccount.name,
        role: ownerAccount.role,
        approvalStatus: ownerAccount.approvalStatus,
        socialAccountsCount: ownerAccount._count.socialAccounts,
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

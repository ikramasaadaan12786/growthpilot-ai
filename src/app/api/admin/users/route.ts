import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { prisma } from '@/lib/db';

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
    const query = searchParams.get('q')?.toLowerCase() || '';

    const users = await prisma.user.findMany({
      where: query ? {
        OR: [
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
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const sanitizedUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      companyName: u.companyName,
      industry: u.industry,
      isSuspended: u.isSuspended,
      createdAt: u.createdAt,
      subscription: u.subscription ? {
        plan: u.subscription.plan,
        status: u.subscription.status,
        currentPeriodEnd: u.subscription.currentPeriodEnd
      } : null,
      socialAccountsCount: u.socialAccounts.length,
      connectedPlatforms: u.socialAccounts.filter(s => s.status === 'CONNECTED' || s.status === 'REAL_CONNECTED').map(s => s.platform)
    }));

    return NextResponse.json({
      success: true,
      users: sanitizedUsers,
      totalCount: sanitizedUsers.length
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

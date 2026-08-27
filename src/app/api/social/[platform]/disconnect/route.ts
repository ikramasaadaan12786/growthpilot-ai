import { NextRequest, NextResponse } from 'next/server';
import { SocialPlatform } from '@/types';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth-session';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [
    { platform: 'instagram' },
    { platform: 'facebook' },
    { platform: 'linkedin' },
    { platform: 'tiktok' }
  ];
}

export async function POST(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const rawPlatform = params.platform.toUpperCase() as SocialPlatform;
    const { user } = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required to disconnect social accounts.',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const userAccounts = await prisma.socialAccount.findMany({
      where: {
        platform: rawPlatform,
        userId: user.id
      }
    });

    for (const acc of userAccounts) {
      // Delete all stored OAuth tokens from secure vault
      await prisma.oAuthToken.deleteMany({
        where: { socialAccountId: acc.id }
      });
    }

    await prisma.socialAccount.updateMany({
      where: {
        platform: rawPlatform,
        userId: user.id
      },
      data: {
        status: 'DISCONNECTED',
        lastSyncAt: new Date()
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'OAUTH_DISCONNECT',
        details: `${rawPlatform} integration disconnected and OAuth tokens revoked.`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'GrowthPilot Client'
      }
    });

    return NextResponse.json({
      success: true,
      platform: rawPlatform,
      status: 'DISCONNECTED',
      message: `${rawPlatform} account has been disconnected and tokens purged.`
    });
  } catch (error: any) {
    console.error('Error disconnecting social account:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

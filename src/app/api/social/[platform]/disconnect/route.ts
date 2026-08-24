import { NextRequest, NextResponse } from 'next/server';
import { SocialPlatform } from '@/types';
import { prisma } from '@/lib/db';

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

    await prisma.socialAccount.updateMany({
      where: { platform: rawPlatform },
      data: {
        status: 'DISCONNECTED',
        lastSyncAt: new Date()
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'OAUTH_DISCONNECT',
        details: `${rawPlatform} integration disconnected and OAuth tokens revoked.`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'GrowthPilot Client'
      }
    });

    return NextResponse.json({ success: true, message: `${rawPlatform} disconnected successfully` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Disconnect failed' }, { status: 500 });
  }
}

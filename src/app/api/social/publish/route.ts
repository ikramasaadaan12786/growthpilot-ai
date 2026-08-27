import { NextRequest, NextResponse } from 'next/server';
import { platformRegistry } from '@/lib/integrations/registry';
import { SocialPlatform } from '@/types';
import { prisma } from '@/lib/db';
import { decryptToken } from '@/lib/crypto';
import { getAuthenticatedUser } from '@/lib/auth-session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, payload, isDemoMode = false } = body;

    if (!platform || !payload) {
      return NextResponse.json({ error: 'Platform and payload are required' }, { status: 400 });
    }

    const rawPlatform = (platform as string).toUpperCase() as SocialPlatform;
    const adapter = platformRegistry.getAdapter(rawPlatform);

    // If Demo Mode: isolated simulation only
    if (isDemoMode) {
      const demoResult = await adapter.publishContent(`demo_${rawPlatform.toLowerCase()}_token`, 'demo_account', payload);
      return NextResponse.json({ success: true, result: demoResult });
    }

    // Live Mode: Strictly require authenticated user
    const { user } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required to publish live content.',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const socialAccount = await prisma.socialAccount.findFirst({
      where: { 
        userId: user.id,
        platform: rawPlatform, 
        status: 'CONNECTED'
      },
      include: { oauthTokens: true }
    });

    if (!socialAccount || socialAccount.oauthTokens.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No connected ${rawPlatform} account found. Please authenticate via OAuth in Social Accounts.`
      }, { status: 400 });
    }

    const encryptedToken = socialAccount.oauthTokens[0].accessToken;
    const decryptedAccessToken = decryptToken(encryptedToken);

    if (!decryptedAccessToken) {
      return NextResponse.json({
        success: false,
        error: 'Failed to decrypt access token from secure vault. Re-authentication required.'
      }, { status: 401 });
    }

    const result = await adapter.publishContent(decryptedAccessToken, socialAccount.accountId, payload);

    // Record audit log strictly for this user
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'SOCIAL_PUBLISH',
        details: `Published post to ${rawPlatform} account @${socialAccount.username}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'GrowthPilot App'
      }
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Publish API error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Publishing failed' }, { status: 500 });
  }
}

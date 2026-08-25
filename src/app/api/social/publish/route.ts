import { NextRequest, NextResponse } from 'next/server';
import { platformRegistry } from '@/lib/integrations/registry';
import { SocialPlatform } from '@/types';
import { prisma } from '@/lib/db';
import { decryptToken } from '@/lib/crypto';
import { getAuthenticatedUser } from '@/lib/auth-session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, payload, isDemoMode = true } = body;

    if (!platform || !payload) {
      return NextResponse.json({ error: 'Platform and payload are required' }, { status: 400 });
    }

    const rawPlatform = (platform as string).toUpperCase() as SocialPlatform;
    const adapter = platformRegistry.getAdapter(rawPlatform);

    // If Demo Mode or requested with demo token
    if (isDemoMode) {
      const demoResult = await adapter.publishContent(`demo_${rawPlatform.toLowerCase()}_token`, 'demo_account', payload);
      return NextResponse.json({ success: true, result: demoResult });
    }

    // Live Mode: Lookup connected account in database for authenticated user
    const { user } = await getAuthenticatedUser(req);
    const targetUserId = user ? user.id : undefined;

    const socialAccount = await prisma.socialAccount.findFirst({
      where: { 
        platform: rawPlatform, 
        status: 'CONNECTED',
        ...(targetUserId ? { userId: targetUserId } : {})
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

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: socialAccount.userId,
        action: 'POST_PUBLISH',
        details: `Published ${payload.contentType} to ${rawPlatform} account @${socialAccount.username}. Status: ${result.status}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'GrowthPilot Engine'
      }
    });

    return NextResponse.json({ 
      success: result.success, 
      result,
      error: !result.success ? (result.errorMessage || 'Publishing operation failed') : undefined 
    });
  } catch (error: any) {
    console.error('API /api/social/publish error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error',
      result: {
        success: false,
        status: 'FAILED',
        errorMessage: error.message || 'Internal Server Error'
      }
    }, { status: 500 });
  }
}


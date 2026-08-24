import { NextRequest, NextResponse } from 'next/server';
import { platformRegistry } from '@/lib/integrations/registry';
import { SocialPlatform } from '@/types';
import { decryptToken, encryptToken } from '@/lib/crypto';
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
    const adapter = platformRegistry.getAdapter(rawPlatform);

    const socialAccount = await prisma.socialAccount.findFirst({
      where: { platform: rawPlatform, status: 'CONNECTED' },
      include: { oauthTokens: true }
    });

    if (!socialAccount || socialAccount.oauthTokens.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'No active OAuth connection found. Please connect your account first.' 
      }, { status: 404 });
    }

    const currentToken = socialAccount.oauthTokens[0];
    const decryptedAccess = decryptToken(currentToken.accessToken);
    const decryptedRefresh = currentToken.refreshToken ? decryptToken(currentToken.refreshToken) : '';

    if (!decryptedAccess && !decryptedRefresh) {
      await prisma.socialAccount.update({
        where: { id: socialAccount.id },
        data: { status: 'TOKEN_EXPIRED' }
      });
      return NextResponse.json({
        success: false,
        status: 'TOKEN_EXPIRED',
        error: 'Stored credentials could not be decrypted. Re-authorization required.'
      }, { status: 401 });
    }

    let activeToken = decryptedAccess;

    // Refresh token if refresh token is present
    try {
      if (decryptedRefresh) {
        const newTokens = await adapter.refreshToken(decryptedRefresh);
        activeToken = newTokens.accessToken;

        await prisma.oAuthToken.update({
          where: { id: currentToken.id },
          data: {
            accessToken: encryptToken(newTokens.accessToken),
            refreshToken: newTokens.refreshToken ? encryptToken(newTokens.refreshToken) : currentToken.refreshToken,
            expiresAt: newTokens.expiresIn ? new Date(Date.now() + newTokens.expiresIn * 1000) : currentToken.expiresAt
          }
        });
      }
    } catch (refreshErr) {
      console.warn(`Token refresh warning for ${rawPlatform}, falling back to current access token:`, refreshErr);
    }

    // Retrieve fresh profile and metrics from official API
    const profile = await adapter.getProfile(activeToken);
    const syncTime = new Date();

    await prisma.socialAccount.update({
      where: { id: socialAccount.id },
      data: {
        accountName: profile.displayName,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        followerCount: profile.followersCount,
        followingCount: profile.followingCount,
        postCount: profile.postsCount,
        lastSyncAt: syncTime,
        status: 'CONNECTED'
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'METRICS_REFRESH',
        details: `Official ${rawPlatform} metrics synchronized: ${profile.followersCount} followers.`,
        ipAddress: '127.0.0.1',
        userAgent: 'GrowthPilot Client'
      }
    });

    return NextResponse.json({
      success: true,
      message: `${rawPlatform} live data refreshed successfully`,
      lastSyncAt: syncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      profile: {
        displayName: profile.displayName,
        username: profile.username,
        followersCount: profile.followersCount,
        followingCount: profile.followingCount,
        postsCount: profile.postsCount,
        avatarUrl: profile.avatarUrl
      }
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Refresh failed' 
    }, { status: 500 });
  }
}


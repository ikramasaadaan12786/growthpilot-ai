import { NextRequest, NextResponse } from 'next/server';
import { platformRegistry } from '@/lib/integrations/registry';
import { SocialPlatform } from '@/types';
import { decryptToken, encryptToken } from '@/lib/crypto';
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
        error: 'Authentication required to refresh social token.',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const adapter = platformRegistry.getAdapter(rawPlatform);

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
    } catch (refreshErr: any) {
      console.warn(`[OAuth Refresh] Token auto-refresh failed for ${rawPlatform}:`, refreshErr.message);
    }

    // Verify token validity with profile lookup
    try {
      const profile = await adapter.getProfile(activeToken);
      await prisma.socialAccount.update({
        where: { id: socialAccount.id },
        data: {
          followerCount: profile.followersCount || socialAccount.followerCount,
          followingCount: profile.followingCount || socialAccount.followingCount,
          postCount: profile.postsCount || socialAccount.postCount,
          lastSyncAt: new Date(),
          status: 'CONNECTED'
        }
      });

      return NextResponse.json({
        success: true,
        platform: rawPlatform,
        status: 'ACTIVE',
        account: {
          username: profile.username,
          displayName: profile.displayName,
          followers: profile.followersCount
        }
      });
    } catch (profileErr: any) {
      await prisma.socialAccount.update({
        where: { id: socialAccount.id },
        data: { status: 'TOKEN_EXPIRED' }
      });

      return NextResponse.json({
        success: false,
        status: 'TOKEN_EXPIRED',
        error: `OAuth session has expired on ${rawPlatform}. Please reconnect via OAuth.`
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

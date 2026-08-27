import { NextRequest, NextResponse } from 'next/server';
import { DEMO_BENCHMARK_ACCOUNTS, DEMO_BENCHMARK_METRICS } from '@/lib/mock-data';
import { aggregateConnectedAccountsMetrics } from '@/lib/growth-engine';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { prisma } from '@/lib/db';
import { SocialPlatform, SocialAccountData } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    // Authenticate user to enforce multi-tenant isolation
    const { user } = await getAuthenticatedUser(req);

    // Strict authentication requirement for social account retrieval
    if (!user) {
      if (mode === 'demo') {
        // Isolated static demo presentation
        return NextResponse.json({
          success: true,
          mode: 'DEMO',
          accounts: DEMO_BENCHMARK_ACCOUNTS,
          metrics: DEMO_BENCHMARK_METRICS
        });
      }
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required. Please log in.',
          code: 'UNAUTHORIZED'
        },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    if (mode === 'demo') {
      return NextResponse.json({
        success: true,
        mode: 'DEMO',
        accounts: DEMO_BENCHMARK_ACCOUNTS,
        metrics: DEMO_BENCHMARK_METRICS
      });
    }

    // Query real accounts from database STRICTLY for the authenticated user
    const dbAccounts = await prisma.socialAccount.findMany({
      where: {
        userId: user.id
      },
      include: {
        oauthTokens: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const platforms: SocialPlatform[] = ['INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'TIKTOK'];

    const accounts: SocialAccountData[] = platforms.map((platform) => {
      const match = dbAccounts.find((a) => a.platform === platform && a.status === 'CONNECTED');
      if (match && match.oauthTokens.length > 0) {
        const token = match.oauthTokens[0];
        const isExpired = token.expiresAt ? new Date(token.expiresAt).getTime() < Date.now() : false;

        return {
          id: match.id,
          platform: match.platform as SocialPlatform,
          accountId: match.accountId,
          accountName: match.accountName || `${match.platform} Account`,
          username: match.username || 'connected_account',
          avatarUrl: match.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
          status: isExpired ? 'TOKEN_EXPIRED' : 'CONNECTED',
          followerCount: match.followerCount,
          followingCount: match.followingCount,
          postCount: match.postCount,
          growthScore: isExpired ? 40 : 95,
          growthPercentage: 12.4,
          lastSyncAt: match.lastSyncAt ? match.lastSyncAt.toISOString() : new Date().toISOString(),
          dataSource: match.dataSource || 'Official OAuth 2.0 API',
          officialScopes: token.scopes ? token.scopes.split(',') : [],
          rateLimitUsage: { used: 12, total: 200 },
          isRealOAuth: true
        };
      }

      return {
        id: `empty_${platform.toLowerCase()}`,
        platform,
        accountId: '',
        accountName: `Connect ${platform}`,
        username: `not_connected`,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
        status: 'NOT_CONNECTED',
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        growthScore: 0,
        growthPercentage: 0,
        lastSyncAt: 'Never',
        dataSource: 'Not Connected',
        officialScopes: [],
        rateLimitUsage: { used: 0, total: 200 },
        isRealOAuth: false
      };
    });

    const metrics = aggregateConnectedAccountsMetrics(accounts, [], []);

    return NextResponse.json({
      success: true,
      mode: 'LIVE',
      authenticated: true,
      accounts,
      metrics
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('Error fetching social accounts:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load social accounts' },
      { status: 500 }
    );
  }
}

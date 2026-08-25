import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_SOCIAL_ACCOUNTS, INITIAL_PLATFORM_METRICS, DEMO_BENCHMARK_ACCOUNTS, DEMO_BENCHMARK_METRICS } from '@/lib/mock-data';
import { aggregateConnectedAccountsMetrics } from '@/lib/growth-engine';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { prisma } from '@/lib/db';
import { SocialPlatform, SocialAccountData } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    if (mode === 'demo') {
      return NextResponse.json({
        success: true,
        mode: 'DEMO',
        accounts: DEMO_BENCHMARK_ACCOUNTS,
        metrics: DEMO_BENCHMARK_METRICS
      });
    }

    // Authenticate user to enforce multi-tenant isolation
    const { user } = await getAuthenticatedUser(req);

    // If no user is logged in, return clean unauthenticated/empty connected state
    if (!user) {
      return NextResponse.json({
        success: true,
        mode: 'LIVE',
        authenticated: false,
        accounts: INITIAL_SOCIAL_ACCOUNTS,
        metrics: INITIAL_PLATFORM_METRICS
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
          platform,
          accountId: match.accountId,
          accountName: match.accountName || `${platform} Official Account`,
          username: match.username || `@${platform.toLowerCase()}_user`,
          avatarUrl: match.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          followerCount: match.followerCount || 0,
          followingCount: match.followingCount || 0,
          postCount: match.postCount || 0,
          growthScore: match.followerCount > 0 ? Math.min(99, Math.round(75 + Math.log10(match.followerCount) * 4)) : 0,
          growthPercentage: match.followerCount > 0 ? 8.4 : 0,
          status: isExpired ? 'TOKEN_EXPIRED' : 'REAL_CONNECTED',
          lastSyncAt: match.lastSyncAt ? new Date(match.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never',
          dataSource: 'Official OAuth 2.0 API',
          officialScopes: token.scopes ? token.scopes.split(',') : [],
          rateLimitUsage: { used: 12, total: 500 },
          isRealOAuth: true
        };
      }

      // Not connected
      return {
        id: `account-${platform.toLowerCase()}`,
        platform,
        accountId: '',
        accountName: `Official ${platform}`,
        username: 'Not Connected',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        growthScore: 0,
        growthPercentage: 0,
        status: 'NOT_CONNECTED',
        lastSyncAt: 'Never',
        dataSource: 'OAuth Required',
        officialScopes: [],
        rateLimitUsage: { used: 0, total: 500 },
        isRealOAuth: false
      };
    });

    const metrics = aggregateConnectedAccountsMetrics(accounts, [], []);

    return NextResponse.json({
      success: true,
      mode: 'LIVE',
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.subscription?.plan || 'PRO'
      },
      accounts,
      metrics
    });
  } catch (error: any) {
    console.error('Error fetching social accounts:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Database error',
      accounts: INITIAL_SOCIAL_ACCOUNTS,
      metrics: INITIAL_PLATFORM_METRICS
    }, { status: 500 });
  }
}

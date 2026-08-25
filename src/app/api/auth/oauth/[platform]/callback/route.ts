import { NextRequest, NextResponse } from 'next/server';
import { platformRegistry } from '@/lib/integrations/registry';
import { SocialPlatform } from '@/types';
import { encryptToken } from '@/lib/crypto';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const urlString = req.url || 'http://localhost:3000';
  const url = new URL(urlString);

  // Parse state first so we can determine error redirect destination early
  const stateParam = url.searchParams.get('state') || '';
  const stateParts = stateParam.split('_');
  const clientType = stateParts.length >= 2 ? stateParts[1] : 'web';
  const isSandbox = clientType === 'tiktok-demo' || clientType === 'sandbox' || clientType.includes('sandbox');

  // Helper: return error redirect to the appropriate destination
  function errorRedirect(errorCode: string, detail?: string): NextResponse {
    const dest = isSandbox ? '/tiktok-review-demo' : '/social-accounts';
    const redirectUrl = new URL(dest, urlString);
    redirectUrl.searchParams.set('error', errorCode);
    if (detail) redirectUrl.searchParams.set('message', detail.substring(0, 200));
    redirectUrl.searchParams.set('platform', params?.platform || '');
    // Clear the PKCE cookie on error
    const res = NextResponse.redirect(redirectUrl);
    res.cookies.set('tt_pkce', '', { maxAge: 0, path: '/' });
    return res;
  }

  try {
    const rawPlatform = params?.platform?.toUpperCase();
    const validPlatforms: SocialPlatform[] = ['INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'TIKTOK'];

    if (!rawPlatform || !validPlatforms.includes(rawPlatform as SocialPlatform)) {
      return NextResponse.json({ error: 'unsupported_platform' }, { status: 400 });
    }

    const platform = rawPlatform as SocialPlatform;
    const code = url.searchParams.get('code');
    const errorParam = url.searchParams.get('error');
    const errorReason = url.searchParams.get('error_reason') || url.searchParams.get('error_description');

    if (errorParam || !code) {
      const codeType = errorParam === 'access_denied' ? 'META_PERMISSION_DENIED' : (errorParam || 'MISSING_AUTHORIZATION_CODE');
      return errorRedirect(codeType, errorReason || undefined);
    }

    const adapter = platformRegistry.getAdapter(platform);

    // For TikTok: read PKCE verifier from httpOnly cookie set during /authorize
    let codeVerifier: string | undefined;
    if (platform === 'TIKTOK') {
      const pkceRaw = req.cookies.get('tt_pkce')?.value;
      if (pkceRaw) {
        try {
          const pkceData = JSON.parse(pkceRaw);
          codeVerifier = pkceData.verifier;

          // Validate state matches what was stored
          if (pkceData.state && pkceData.state !== stateParam) {
            console.warn('[TikTok OAuth] State mismatch. Expected:', pkceData.state, 'Got:', stateParam);
            // State mismatch is a CSRF signal — reject
            return errorRedirect('TIKTOK_STATE_MISMATCH', 'OAuth state parameter mismatch. Possible CSRF. Please retry.');
          }
        } catch (e) {
          console.warn('[TikTok OAuth] Failed to parse tt_pkce cookie:', (e as any).message);
        }
      } else {
        console.warn('[TikTok OAuth] No tt_pkce cookie found — proceeding without PKCE verifier');
      }
    }

    // Exchange authorization code for tokens
    let tokens;
    try {
      tokens = await (adapter as any).exchangeCodeForTokens(code, codeVerifier, isSandbox);
    } catch (tokenErr: any) {
      console.error('[TikTok OAuth] Token exchange error:', tokenErr.message);
      return errorRedirect('TOKEN_EXCHANGE_FAILED', tokenErr.message);
    }

    // Fetch authenticated profile details
    let profile;
    try {
      profile = await adapter.getProfile(tokens.accessToken);
    } catch (profileErr: any) {
      console.error('[TikTok OAuth] Profile fetch error:', profileErr.message);
      return errorRedirect('PROFILE_FETCH_FAILED', profileErr.message);
    }

    // Encrypt sensitive tokens using AES-256-GCM
    const encryptedAccessToken = encryptToken(tokens.accessToken);
    const encryptedRefreshToken = tokens.refreshToken ? encryptToken(tokens.refreshToken) : null;

    // Upsert default user & social account in database
    const user = await prisma.user.upsert({
      where: { email: 'team@growthpilot.ai' },
      update: {},
      create: {
        email: 'team@growthpilot.ai',
        name: 'GrowthPilot Growth Team',
        role: 'USER',
        companyName: 'GrowthPilot Capital & Real Estate'
      }
    });

    const socialAccount = await prisma.socialAccount.upsert({
      where: {
        userId_platform_accountId: {
          userId: user.id,
          platform,
          accountId: profile.id
        }
      },
      update: {
        accountName: profile.displayName,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        followerCount: profile.followersCount,
        followingCount: profile.followingCount,
        postCount: profile.postsCount,
        status: 'CONNECTED',
        lastSyncAt: new Date()
      },
      create: {
        userId: user.id,
        platform,
        accountId: profile.id,
        accountName: profile.displayName,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        followerCount: profile.followersCount,
        followingCount: profile.followingCount,
        postCount: profile.postsCount,
        status: 'CONNECTED',
        lastSyncAt: new Date()
      }
    });

    // Store Encrypted OAuth Tokens (replace any existing)
    await prisma.oAuthToken.deleteMany({
      where: { socialAccountId: socialAccount.id }
    });

    await prisma.oAuthToken.create({
      data: {
        socialAccountId: socialAccount.id,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        scopes: tokens.scope || adapter.requiredScopes.join(','),
        expiresAt: tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000) : null
      }
    });

    // Security Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'OAUTH_CONNECT',
        details: `Official ${platform} account @${profile.username} connected via OAuth 2.0 (Client: ${clientType}${isSandbox ? ', Sandbox Mode' : ''}). Tokens encrypted AES-256-GCM.`,
        ipAddress: '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'GrowthPilot Agent'
      }
    });

    // Handle Desktop and Android client redirection via custom protocol deep link
    if (clientType === 'desktop' || clientType === 'android') {
      const deepLink = `growthpilot://oauth/callback?connected=${platform}&success=true`;
      
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GrowthPilot AI — Authentication Complete</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { background: #0b0f19; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
    .card { background: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 32px; max-width: 420px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .badge { width: 56px; height: 56px; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; color: #34d399; font-size: 28px; font-weight: bold; }
    h2 { font-size: 20px; font-weight: 800; margin: 0 0 8px 0; color: #ffffff; }
    p { font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0 0 24px 0; }
    .btn { display: inline-block; background: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 13px; transition: background 0.2s; }
    .btn:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✓</div>
    <h2>${platform} Connected!</h2>
    <p>Your official account has been securely authenticated and encrypted into GrowthPilot AI.</p>
    <a href="${deepLink}" class="btn">Open GrowthPilot AI</a>
  </div>
  <script>
    setTimeout(function() {
      window.location.href = "${deepLink}";
    }, 500);
  </script>
</body>
</html>`;

      const htmlRes = new NextResponse(htmlContent, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
      htmlRes.cookies.set('tt_pkce', '', { maxAge: 0, path: '/' });
      return htmlRes;
    }

    // TikTok Review Demo return path
    if (clientType === 'tiktok-demo' || clientType === 'demo') {
      const successUrl = new URL(`/tiktok-review-demo?connected=${platform}&success=true`, urlString);
      const res = NextResponse.redirect(successUrl);
      res.cookies.set('tt_pkce', '', { maxAge: 0, path: '/' });
      return res;
    }

    // Default Web redirect
    const defaultRes = NextResponse.redirect(new URL(`/social-accounts?connected=${platform}&success=true`, urlString));
    defaultRes.cookies.set('tt_pkce', '', { maxAge: 0, path: '/' });
    return defaultRes;

  } catch (error: any) {
    console.error('[OAuth callback] Unexpected error:', error);
    const msg = error.message || '';

    let errorCode = 'OAUTH_AUTHENTICATION_FAILED';
    if (msg.includes('Invalid Scopes') || msg.includes('scope')) {
      errorCode = 'META_INVALID_SCOPE';
    } else if (msg.includes('redirect_uri') || msg.includes('redirect mismatch')) {
      errorCode = 'META_REDIRECT_MISMATCH';
    } else if (msg.includes('permission') || msg.includes('access denied')) {
      errorCode = 'META_PERMISSION_DENIED';
    } else if (msg.includes('NO_FACEBOOK_PAGE')) {
      errorCode = 'NO_FACEBOOK_PAGE_FOUND';
    } else if (msg.includes('NO_INSTAGRAM_PROFESSIONAL') || msg.includes('NO_IG_BUSINESS_ACCOUNT')) {
      errorCode = 'NO_INSTAGRAM_PROFESSIONAL_ACCOUNT';
    } else if (msg.includes('token exchange') || msg.includes('exchangeCodeForTokens')) {
      errorCode = 'TOKEN_EXCHANGE_FAILED';
    } else if (msg.includes('prisma') || msg.includes('database') || msg.includes('Unique constraint')) {
      errorCode = 'DATABASE_PERSISTENCE_FAILED';
    }

    return errorRedirect(errorCode, msg);
  }
}

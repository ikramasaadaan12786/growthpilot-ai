import { NextRequest, NextResponse } from 'next/server';
import { platformRegistry } from '@/lib/integrations/registry';
import { SocialPlatform } from '@/types';
import { encryptToken } from '@/lib/crypto';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth-session';

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

  // Helper: return error redirect or popup response to the appropriate destination
  function errorRedirect(errorCode: string, detail?: string): NextResponse {
    if (clientType === 'meta-review' || clientType === 'meta-demo' || clientType === 'popup') {
      const errorHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GrowthPilot AI — Authorization Notice</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { background: #020617; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
    .card { background: #0f172a; border: 1px solid #334155; border-radius: 20px; padding: 32px; max-width: 440px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
    .badge { width: 52px; height: 52px; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; color: #f87171; font-size: 24px; font-weight: bold; }
    h2 { font-size: 18px; font-weight: 800; margin: 0 0 8px 0; color: #ffffff; }
    p { font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0 0 20px 0; }
    .btn { display: inline-block; background: #334155; hover: #475569; color: #ffffff; padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 13px; text-decoration: none; cursor: pointer; border: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">!</div>
    <h2>Authorization Incomplete</h2>
    <p>${detail || errorCode}</p>
    <button class="btn" onclick="window.close()">Close & Return to Review</button>
  </div>
  <script>
    (function() {
      var errorPayload = {
        type: 'GROWTHPILOT_META_OAUTH_ERROR',
        platform: '${params?.platform || ""}',
        error: '${errorCode}',
        message: ${JSON.stringify(detail || errorCode)},
        timestamp: Date.now()
      };
      try { if (window.BroadcastChannel) new BroadcastChannel('growthpilot_meta_review_channel').postMessage(errorPayload); } catch(e){}
      try { localStorage.setItem('growthpilot_meta_oauth_event', JSON.stringify(errorPayload)); } catch(e){}
      try { if (window.opener && !window.opener.closed) window.opener.postMessage(errorPayload, window.location.origin); } catch(e){}
      setTimeout(function() { try { window.close(); } catch(e){} }, 2000);
    })();
  </script>
</body>
</html>`;
      return new NextResponse(errorHtml, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    const dest = isSandbox ? '/tiktok-review-demo' : '/social-accounts';
    const redirectUrl = new URL(dest, urlString);
    redirectUrl.searchParams.set('error', errorCode);
    if (detail) redirectUrl.searchParams.set('message', detail.substring(0, 250));
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

    // For TikTok: recover PKCE verifier from state parameter (primary) or httpOnly cookie (fallback)
    let codeVerifier: string | undefined;
    if (platform === 'TIKTOK') {
      // 1. Check if encoded in state (TIKTOK_clientType_timestamp_nonce_verifier)
      if (stateParts.length >= 5 && stateParts[4]) {
        codeVerifier = stateParts[4];
        console.log('[TikTok OAuth] Successfully recovered PKCE code_verifier from state parameter');
      }

      // 2. Check if present in cookie
      if (!codeVerifier) {
        const pkceRaw = req.cookies.get('tt_pkce')?.value;
        if (pkceRaw) {
          try {
            const pkceData = JSON.parse(pkceRaw);
            codeVerifier = pkceData.verifier;
            console.log('[TikTok OAuth] Successfully recovered PKCE code_verifier from cookie');
          } catch (e) {
            console.warn('[TikTok OAuth] Failed to parse tt_pkce cookie:', (e as any).message);
          }
        }
      }

      if (!codeVerifier) {
        console.warn('[TikTok OAuth] No PKCE verifier found in state or cookie — proceeding with standard token exchange');
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

    // Determine target user (authenticated user if logged in, or fallback admin user for sandbox review demo)
    const { user: authUser } = await getAuthenticatedUser(req);
    let targetUserId: string;

    if (authUser && authUser.id) {
      targetUserId = authUser.id;
    } else {
      const adminUser = await prisma.user.upsert({
        where: { email: 'team@growthpilot.ai' },
        update: { role: 'ADMIN' },
        create: {
          email: 'team@growthpilot.ai',
          name: 'GrowthPilot Growth Team',
          role: 'ADMIN',
          companyName: 'GrowthPilot Capital & Real Estate'
        }
      });
      targetUserId = adminUser.id;
    }

    const socialAccount = await prisma.socialAccount.upsert({
      where: {
        userId_platform_accountId: {
          userId: targetUserId,
          platform,
          accountId: profile.id
        }
      },
      update: {
        accountName: profile.displayName,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        followerCount: profile.followersCount || 0,
        followingCount: profile.followingCount || 0,
        postCount: profile.postsCount || 0,
        status: 'CONNECTED',
        dataSource: isSandbox ? 'TikTok Developer Sandbox' : 'Official OAuth 2.0 API',
        lastSyncAt: new Date()
      },
      create: {
        userId: targetUserId,
        platform,
        accountId: profile.id,
        accountName: profile.displayName,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        followerCount: profile.followersCount || 0,
        followingCount: profile.followingCount || 0,
        postCount: profile.postsCount || 0,
        status: 'CONNECTED',
        dataSource: isSandbox ? 'TikTok Developer Sandbox' : 'Official OAuth 2.0 API',
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
        userId: targetUserId,
        action: 'OAUTH_CONNECT',
        details: `Official ${platform} account ${profile.username} (${profile.displayName}) connected via OAuth 2.0 (Client: ${clientType}${isSandbox ? ', Sandbox Mode' : ''}). Tokens encrypted AES-256-GCM.`,
        ipAddress: '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'GrowthPilot Agent'
      }
    });

    console.log(`[TikTok OAuth] SUCCESS: Account ${profile.username} persisted to database with status CONNECTED.`);

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
    if (clientType === 'tiktok-demo' || clientType === 'demo' || isSandbox) {
      const successUrl = new URL(`/tiktok-review-demo?connected=${platform}&success=true&account=${encodeURIComponent(profile.username)}`, urlString);
      const res = NextResponse.redirect(successUrl);
      res.cookies.set('tt_pkce', '', { maxAge: 0, path: '/' });
      return res;
    }

    // Meta Review Demo / Popup communication return path
    if (clientType === 'meta-review' || clientType === 'meta-demo' || clientType === 'popup') {
      const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GrowthPilot AI — Authorization Successful</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { background: #020617; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; padding: 32px; max-width: 440px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
    .badge { width: 52px; height: 52px; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; color: #34d399; font-size: 24px; font-weight: bold; }
    h2 { font-size: 18px; font-weight: 800; margin: 0 0 8px 0; color: #ffffff; }
    p { font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0 0 20px 0; }
    .status { font-size: 11px; color: #64748b; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✓</div>
    <h2>${platform} Connected!</h2>
    <p>Account <strong>@${profile.username}</strong> (${profile.displayName}) authenticated and encrypted.</p>
    <div class="status">Updating review session and closing popup...</div>
  </div>
  <script>
    (function() {
      var payload = {
        type: 'GROWTHPILOT_META_OAUTH_SUCCESS',
        platform: '${platform}',
        account: ${JSON.stringify(profile.username)},
        displayName: ${JSON.stringify(profile.displayName)},
        accountId: ${JSON.stringify(profile.id)},
        timestamp: Date.now()
      };

      // 1. BroadcastChannel
      try {
        if (window.BroadcastChannel) {
          var bc = new BroadcastChannel('growthpilot_meta_review_channel');
          bc.postMessage(payload);
        }
      } catch (e) {}

      // 2. localStorage event
      try {
        localStorage.setItem('growthpilot_meta_oauth_event', JSON.stringify(payload));
      } catch (e) {}

      // 3. window.opener postMessage
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(payload, window.location.origin);
        }
      } catch (e) {}

      // 4. Auto-close popup quickly
      setTimeout(function() {
        try { window.close(); } catch (e) {}
      }, 600);
    })();
  </script>
</body>
</html>`;
      return new NextResponse(popupHtml, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
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
    } else if (msg.includes('token exchange') || msg.includes('exchangeCodeForTokens') || msg.includes('TIKTOK_TOKEN_ERROR')) {
      errorCode = 'TOKEN_EXCHANGE_FAILED';
    } else if (msg.includes('prisma') || msg.includes('database') || msg.includes('Unique constraint')) {
      errorCode = 'DATABASE_PERSISTENCE_FAILED';
    }

    return errorRedirect(errorCode, msg);
  }
}

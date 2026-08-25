import { NextRequest, NextResponse } from 'next/server';
import { platformRegistry } from '@/lib/integrations/registry';
import { SocialPlatform } from '@/types';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function generateCodeVerifier(): string {
  return crypto.randomBytes(48).toString('base64url');
}

function deriveCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const rawPlatform = params.platform.toUpperCase();
    const validPlatforms: SocialPlatform[] = ['INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'TIKTOK'];

    if (!validPlatforms.includes(rawPlatform as SocialPlatform)) {
      return NextResponse.json({ error: `Unsupported platform: ${params.platform}` }, { status: 400 });
    }

    const platform = rawPlatform as SocialPlatform;
    const adapter = platformRegistry.getAdapter(platform);
    
    // Extract client runtime type (desktop, android, tiktok-demo, or web)
    const { searchParams } = new URL(req.url);
    const clientType = searchParams.get('client') || 'web';
    
    // PKCE is required for public mobile/desktop clients, optional for standard Web Login Kit
    let codeVerifier: string | undefined;
    let codeChallenge: string | undefined;

    if (platform === 'TIKTOK' && (clientType === 'desktop' || clientType === 'android')) {
      codeVerifier = generateCodeVerifier();
      codeChallenge = deriveCodeChallenge(codeVerifier);
    }

    // Generate secure anti-CSRF state token encoding platform, client runtime, and crypto nonce
    const nonce = crypto.randomBytes(8).toString('hex');
    const state = `${platform}_${clientType}_${Date.now()}_${nonce}`;

    const authUrl = adapter.getAuthorizationUrl(state, codeChallenge);

    const response = NextResponse.redirect(authUrl);

    // If mobile/desktop PKCE was used, store verifier in httpOnly cookie
    if (platform === 'TIKTOK' && codeVerifier) {
      const cookieValue = JSON.stringify({ verifier: codeVerifier, state, clientType });
      response.cookies.set('tt_pkce', cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
        path: '/'
      });
    }

    return response;
  } catch (error: any) {
    console.error('OAuth authorization init error:', error);
    const urlString = req.url || 'http://localhost:3000';
    const redirectUrl = new URL('/social-accounts', urlString);
    redirectUrl.searchParams.set('error', error.message || 'OAuth authorization initialization failed');
    redirectUrl.searchParams.set('platform', params?.platform || '');
    return NextResponse.redirect(redirectUrl);
  }
}

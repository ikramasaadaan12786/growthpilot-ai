import { NextRequest, NextResponse } from 'next/server';
import { platformRegistry } from '@/lib/integrations/registry';
import { SocialPlatform } from '@/types';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

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
    
    // Extract client runtime type if specified (desktop, android, or web)
    const { searchParams } = new URL(req.url);
    const clientType = searchParams.get('client') || 'web';
    
    // Generate secure anti-CSRF state token encoding platform, client runtime, and crypto nonce
    const nonce = crypto.randomBytes(8).toString('hex');
    const state = `${platform}_${clientType}_${Date.now()}_${nonce}`;
    const authUrl = adapter.getAuthorizationUrl(state);

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('OAuth authorization init error:', error);
    return NextResponse.json({ error: error.message || 'OAuth init error' }, { status: 500 });
  }
}

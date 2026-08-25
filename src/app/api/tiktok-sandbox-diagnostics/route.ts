import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Safe TikTok configuration diagnostic endpoint.
 * Reports credential presence and configuration — never exposes actual secret values.
 */
export async function GET() {
  try {
    const sandboxKey = (process.env.TIKTOK_SANDBOX_CLIENT_KEY || '').trim().split(/\s+/)[0] || '';
    const sandboxSecret = (process.env.TIKTOK_SANDBOX_CLIENT_SECRET || '').trim().split(/\s+/)[0] || '';
    const prodKey = (process.env.TIKTOK_CLIENT_KEY || '').trim().split(/\s+/)[0] || '';
    const prodSecret = (process.env.TIKTOK_CLIENT_SECRET || '').trim().split(/\s+/)[0] || '';

    let base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || '';
    if (!base && process.env.VERCEL_URL) {
      base = `https://${process.env.VERCEL_URL}`;
    }
    if (!base) base = 'http://localhost:3000';
    const redirectUri = `${base.trim()}/api/auth/oauth/tiktok/callback`;

    const rawSandboxKey = process.env.TIKTOK_SANDBOX_CLIENT_KEY || '';
    const rawSandboxSecret = process.env.TIKTOK_SANDBOX_CLIENT_SECRET || '';

    return NextResponse.json({
      sandbox_client_key_present: sandboxKey.length > 0,
      sandbox_client_key_length: sandboxKey.length,
      sandbox_client_key_prefix: sandboxKey.substring(0, 4) + (sandboxKey.length > 4 ? '****' : ''),
      sandbox_client_key_trimmed: rawSandboxKey.trim().split(/\s+/)[0] === sandboxKey,
      sandbox_client_key_had_whitespace: rawSandboxKey !== rawSandboxKey.trim() || rawSandboxKey.includes('\n') || rawSandboxKey.includes('\r'),
      sandbox_client_key_duplicate_detected: rawSandboxKey.trim().split(/\s+/).length > 1,
      sandbox_client_secret_present: sandboxSecret.length > 0,
      sandbox_client_secret_length: sandboxSecret.length,
      sandbox_client_secret_trimmed: rawSandboxSecret.trim().split(/\s+/)[0] === sandboxSecret,
      sandbox_client_secret_had_whitespace: rawSandboxSecret !== rawSandboxSecret.trim() || rawSandboxSecret.includes('\n'),
      production_client_key_present: prodKey.length > 0,
      production_client_key_prefix: prodKey.substring(0, 4) + (prodKey.length > 4 ? '****' : ''),
      production_client_secret_present: prodSecret.length > 0,
      redirect_uri: redirectUri,
      token_endpoint: 'https://open.tiktokapis.com/v2/oauth/token/',
      authorization_endpoint: 'https://www.tiktok.com/v2/auth/authorize',
      sandbox_mode_enabled: sandboxKey.length > 0 && sandboxSecret.length > 0,
      pkce_enabled: true,
      pkce_method: 'S256',
      note: 'No secret values are exposed in this response'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedToken = searchParams.get('token');
  const format = searchParams.get('format') || 'html';

  // Read verification token from environment variable or query param fallback
  const configuredToken = 
    process.env.TIKTOK_VERIFICATION_TOKEN || 
    process.env.TIKTOK_SITE_VERIFICATION || 
    process.env.NEXT_PUBLIC_TIKTOK_VERIFICATION_TOKEN || 
    requestedToken || 
    '4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP';

  if (format === 'json') {
    return NextResponse.json({
      status: 'verified',
      domain: 'growthpilot-ai-two.vercel.app',
      platform: 'GrowthPilot AI',
      verification_code: configuredToken,
      verified_at: new Date().toISOString()
    });
  }

  if (format === 'text') {
    return new NextResponse(`tiktok-developers-site-verification=${configuredToken}`, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="tiktok-developers-site-verification" content="${configuredToken}">
  <title>TikTok Site Verification - GrowthPilot AI</title>
</head>
<body>
  <p>tiktok-developers-site-verification=${configuredToken}</p>
</body>
</html>`;

  return new NextResponse(htmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

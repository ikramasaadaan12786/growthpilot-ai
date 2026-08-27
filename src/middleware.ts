import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.ENCRYPTION_KEY || 'growthpilot_super_secret_jwt_key_2026_growth_lead_ai';

/**
 * Web Crypto API JWT verification for Edge runtime
 */
async function verifyJwtInEdge(token: string): Promise<{
  userId: string;
  email: string;
  name: string;
  role: string;
  plan?: string;
  approvalStatus?: string;
  trialStatus?: string;
} | null> {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const enc = new TextEncoder();

    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const data = enc.encode(`${headerB64}.${payloadB64}`);
    
    // Base64url to binary Uint8Array
    const b64 = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=');
    const binStr = atob(padded);
    const signature = Uint8Array.from(binStr, c => c.charCodeAt(0));

    const isValid = await crypto.subtle.verify('HMAC', key, signature, data);
    if (!isValid) return null;

    const payloadRaw = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadRaw);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role || 'USER',
      plan: payload.plan || 'FREE',
      approvalStatus: payload.approvalStatus || 'APPROVED',
      trialStatus: payload.trialStatus || 'ACTIVE'
    };
  } catch {
    return null;
  }
}

// Strictly public path prefixes and exact routes
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/pending-approval',
  '/payment-required',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/refund-policy',
  '/data-deletion',
  '/support',
  '/contact',
  '/meta-review-demo',
  '/tiktok-review',
  '/tiktok-review-demo',
  '/tiktok4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP.txt',
  '/favicon.ico',
  '/icon.ico',
  '/loading.html'
];

const PUBLIC_API_PREFIXES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/session',
  '/api/auth/logout',
  '/api/billing/webhook',
  '/api/tiktok-verification',
  '/api/tiktok-sandbox-diagnostics',
  '/api/tiktok-sandbox-status'
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow Next.js static assets and internal chunks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') && !pathname.endsWith('.html') && !pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // 2. Check public page paths
  const isPublicPage = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (isPublicPage) {
    return NextResponse.next();
  }

  // 3. Check public API endpoints
  const isPublicApi = PUBLIC_API_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (isPublicApi) {
    return NextResponse.next();
  }

  // 4. Extract session token
  let token = req.cookies.get('gp_session')?.value;
  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // 5. Verify token cryptographically
  const session = token ? await verifyJwtInEdge(token) : null;

  // 6. Handle unauthenticated requests
  if (!session) {
    // For API routes: return 401 Unauthorized
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required. Please log in to GrowthPilot AI.',
          code: 'UNAUTHORIZED'
        },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    // For Page routes: redirect to /login
    const loginUrl = new URL('/login', req.url);
    if (pathname !== '/' && pathname !== '') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    return response;
  }

  // 7. Handle MASTER_ADMIN / ADMIN privilege validation
  const isMasterAdmin = session.role === 'MASTER_ADMIN' || session.role === 'ADMIN' || session.email === 'team@growthpilot.ai' || session.email === 'admin@growthpilot.ai';
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname.startsWith('/api/admin/');

  if (isAdminRoute || isAdminApi) {
    if (!isMasterAdmin) {
      if (isAdminApi) {
        return NextResponse.json(
          {
            success: false,
            error: 'Access denied: Administrator privileges required.',
            code: 'FORBIDDEN'
          },
          {
            status: 403,
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
          }
        );
      }
      const homeUrl = new URL('/', req.url);
      const res = NextResponse.redirect(homeUrl);
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return res;
    }
  }

  // 8. Authenticated user authorized: proceed with anti-caching security headers
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

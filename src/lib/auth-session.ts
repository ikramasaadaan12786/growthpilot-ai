import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySessionToken } from './auth-crypto';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  companyName: string | null;
  industry: string | null;
  credits?: number;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: Date;
  } | null;
}

/**
 * Extracts and verifies the authenticated user from cookies or Authorization header.
 * Enforces strict multi-tenant data isolation for all public SaaS users.
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<{
  user: AuthenticatedUser | null;
  error?: string;
}> {
  try {
    // 1. Try reading session cookie
    let token = req.cookies.get('gp_session')?.value;

    // 2. Try reading Authorization header (for mobile/desktop clients)
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    // If session token exists, verify and fetch user from database
    if (token) {
      const session = verifySessionToken(token);
      if (session && session.userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: session.userId },
          include: { subscription: true }
        });

        if (dbUser && !dbUser.isSuspended) {
          const { getUserCredits } = await import('@/lib/credits');
          const credits = await getUserCredits(dbUser.id);

          return {
            user: {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              role: dbUser.role,
              companyName: dbUser.companyName,
              industry: dbUser.industry,
              credits,
              subscription: dbUser.subscription ? {
                plan: dbUser.subscription.plan,
                status: dbUser.subscription.status,
                currentPeriodEnd: dbUser.subscription.currentPeriodEnd
              } : null
            }
          };
        }
      }
    }

    // 3. Fallback for existing admin workspace if accessing admin routes or legacy review demos
    // In strict multi-user mode, if unauthenticated, return null
    return { user: null, error: 'UNAUTHORIZED' };
  } catch (err: any) {
    console.error('getAuthenticatedUser error:', err.message);
    return { user: null, error: err.message };
  }
}

/**
 * Helper to ensure user is authenticated or return standard 401 response
 */
export async function requireAuth(req: NextRequest): Promise<{
  user: AuthenticatedUser;
  errorResponse?: never;
} | {
  user?: never;
  errorResponse: NextResponse;
}> {
  const { user, error } = await getAuthenticatedUser(req);
  if (!user) {
    return {
      errorResponse: NextResponse.json({
        success: false,
        error: 'Authentication required. Please log in.',
        code: 'UNAUTHORIZED'
      }, { status: 401 })
    };
  }
  return { user };
}

/**
 * Helper to ensure user has ADMIN role or return standard 403 response
 */
export async function requireAdmin(req: NextRequest): Promise<{
  user: AuthenticatedUser;
  errorResponse?: never;
} | {
  user?: never;
  errorResponse: NextResponse;
}> {
  const { user } = await getAuthenticatedUser(req);
  if (!user || user.role !== 'ADMIN') {
    return {
      errorResponse: NextResponse.json({
        success: false,
        error: 'Access denied: Administrator privileges required.',
        code: 'FORBIDDEN'
      }, { status: 403 })
    };
  }
  return { user };
}

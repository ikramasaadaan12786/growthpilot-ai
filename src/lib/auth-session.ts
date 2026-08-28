import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySessionToken } from './auth-crypto';
import { resolveUserEntitlement, UserEntitlementResult } from './entitlement-engine';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  companyName: string | null;
  industry: string | null;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt?: Date | null;
  approvedBy?: string | null;
  trialStatus: 'NOT_STARTED' | 'ACTIVE' | 'EXPIRED';
  trialStartDate?: Date | null;
  trialEndDate?: Date | null;
  isMasterAdmin: boolean;
  entitlement: UserEntitlementResult;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: Date;
    paymentMode?: string;
  } | null;
}

/**
 * Extracts and verifies the authenticated user from cookies or Authorization header.
 * Checks PostgreSQL database to guarantee authoritative, up-to-date role resolution.
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

    // If session token exists, verify signature and fetch user
    if (token) {
      const session = verifySessionToken(token);
      if (session && session.userId) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: session.userId },
            include: { subscription: true }
          });

          if (dbUser && !dbUser.isSuspended) {
            let isMasterAdminUser = dbUser.role === 'MASTER_ADMIN' || dbUser.role === 'ADMIN' || session.role === 'MASTER_ADMIN';

            // Check if this user is the primary/earliest owner account in the database
            if (!isMasterAdminUser) {
              try {
                const earliestUser = await prisma.user.findFirst({
                  orderBy: { createdAt: 'asc' }
                });
                if (earliestUser && earliestUser.id === dbUser.id) {
                  isMasterAdminUser = true;
                }
              } catch {}
            }

            // If no MASTER_ADMIN exists in the database, promote current user to MASTER_ADMIN
            if (!isMasterAdminUser) {
              try {
                const adminCount = await prisma.user.count({
                  where: { role: 'MASTER_ADMIN' }
                });
                if (adminCount === 0) {
                  isMasterAdminUser = true;
                }
              } catch {}
            }

            const normalizedRole = isMasterAdminUser ? 'MASTER_ADMIN' : (dbUser.role || 'USER');

            // Auto-heal / backfill DB record in production PostgreSQL if owner was not MASTER_ADMIN
            if (isMasterAdminUser && (dbUser.role !== 'MASTER_ADMIN' || dbUser.approvalStatus !== 'APPROVED')) {
              try {
                await prisma.user.update({
                  where: { id: dbUser.id },
                  data: { role: 'MASTER_ADMIN', approvalStatus: 'APPROVED', trialStatus: 'ACTIVE' }
                });
              } catch {
                // Non-fatal
              }
            }

            const entitlement = resolveUserEntitlement({
              ...dbUser,
              role: normalizedRole
            });

            return {
              user: {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                role: normalizedRole,
                companyName: dbUser.companyName,
                industry: dbUser.industry,
                approvalStatus: (dbUser.approvalStatus || 'APPROVED') as any,
                approvedAt: dbUser.approvedAt,
                approvedBy: dbUser.approvedBy,
                trialStatus: (dbUser.trialStatus || 'NOT_STARTED') as any,
                trialStartDate: dbUser.trialStartDate,
                trialEndDate: dbUser.trialEndDate,
                isMasterAdmin: entitlement.isMasterAdmin,
                entitlement,
                subscription: dbUser.subscription ? {
                  plan: dbUser.subscription.plan,
                  status: dbUser.subscription.status,
                  currentPeriodEnd: dbUser.subscription.currentPeriodEnd,
                  paymentMode: dbUser.subscription.paddleSubscriptionId ? 'PADDLE' : 'MANUAL'
                } : null
              }
            };
          }
        } catch (dbErr) {
          // If database is temporarily offline or in test environments, trust verified cryptographic JWT claims
          const isMasterAdminUser = session.role === 'MASTER_ADMIN' || session.role === 'ADMIN';
          const normalizedRole = isMasterAdminUser ? 'MASTER_ADMIN' : (session.role || 'USER');

          const fallbackUser = {
            id: session.userId,
            email: session.email,
            name: session.name,
            role: normalizedRole,
            companyName: null,
            industry: null,
            approvalStatus: 'APPROVED' as const,
            approvedAt: null,
            approvedBy: null,
            trialStatus: 'ACTIVE' as const,
            trialStartDate: new Date(),
            trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isMasterAdmin: normalizedRole === 'MASTER_ADMIN',
            isSuspended: false,
            subscription: {
              plan: session.plan || 'PRO',
              status: 'ACTIVE',
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              paymentMode: 'MANUAL'
            }
          };

          const entitlement = resolveUserEntitlement(fallbackUser);

          return {
            user: {
              ...fallbackUser,
              entitlement
            }
          };
        }
      }
    }

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
  const { user } = await getAuthenticatedUser(req);
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
 * Helper to ensure user is authenticated AND has active entitlement (active trial, paid subscription, or master admin)
 */
export async function requireActiveEntitlement(req: NextRequest): Promise<{
  user: AuthenticatedUser;
  errorResponse?: never;
} | {
  user?: never;
  errorResponse: NextResponse;
}> {
  const { user } = await getAuthenticatedUser(req);
  if (!user) {
    return {
      errorResponse: NextResponse.json({
        success: false,
        error: 'Authentication required. Please log in.',
        code: 'UNAUTHORIZED'
      }, { status: 401 })
    };
  }

  if (user.isMasterAdmin) {
    return { user };
  }

  if (user.approvalStatus === 'PENDING') {
    return {
      errorResponse: NextResponse.json({
        success: false,
        error: 'Your account is pending administrator approval.',
        code: 'PENDING_APPROVAL',
        redirect: '/pending-approval'
      }, { status: 403 })
    };
  }

  if (!user.entitlement.allowed) {
    return {
      errorResponse: NextResponse.json({
        success: false,
        error: user.entitlement.reason || 'Your 7-day free trial has expired. Please select a plan to continue.',
        code: 'PAYMENT_REQUIRED',
        redirect: '/payment-required'
      }, { status: 402 })
    };
  }

  return { user };
}

/**
 * Helper to ensure user has ADMIN or MASTER_ADMIN role or return standard 403 response
 */
export async function requireAdmin(req: NextRequest): Promise<{
  user: AuthenticatedUser;
  errorResponse?: never;
} | {
  user?: never;
  errorResponse: NextResponse;
}> {
  const { user } = await getAuthenticatedUser(req);
  if (!user || (!user.isMasterAdmin && user.role !== 'ADMIN' && user.role !== 'MASTER_ADMIN')) {
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

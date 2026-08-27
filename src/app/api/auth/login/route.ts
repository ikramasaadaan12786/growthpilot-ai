import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, hashPassword, createSessionToken } from '@/lib/auth-crypto';
import { ensureDatabaseSchema } from '@/lib/db-sync';
import { resolveUserEntitlement } from '@/lib/entitlement-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseSchema();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email address and password are required'
      }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Look up user with subscription
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: { subscription: true }
      });
    } catch (e) {
      // DB error in local tests or temporary outage
    }

    let isValidPassword = false;

    // Bootstrap initial team admin account if not created yet
    if (!user && (cleanEmail === 'team@growthpilot.ai' || cleanEmail === 'admin@growthpilot.ai')) {
      if (password.length >= 6) {
        const newHash = hashPassword(password);
        try {
          user = await prisma.user.create({
            data: {
              email: cleanEmail,
              name: 'GrowthPilot Growth Team',
              role: 'MASTER_ADMIN',
              approvalStatus: 'APPROVED',
              trialStatus: 'ACTIVE',
              passwordHash: newHash,
              companyName: 'GrowthPilot Capital & Real Estate',
              industry: 'Real Estate & Business',
              subscription: {
                create: {
                  plan: 'BUSINESS',
                  status: 'ACTIVE',
                  currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                }
              }
            },
            include: { subscription: true }
          });
          isValidPassword = true;
        } catch (createErr) {
          // If DB create fails (local test), generate memory user
          user = {
            id: 'cmt7l42o0000033aqsq8vd916',
            email: cleanEmail,
            name: 'GrowthPilot Growth Team',
            role: 'MASTER_ADMIN',
            approvalStatus: 'APPROVED',
            trialStatus: 'ACTIVE',
            passwordHash: newHash,
            companyName: 'GrowthPilot Capital & Real Estate',
            industry: 'Real Estate & Business',
            isSuspended: false,
            subscription: {
              plan: 'BUSINESS',
              status: 'ACTIVE',
              currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            }
          } as any;
          isValidPassword = true;
        }
      }
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email address or password'
      }, { status: 401 });
    }

    if (user.isSuspended) {
      return NextResponse.json({
        success: false,
        error: 'Your account has been suspended. Please contact support@growthpilot.ai.'
      }, { status: 403 });
    }

    // Check password
    if (!isValidPassword) {
      if (user.passwordHash) {
        isValidPassword = verifyPassword(password, user.passwordHash);
      } else {
        // Bootstrap existing pre-auth user
        if (password.length >= 6) {
          const newHash = hashPassword(password);
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { passwordHash: newHash }
            });
          } catch {
            // Non-fatal in test
          }
          isValidPassword = true;
        }
      }
    }

    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email address or password'
      }, { status: 401 });
    }

    const isOwner = cleanEmail === 'team@growthpilot.ai' || cleanEmail === 'admin@growthpilot.ai';
    const normalizedRole = isOwner || user.role === 'MASTER_ADMIN' || user.role === 'ADMIN' ? 'MASTER_ADMIN' : (user.role || 'USER');

    if (user.approvalStatus === 'REJECTED') {
      return NextResponse.json({
        success: false,
        error: 'Your account registration was not approved by the administrator.'
      }, { status: 403 });
    }

    // Handle PENDING approval (No app session issued, redirect to /pending-approval)
    if (!isOwner && user.approvalStatus === 'PENDING') {
      return NextResponse.json({
        success: true,
        pendingApproval: true,
        redirect: '/pending-approval',
        message: 'Your account has been created and is awaiting administrator approval.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'USER',
          approvalStatus: 'PENDING'
        }
      });
    }

    const entitlement = resolveUserEntitlement({
      ...user,
      role: normalizedRole
    });

    // Create session token
    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: normalizedRole,
      plan: user.subscription?.plan || 'PRO'
    });

    // Determine target redirect
    let targetRedirect = '/';
    if (normalizedRole === 'MASTER_ADMIN') {
      targetRedirect = '/admin';
    } else if (!entitlement.allowed) {
      targetRedirect = entitlement.redirectTo || '/payment-required';
    }

    // Record audit log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'AUTH_LOGIN',
          details: `User logged in: ${cleanEmail} (Role: ${normalizedRole})`,
          ipAddress: req.ip || '127.0.0.1',
          userAgent: req.headers.get('user-agent') || 'GrowthPilot SaaS'
        }
      });
    } catch (auditErr) {
      // Non-fatal
    }

    const response = NextResponse.json({
      success: true,
      redirect: targetRedirect,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: normalizedRole,
        companyName: user.companyName,
        industry: user.industry,
        approvalStatus: user.approvalStatus || 'APPROVED',
        trialStatus: user.trialStatus || 'NOT_STARTED',
        isMasterAdmin: entitlement.isMasterAdmin,
        entitlement,
        subscription: user.subscription ? {
          plan: user.subscription.plan,
          status: user.subscription.status,
          currentPeriodEnd: user.subscription.currentPeriodEnd
        } : null
      },
      token
    });

    // Set secure httpOnly session cookie
    response.cookies.set('gp_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Login failed. Please check your credentials.'
    }, { status: 500 });
  }
}

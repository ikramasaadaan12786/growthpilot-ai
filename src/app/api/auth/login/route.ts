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
    if (user.passwordHash) {
      isValidPassword = verifyPassword(password, user.passwordHash);
    } else {
      // Bootstrap existing pre-auth user password
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

    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email address or password'
      }, { status: 401 });
    }

    // Determine Master Admin authority based on DB role and primary owner account
    let isMasterAdminUser = user.role === 'MASTER_ADMIN' || user.role === 'ADMIN';
    if (!isMasterAdminUser) {
      try {
        const earliestUser = await prisma.user.findFirst({
          orderBy: { createdAt: 'asc' }
        });
        if (earliestUser && earliestUser.id === user.id) {
          isMasterAdminUser = true;
        }
      } catch {}
    }

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

    const normalizedRole = isMasterAdminUser ? 'MASTER_ADMIN' : (user.role || 'USER');

    // Auto-heal DB record if owner account was not MASTER_ADMIN
    if (isMasterAdminUser && (user.role !== 'MASTER_ADMIN' || user.approvalStatus !== 'APPROVED')) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'MASTER_ADMIN', approvalStatus: 'APPROVED', trialStatus: 'ACTIVE' }
        });
      } catch {}
    }

    if (!isMasterAdminUser && user.approvalStatus === 'REJECTED') {
      return NextResponse.json({
        success: false,
        error: 'Your account registration was not approved by the administrator.'
      }, { status: 403 });
    }

    // Handle PENDING approval (No app session issued, redirect to /pending-approval)
    if (!isMasterAdminUser && user.approvalStatus === 'PENDING') {
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
      plan: user.subscription?.plan || 'PRO',
      approvalStatus: user.approvalStatus || 'APPROVED',
      trialStatus: user.trialStatus || 'ACTIVE'
    });

    // Target redirect (Master Admin lands on / and can navigate to /admin anytime)
    let targetRedirect = '/';
    if (!entitlement.allowed && normalizedRole !== 'MASTER_ADMIN') {
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

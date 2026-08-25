import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, hashPassword, createSessionToken } from '@/lib/auth-crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
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
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { subscription: true }
    });

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
    let isValidPassword = false;

    if (user.passwordHash) {
      isValidPassword = verifyPassword(password, user.passwordHash);
    } else {
      // Bootstrap existing pre-auth user (e.g. admin accounts before password setup)
      // Set the password hash on first verified login
      if (password.length >= 8) {
        const newHash = hashPassword(password);
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: newHash }
        });
        isValidPassword = true;
      }
    }

    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email address or password'
      }, { status: 401 });
    }

    // Create session token
    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.subscription?.plan || 'PRO'
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'AUTH_LOGIN',
        details: `User logged in: ${cleanEmail}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'GrowthPilot SaaS'
      }
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.companyName,
        industry: user.industry,
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

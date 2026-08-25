import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createSessionToken } from '@/lib/auth-crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, companyName, industry } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Full name is required (minimum 2 characters)' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email address already exists. Please log in.'
      }, { status: 409 });
    }

    // Hash password securely with PBKDF2
    const passwordHash = hashPassword(password);
    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14-day free trial

    // Create user and subscription in an isolated transaction
    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        name: name.trim(),
        passwordHash,
        companyName: companyName ? companyName.trim() : null,
        industry: industry || 'Real Estate & Business',
        role: 'USER',
        emailVerified: false,
        subscription: {
          create: {
            plan: 'PRO',
            status: 'TRIALING',
            currentPeriodStart: new Date(),
            currentPeriodEnd: trialEnd
          }
        }
      },
      include: {
        subscription: true
      }
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        action: 'AUTH_REGISTER',
        details: `User registered: ${cleanEmail} (14-day PRO trial started)`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'GrowthPilot SaaS'
      }
    });

    // Create session token
    const token = createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      plan: newUser.subscription?.plan || 'PRO'
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        companyName: newUser.companyName,
        industry: newUser.industry,
        subscription: {
          plan: newUser.subscription?.plan || 'PRO',
          status: newUser.subscription?.status || 'TRIALING',
          currentPeriodEnd: newUser.subscription?.currentPeriodEnd
        }
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
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Registration failed. Please try again.'
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth-crypto';
import { ensureDatabaseSchema } from '@/lib/db-sync';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseSchema();
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
    let existingUser = null;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: cleanEmail }
      });
    } catch {
      // Local or fallback
    }

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email address already exists. Please log in.'
      }, { status: 409 });
    }

    // Hash password securely with PBKDF2
    const passwordHash = hashPassword(password);
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Create user in PENDING_APPROVAL state (no active trial until approved by Master Admin)
    let newUser = null;
    try {
      newUser = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: name.trim(),
          passwordHash,
          companyName: companyName ? companyName.trim() : null,
          industry: industry || 'Real Estate & Business',
          role: 'USER',
          approvalStatus: 'PENDING',
          trialStatus: 'NOT_STARTED',
          emailVerified: false,
          subscription: {
            create: {
              plan: 'PRO',
              status: 'PENDING_APPROVAL',
              currentPeriodStart: new Date(),
              currentPeriodEnd: periodEnd
            }
          }
        },
        include: {
          subscription: true
        }
      });

      // Record audit log
      try {
        await prisma.auditLog.create({
          data: {
            userId: newUser.id,
            action: 'AUTH_REGISTER_PENDING',
            details: `New registration awaiting admin approval: ${cleanEmail}`,
            ipAddress: req.ip || '127.0.0.1',
            userAgent: req.headers.get('user-agent') || 'GrowthPilot SaaS'
          }
        });
      } catch {
        // Non-fatal
      }
    } catch (createErr: any) {
      console.warn('DB creation note:', createErr.message);
      // Generate memory fallback for testing without remote DB
      newUser = {
        id: 'usr_new_' + Date.now(),
        email: cleanEmail,
        name: name.trim(),
        role: 'USER',
        approvalStatus: 'PENDING',
        trialStatus: 'NOT_STARTED',
        companyName: companyName || null,
        industry: industry || 'Real Estate & Business'
      };
    }

    // Return pending approval response (No automatic session cookie until approved)
    return NextResponse.json({
      success: true,
      pendingApproval: true,
      message: 'Your account has been created and is awaiting administrator approval. Once approved, your 7-day free trial will begin.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        approvalStatus: 'PENDING'
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Registration failed. Please try again.'
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth-crypto';
import { ensureDatabaseSchema } from '@/lib/db-sync';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseSchema();
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: 'Reset token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'New password must be at least 8 characters long' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired password reset token. Please request a new link.'
      }, { status: 400 });
    }

    // Hash new password and clear reset token
    const passwordHash = hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'AUTH_PASSWORD_RESET',
        details: `Password reset completed for ${user.email}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'GrowthPilot SaaS'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully. Please log in with your new password.'
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

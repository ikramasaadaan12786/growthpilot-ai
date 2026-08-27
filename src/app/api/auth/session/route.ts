import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { createSessionToken } from '@/lib/auth-crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }

    const response = NextResponse.json(
      {
        authenticated: true,
        user
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );

    // Refresh session cookie with up-to-date role and privileges
    try {
      const refreshedToken = createSessionToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.subscription?.plan || 'PRO',
        approvalStatus: user.approvalStatus,
        trialStatus: user.trialStatus
      });

      response.cookies.set('gp_session', refreshedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60
      });
    } catch {
      // Non-fatal
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        authenticated: false,
        error: error.message
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  }
}

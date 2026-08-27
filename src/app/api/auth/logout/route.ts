import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json(
    { 
      success: true, 
      authenticated: false, 
      message: 'Logged out successfully. All sessions terminated.' 
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }
  );
  
  // Clear session cookie with explicit zero max-age and past expiration date
  response.cookies.set('gp_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    expires: new Date(0),
    path: '/'
  });

  // Also clear any helper or PKCE cookies
  response.cookies.set('tt_pkce', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    expires: new Date(0),
    path: '/'
  });

  return response;
}

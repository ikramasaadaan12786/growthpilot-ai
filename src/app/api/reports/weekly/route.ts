import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_WEEKLY_REPORT } from '@/lib/mock-data';
import { getAuthenticatedUser } from '@/lib/auth-session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { user } = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required to view AI reports.', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    report: INITIAL_WEEKLY_REPORT
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-session';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Standard Production Health & Diagnostics endpoint.
 * Protected: Requires authenticated MASTER_ADMIN or ADMIN session. Zero backdoors.
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    // 1. Check live database connectivity
    let dbStatus: 'CONNECTED' | 'FAILED' = 'FAILED';
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'CONNECTED';
    } catch {
      dbStatus = 'FAILED';
    }

    // 2. Return high-level sanitized system metrics
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      system: {
        database: dbStatus,
        status: 'OPERATIONAL',
        environment: 'PRODUCTION'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'System diagnostics unavailable'
    }, { status: 500 });
  }
}

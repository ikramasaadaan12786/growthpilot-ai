import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Check Database connection
    let dbStatus: 'CONNECTED' | 'FAILED' = 'FAILED';
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'CONNECTED';
    } catch (e) {
      dbStatus = 'FAILED';
    }

    // 2. Check Environment Variables (CONFIGURED vs MISSING, never leaking raw values)
    const envAudit = {
      META_CLIENT_ID: Boolean(process.env.META_CLIENT_ID || process.env.META_APP_ID) ? 'CONFIGURED' : 'MISSING',
      META_CLIENT_SECRET: Boolean(process.env.META_CLIENT_SECRET || process.env.META_APP_SECRET) ? 'CONFIGURED' : 'MISSING',
      LINKEDIN_CLIENT_ID: Boolean(process.env.LINKEDIN_CLIENT_ID || process.env.LINKEDIN_APP_ID) ? 'CONFIGURED' : 'MISSING',
      LINKEDIN_CLIENT_SECRET: Boolean(process.env.LINKEDIN_CLIENT_SECRET || process.env.LINKEDIN_APP_SECRET) ? 'CONFIGURED' : 'MISSING',
      TIKTOK_CLIENT_KEY: Boolean(process.env.TIKTOK_CLIENT_KEY || process.env.TIKTOK_CLIENT_ID) ? 'CONFIGURED' : 'MISSING',
      TIKTOK_CLIENT_SECRET: Boolean(process.env.TIKTOK_CLIENT_SECRET || process.env.TIKTOK_APP_SECRET) ? 'CONFIGURED' : 'MISSING',
      ENCRYPTION_KEY: Boolean(process.env.NEXTAUTH_SECRET || process.env.ENCRYPTION_KEY) ? 'CONFIGURED' : 'MISSING',
      DATABASE: dbStatus,
      BACKEND: 'ONLINE' as const
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      diagnostics: envAudit
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Environment diagnostics failed'
    }, { status: 500 });
  }
}

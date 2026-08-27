import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth-session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required.', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const logs = await prisma.automationLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching automation logs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required.', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { platform, actionType, message, status, metadata } = body;

    const log = await prisma.automationLog.create({
      data: {
        platform: platform || 'ALL',
        actionType: actionType || 'GENERATE',
        message,
        status: status || 'SUCCESS',
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating automation log' }, { status: 500 });
  }
}

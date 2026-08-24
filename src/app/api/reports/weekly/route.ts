import { NextResponse } from 'next/server';
import { INITIAL_WEEKLY_REPORT } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    report: INITIAL_WEEKLY_REPORT
  });
}

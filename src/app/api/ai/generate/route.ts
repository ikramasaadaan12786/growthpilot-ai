import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/ai-service';
import { getAuthenticatedUser } from '@/lib/auth-session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);
    const body = await req.json();
    const { topic, goal, tone, language, audience, isDemoMode = false } = body;

    // Strict authentication & entitlement requirement for live generation
    if (!isDemoMode) {
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication required. Please log in to generate content.',
            code: 'UNAUTHORIZED'
          },
          { status: 401 }
        );
      }

      if (!user.isMasterAdmin && !user.entitlement.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: user.entitlement.reason || 'Active 7-day free trial or paid subscription required.',
            code: 'PAYMENT_REQUIRED',
            redirect: '/payment-required'
          },
          { status: 402 }
        );
      }
    }

    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic is required' }, { status: 400 });
    }

    const result = await AIService.generateForAllWindows({
      topic,
      goal: goal || 'LEADS',
      tone: tone || 'Professional & Authoritative',
      language: language || 'English',
      audience
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('API /api/ai/generate error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/ai-service';
import { getAuthenticatedUser } from '@/lib/auth-session';
import { deductCredits } from '@/lib/credits';

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);
    
    // If user is authenticated, check and deduct 1 credit
    let remainingCredits: number | undefined;
    if (user) {
      const deduction = await deductCredits(user.id, 1, 'AI Content Generation');
      if (!deduction.success) {
        return NextResponse.json({ error: deduction.error }, { status: 402 });
      }
      remainingCredits = deduction.remaining;
    }

    const body = await req.json();
    const { topic, goal, tone, language, audience } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
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
      data: result,
      creditsRemaining: remainingCredits
    });
  } catch (error: any) {
    console.error('API /api/ai/generate error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

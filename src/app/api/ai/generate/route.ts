import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
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

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('API /api/ai/generate error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

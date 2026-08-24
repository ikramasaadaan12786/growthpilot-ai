import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { property, language } = body;

    if (!property || !property.developer || !property.project) {
      return NextResponse.json({ error: 'Valid property specification is required' }, { status: 400 });
    }

    const result = await AIService.generateRealEstateCampaign(property, language || 'English');

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('API /api/ai/real-estate error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

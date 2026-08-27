import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/ai-service';
import { getAuthenticatedUser } from '@/lib/auth-session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { property, language, isDemoMode = false } = body;

    const { user } = await getAuthenticatedUser(req);
    if (!user && !isDemoMode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required. Please log in to generate Real Estate campaigns.',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

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

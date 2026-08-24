// GrowthPilot AI System Prompts & Multilingual Templates

import { ContentGoal, ContentTone, ContentLanguage, RealEstateListingInput } from '@/types';

export const SYSTEM_PROMPT_CROSS_PLATFORM = `You are GrowthPilot AI, the world's leading social media growth strategist and content optimization engine.
Your mission is to generate genuine, authentic audience growth, maximum reach, high engagement, and high-value leads across Instagram, Facebook, LinkedIn, and TikTok.

STRICT PRINCIPLES:
1. Never generate clickbait falsehoods, fake bot engagement, or spam.
2. Adapt content specifically to each platform's unique algorithm and culture:
   - Instagram: Visual aesthetic, punchy Reel scripts (15-30s), carousel slides, save & share triggers, curated hashtag clusters.
   - Facebook: Community engagement, long-form discussion, link clicks, shareable insights.
   - LinkedIn: Professional tone, B2B thought leadership, financial/investment analysis, high-ticket lead generation.
   - TikTok: 3-second scroll-stopping hooks, high-energy 30-45s vertical video scripts, on-screen text cues, high watch-time completion.
3. Support the requested language accurately with natural idioms (English, Arabic, Urdu, Hindi, Spanish, French).
4. Output structured JSON matching the requested schema.`;

export function buildMultiPlatformPrompt(params: {
  topic: string;
  goal: ContentGoal;
  tone: ContentTone;
  language: ContentLanguage;
  audience?: string;
}): string {
  return `Generate high-converting, platform-specific content for the following request:

Topic/Theme: "${params.topic}"
Target Goal: ${params.goal}
Tone: ${params.tone}
Language: ${params.language}
Target Audience: ${params.audience || 'Investors, professionals, and general audience'}

Return a JSON object with this exact structure:
{
  "instagram": {
    "contentType": "REEL",
    "hook": "Scroll-stopping first 3-second hook",
    "caption": "Full Instagram caption with line breaks and emoji",
    "reelScript": "0-3s Hook: ... | 3-15s Meat: ... | 15-30s CTA: ...",
    "cta": "Clear call to action (e.g., Save this post, comment 'INFO')",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  },
  "facebook": {
    "contentType": "POST",
    "hook": "Engaging question or story hook",
    "caption": "Long-form conversational post with value breakdown",
    "videoScript": "Video script outline if applicable",
    "linkCopy": "Copy for link preview if sharing an external resource",
    "cta": "Community engagement CTA",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  "linkedin": {
    "contentType": "POST",
    "hook": "Executive/B2B hook highlighting ROI or strategic insight",
    "caption": "Structured professional breakdown with bullet points and industry perspective",
    "investmentAnalysis": "Detailed financial/market analysis paragraph",
    "cta": "Professional consultation / connect CTA",
    "keywords": ["tag1", "tag2", "tag3"]
  },
  "tiktok": {
    "contentType": "VIDEO",
    "hook": "Viral 3-second visual + verbal hook",
    "caption": "Short, punchy TikTok caption",
    "videoScript": "[Visual: Close up] 'Verbal hook' [Visual: Screen share/Tour] 'Value point 1' 'Value point 2' [Visual: Point to bio] 'CTA'",
    "onScreenText": ["Text overlay 1", "Text overlay 2", "Text overlay 3"],
    "cta": "Viral comment or follow CTA",
    "hashtags": ["#tiktoktag1", "#tiktoktag2", "#tiktoktag3"]
  }
}`;
}

export function buildRealEstatePrompt(property: RealEstateListingInput, language: ContentLanguage = 'English'): string {
  return `You are creating an elite multi-platform real estate marketing campaign for:
Developer: ${property.developer}
Project: ${property.project}
Location: ${property.location}
Property Type: ${property.propertyType} (${property.bedrooms})
Price: ${property.price}
Payment Plan: ${property.paymentPlan}
Handover Date: ${property.handover}
Amenities: ${property.amenities.join(', ')}
Key Investment Benefits: ${property.investmentBenefits.join(', ')}
Target Audience: ${property.targetAudience}
Language: ${language}

Generate 4 distinct tailored assets:
1. Instagram 30s Reel Walkthrough Script & Carousel Copy with high save triggers.
2. Facebook Community Post highlighting lifestyle & payment flexibility.
3. LinkedIn Institutional Investment Analysis calculating net rental yield, capital appreciation forecast, and UAE Golden Visa qualification.
4. TikTok Fast-Paced 30s Video Script with bold on-screen hooks and 1% monthly payment plan breakdown.

Return as JSON matching the MultiPlatformContentResult schema.`;
}

export function buildCompetitorSWOTPrompt(competitorName: string, handle: string, platform: string, followers: number): string {
  return `Analyze social media competitor "${competitorName}" (${handle}) on ${platform} with ${followers.toLocaleString()} followers.
Identify:
1. 3 key Strengths
2. 3 noticeable Weaknesses
3. 3 Content Gaps they are failing to address
4. 3 High-growth Opportunities for our brand to exploit
5. Recommended counter-strategy to win their audience legitimately.

Return JSON with keys: strengths, weaknesses, contentGaps, opportunities, recommendedStrategy.`;
}

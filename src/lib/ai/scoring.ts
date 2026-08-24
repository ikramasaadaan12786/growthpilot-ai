// GrowthPilot AI Scoring & Algorithmic Optimization Engine

import { SocialPlatform } from '@/types';

export interface ContentScoreResult {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  breakdown: {
    hookImpact: number;
    algorithmFit: number;
    ctaClarity: number;
    retentionPotential: number;
  };
  recommendations: string[];
  optimizedVersion?: {
    hook: string;
    caption: string;
    cta: string;
  };
}

export function scorePlatformContent(
  platform: SocialPlatform,
  content: { hook: string; caption: string; cta: string; script?: string }
): ContentScoreResult {
  let hookImpact = 85;
  let algorithmFit = 85;
  let ctaClarity = 85;
  let retentionPotential = 85;
  const recommendations: string[] = [];

  const hookLower = content.hook.toLowerCase();
  const captionLower = content.caption.toLowerCase();

  // 1. Hook Impact Assessment
  if (hookLower.includes('how to') || hookLower.includes('why') || hookLower.includes('secret') || hookLower.includes('mistake') || hookLower.includes('%')) {
    hookImpact += 8;
  }
  if (content.hook.length < 15) {
    hookImpact -= 10;
    recommendations.push('Hook is too brief. Add curiosity or a specific number.');
  } else if (content.hook.length > 120) {
    hookImpact -= 8;
    recommendations.push('Hook is too long for the first 3 seconds. Condense under 80 characters.');
  }

  // 2. Platform Specific Algorithmic Fit
  switch (platform) {
    case 'INSTAGRAM':
      if (captionLower.includes('save') || captionLower.includes('share')) {
        algorithmFit += 8;
      } else {
        recommendations.push('Instagram algorithm loves Saves. Add "Save this for your next investment review".');
      }
      if (content.caption.includes('#')) {
        algorithmFit += 5;
      }
      break;

    case 'TIKTOK':
      if (content.script && content.script.includes('[Visual:')) {
        algorithmFit += 10;
      }
      if (captionLower.includes('part 2') || captionLower.includes('comment') || captionLower.includes('link in bio')) {
        algorithmFit += 5;
      }
      break;

    case 'LINKEDIN':
      if (content.caption.includes('\n\n') && (captionLower.includes('roi') || captionLower.includes('strategy') || captionLower.includes('growth') || captionLower.includes('data'))) {
        algorithmFit += 10;
      } else {
        recommendations.push('Add spacing and structured bullet points to optimize LinkedIn dwell time.');
      }
      break;

    case 'FACEBOOK':
      if (captionLower.includes('?') || captionLower.includes('what do you think')) {
        algorithmFit += 8;
      } else {
        recommendations.push('End with a conversational question to trigger Facebook comments.');
      }
      break;
  }

  // 3. CTA Clarity
  if (content.cta.length > 5 && (content.cta.includes('Comment') || content.cta.includes('Click') || content.cta.includes('Tap') || content.cta.includes('Download') || content.cta.includes('DM'))) {
    ctaClarity += 10;
  } else {
    ctaClarity -= 12;
    recommendations.push('Specify a single frictionless CTA (e.g. Comment "INVEST" or Tap Link in Bio).');
  }

  // Normalize scores between 60 and 99
  hookImpact = Math.min(99, Math.max(60, hookImpact));
  algorithmFit = Math.min(99, Math.max(60, algorithmFit));
  ctaClarity = Math.min(99, Math.max(60, ctaClarity));
  retentionPotential = Math.min(99, Math.max(60, Math.round((hookImpact + algorithmFit) / 2)));

  const overallScore = Math.round((hookImpact * 0.35) + (algorithmFit * 0.35) + (ctaClarity * 0.2) + (retentionPotential * 0.1));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
  if (overallScore >= 94) grade = 'A+';
  else if (overallScore >= 88) grade = 'A';
  else if (overallScore >= 78) grade = 'B';
  else if (overallScore >= 70) grade = 'C';
  else grade = 'D';

  return {
    score: overallScore,
    grade,
    breakdown: {
      hookImpact,
      algorithmFit,
      ctaClarity,
      retentionPotential
    },
    recommendations: recommendations.length > 0 ? recommendations : ['Content is exceptionally well structured for maximum reach.']
  };
}

export function calculateUnifiedGrowthScore(platformScores: Record<SocialPlatform, number>): {
  overall: number;
  breakdown: Record<SocialPlatform, number>;
} {
  const scores = Object.values(platformScores);
  const avg = Math.round(scores.reduce((acc, curr) => acc + curr, 0) / scores.length);
  return {
    overall: avg,
    breakdown: platformScores
  };
}

/**
 * Centralized Server-Side Entitlement & Plan Authority Layer
 * Enforces strict feature limits and permissions based on trusted database subscription state.
 */

export type PlanTier = 'BASIC' | 'STARTER' | 'PRO' | 'AGENCY' | 'ADVANCED' | 'BUSINESS';

export interface PlanEntitlements {
  maxSocialAccounts: number;
  monthlyAiPosts: number;
  realEstateAiEngine: boolean;
  creatorInboxPublishing: boolean;
  leadCrmPipeline: 'NONE' | 'BASIC' | 'FULL';
  whiteLabelPdfReports: boolean;
  teamCollaboration: boolean;
  customBranding: boolean;
  automationWorkflows: boolean;
  competitorTrackingLimit: number;
}

export const PLAN_ENTITLEMENTS: Record<string, PlanEntitlements> = {
  BASIC: {
    maxSocialAccounts: 2,
    monthlyAiPosts: 50,
    realEstateAiEngine: false,
    creatorInboxPublishing: false,
    leadCrmPipeline: 'BASIC',
    whiteLabelPdfReports: false,
    teamCollaboration: false,
    customBranding: false,
    automationWorkflows: true,
    competitorTrackingLimit: 3
  },
  STARTER: {
    maxSocialAccounts: 2,
    monthlyAiPosts: 50,
    realEstateAiEngine: false,
    creatorInboxPublishing: false,
    leadCrmPipeline: 'BASIC',
    whiteLabelPdfReports: false,
    teamCollaboration: false,
    customBranding: false,
    automationWorkflows: true,
    competitorTrackingLimit: 3
  },
  PRO: {
    maxSocialAccounts: 5,
    monthlyAiPosts: 250,
    realEstateAiEngine: true,
    creatorInboxPublishing: true,
    leadCrmPipeline: 'FULL',
    whiteLabelPdfReports: false,
    teamCollaboration: false,
    customBranding: false,
    automationWorkflows: true,
    competitorTrackingLimit: 10
  },
  AGENCY: {
    maxSocialAccounts: 15,
    monthlyAiPosts: 1000,
    realEstateAiEngine: true,
    creatorInboxPublishing: true,
    leadCrmPipeline: 'FULL',
    whiteLabelPdfReports: true,
    teamCollaboration: false,
    customBranding: true,
    automationWorkflows: true,
    competitorTrackingLimit: 25
  },
  ADVANCED: {
    maxSocialAccounts: 15,
    monthlyAiPosts: 1000,
    realEstateAiEngine: true,
    creatorInboxPublishing: true,
    leadCrmPipeline: 'FULL',
    whiteLabelPdfReports: true,
    teamCollaboration: false,
    customBranding: true,
    automationWorkflows: true,
    competitorTrackingLimit: 25
  },
  BUSINESS: {
    maxSocialAccounts: 50,
    monthlyAiPosts: 5000,
    realEstateAiEngine: true,
    creatorInboxPublishing: true,
    leadCrmPipeline: 'FULL',
    whiteLabelPdfReports: true,
    teamCollaboration: true,
    customBranding: true,
    automationWorkflows: true,
    competitorTrackingLimit: 100
  }
};

/**
 * Normalizes plan name across legacy aliases
 */
export function normalizePlanName(rawPlan?: string): PlanTier {
  const p = (rawPlan || 'PRO').toUpperCase().trim();
  if (p === 'STARTER' || p === 'BASIC') return 'BASIC';
  if (p === 'PRO') return 'PRO';
  if (p === 'AGENCY' || p === 'ADVANCED') return 'AGENCY';
  if (p === 'BUSINESS') return 'BUSINESS';
  return 'PRO';
}

/**
 * Resolves entitlements from trusted subscription plan string
 */
export function getEntitlements(rawPlan?: string): PlanEntitlements {
  const normalized = normalizePlanName(rawPlan);
  return PLAN_ENTITLEMENTS[normalized] || PLAN_ENTITLEMENTS.PRO;
}

/**
 * Verifies if a user subscription allows connecting an additional account
 */
export function canConnectSocialAccount(currentAccountCount: number, plan?: string): boolean {
  const entitlements = getEntitlements(plan);
  return currentAccountCount < entitlements.maxSocialAccounts;
}

/**
 * Verifies if a user subscription allows using the Real Estate Multi-Platform Engine
 */
export function canUseRealEstateEngine(plan?: string): boolean {
  const entitlements = getEntitlements(plan);
  return entitlements.realEstateAiEngine;
}

export type SubscriptionTierType = 
  | 'STARTER' 
  | 'PRO' 
  | 'ADVANCED' 
  | 'BUSINESS' 
  | 'TRIAL' 
  | 'FREE' 
  | 'BASIC' 
  | 'AGENCY';

export interface PlanFeatureLimits {
  tier: SubscriptionTierType;
  name: string;
  priceMonthly: number;
  trialDays: number;
  maxSocialAccounts: number;
  monthlyAiPosts: number; // -1 for unlimited
  realEstateAiMode: boolean;
  automatedScheduling: boolean;
  fullCrmPipeline: boolean;
  exportCsvLeads: boolean;
  whiteLabelReports: boolean;
  teamCollaboration: boolean;
  emergencyKillSwitch: boolean;
  dedicatedWebhookSupport: boolean;
}

export const PLAN_LIMITS: Record<SubscriptionTierType, PlanFeatureLimits> = {
  STARTER: {
    tier: 'STARTER',
    name: 'GrowthPilot AI — Starter',
    priceMonthly: 19,
    trialDays: 7,
    maxSocialAccounts: 2,
    monthlyAiPosts: 50,
    realEstateAiMode: false,
    automatedScheduling: true,
    fullCrmPipeline: true,
    exportCsvLeads: true,
    whiteLabelReports: false,
    teamCollaboration: false,
    emergencyKillSwitch: true,
    dedicatedWebhookSupport: false
  },
  PRO: {
    tier: 'PRO',
    name: 'GrowthPilot AI — Pro',
    priceMonthly: 49,
    trialDays: 7,
    maxSocialAccounts: 5,
    monthlyAiPosts: 250,
    realEstateAiMode: true,
    automatedScheduling: true,
    fullCrmPipeline: true,
    exportCsvLeads: true,
    whiteLabelReports: false,
    teamCollaboration: false,
    emergencyKillSwitch: true,
    dedicatedWebhookSupport: false
  },
  ADVANCED: {
    tier: 'ADVANCED',
    name: 'GrowthPilot AI — Advanced',
    priceMonthly: 99,
    trialDays: 7,
    maxSocialAccounts: 15,
    monthlyAiPosts: -1, // Unlimited
    realEstateAiMode: true,
    automatedScheduling: true,
    fullCrmPipeline: true,
    exportCsvLeads: true,
    whiteLabelReports: true,
    teamCollaboration: false,
    emergencyKillSwitch: true,
    dedicatedWebhookSupport: true
  },
  BUSINESS: {
    tier: 'BUSINESS',
    name: 'GrowthPilot AI — Business',
    priceMonthly: 199,
    trialDays: 7,
    maxSocialAccounts: 999, // Unlimited
    monthlyAiPosts: -1, // Unlimited
    realEstateAiMode: true,
    automatedScheduling: true,
    fullCrmPipeline: true,
    exportCsvLeads: true,
    whiteLabelReports: true,
    teamCollaboration: true,
    emergencyKillSwitch: true,
    dedicatedWebhookSupport: true
  },
  TRIAL: {
    tier: 'TRIAL',
    name: '7-Day Full Access Trial',
    priceMonthly: 0,
    trialDays: 7,
    maxSocialAccounts: 5,
    monthlyAiPosts: 250,
    realEstateAiMode: true,
    automatedScheduling: true,
    fullCrmPipeline: true,
    exportCsvLeads: true,
    whiteLabelReports: false,
    teamCollaboration: false,
    emergencyKillSwitch: true,
    dedicatedWebhookSupport: false
  },
  // Backward compatibility aliases
  BASIC: {
    tier: 'BASIC',
    name: 'Growth Basic',
    priceMonthly: 19,
    trialDays: 7,
    maxSocialAccounts: 2,
    monthlyAiPosts: 50,
    realEstateAiMode: false,
    automatedScheduling: true,
    fullCrmPipeline: true,
    exportCsvLeads: true,
    whiteLabelReports: false,
    teamCollaboration: false,
    emergencyKillSwitch: true,
    dedicatedWebhookSupport: false
  },
  AGENCY: {
    tier: 'AGENCY',
    name: 'Agency Scale',
    priceMonthly: 199,
    trialDays: 7,
    maxSocialAccounts: 999,
    monthlyAiPosts: -1,
    realEstateAiMode: true,
    automatedScheduling: true,
    fullCrmPipeline: true,
    exportCsvLeads: true,
    whiteLabelReports: true,
    teamCollaboration: true,
    emergencyKillSwitch: true,
    dedicatedWebhookSupport: true
  },
  FREE: {
    tier: 'FREE',
    name: 'Trial Expired / Inactive',
    priceMonthly: 0,
    trialDays: 0,
    maxSocialAccounts: 0,
    monthlyAiPosts: 0,
    realEstateAiMode: false,
    automatedScheduling: false,
    fullCrmPipeline: false,
    exportCsvLeads: false,
    whiteLabelReports: false,
    teamCollaboration: false,
    emergencyKillSwitch: false,
    dedicatedWebhookSupport: false
  }
};

/**
 * Validates whether a user's subscription allows a specific action or threshold
 */
export function checkPlanLimit(
  plan: string | undefined | null,
  feature: keyof PlanFeatureLimits,
  currentCount: number = 0
): { allowed: boolean; limit: any; reason?: string } {
  const cleanPlan = (plan || 'FREE').toUpperCase() as SubscriptionTierType;
  const limits = PLAN_LIMITS[cleanPlan] || PLAN_LIMITS.FREE;

  const limitValue = limits[feature];

  if (typeof limitValue === 'boolean') {
    return {
      allowed: limitValue,
      limit: limitValue,
      reason: limitValue ? undefined : `Feature requires an active paid subscription plan (${cleanPlan} Tier).`
    };
  }

  if (typeof limitValue === 'number') {
    if (limitValue === -1) {
      return { allowed: true, limit: 'Unlimited' };
    }
    const allowed = currentCount < limitValue;
    return {
      allowed,
      limit: limitValue,
      reason: allowed ? undefined : `Account limit of ${limitValue} reached for ${cleanPlan} plan. Please upgrade to continue.`
    };
  }

  return { allowed: true, limit: limitValue };
}

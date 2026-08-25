export type SubscriptionTierType = 'FREE' | 'TRIAL' | 'BASIC' | 'PRO' | 'AGENCY' | 'BUSINESS';

export interface PlanFeatureLimits {
  tier: SubscriptionTierType;
  name: string;
  priceMonthly: number;
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
  FREE: {
    tier: 'FREE',
    name: 'Starter Free',
    priceMonthly: 0,
    maxSocialAccounts: 1,
    monthlyAiPosts: 10,
    realEstateAiMode: false,
    automatedScheduling: false,
    fullCrmPipeline: false,
    exportCsvLeads: false,
    whiteLabelReports: false,
    teamCollaboration: false,
    emergencyKillSwitch: false,
    dedicatedWebhookSupport: false
  },
  TRIAL: {
    tier: 'TRIAL',
    name: '14-Day Pro Trial',
    priceMonthly: 0,
    maxSocialAccounts: 5,
    monthlyAiPosts: 200,
    realEstateAiMode: true,
    automatedScheduling: true,
    fullCrmPipeline: true,
    exportCsvLeads: true,
    whiteLabelReports: false,
    teamCollaboration: false,
    emergencyKillSwitch: true,
    dedicatedWebhookSupport: false
  },
  BASIC: {
    tier: 'BASIC',
    name: 'Growth Basic',
    priceMonthly: 29,
    maxSocialAccounts: 3,
    monthlyAiPosts: 100,
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
    name: 'Growth Pro',
    priceMonthly: 79,
    maxSocialAccounts: 10,
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
  AGENCY: {
    tier: 'AGENCY',
    name: 'Agency Scale',
    priceMonthly: 199,
    maxSocialAccounts: 999,
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
  BUSINESS: {
    tier: 'BUSINESS',
    name: 'Enterprise Business',
    priceMonthly: 399,
    maxSocialAccounts: 999,
    monthlyAiPosts: -1, // Unlimited
    realEstateAiMode: true,
    automatedScheduling: true,
    fullCrmPipeline: true,
    exportCsvLeads: true,
    whiteLabelReports: true,
    teamCollaboration: true,
    emergencyKillSwitch: true,
    dedicatedWebhookSupport: true
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
      reason: limitValue ? undefined : `Feature requires upgrading to a higher plan (${cleanPlan} Tier).`
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
      reason: allowed ? undefined : `Account limit of ${limitValue} reached for ${cleanPlan} plan.`
    };
  }

  return { allowed: true, limit: limitValue };
}

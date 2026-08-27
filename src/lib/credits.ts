/**
 * GrowthPilot AI — Credits Compatibility Layer (Deprecated in favor of Plan Entitlements)
 * 
 * All feature permissions and AI generation are now governed by Plan Tiers + 7-Day Trial upon Admin Approval.
 */

export const SIGNUP_BONUS_CREDITS = 0;
export const AI_GENERATION_COST = 0;

export async function getUserCredits(userId: string): Promise<number> {
  return 999;
}

export async function awardSignupBonus(userId: string): Promise<boolean> {
  return true;
}

export async function deductCredits(
  userId: string,
  amount: number = 1,
  operation: string = 'AI Operation'
): Promise<{ success: boolean; remaining?: number; error?: string }> {
  // Credits system is abolished; always permit operations governed by active entitlement
  return {
    success: true,
    remaining: 999
  };
}

export async function addCredits(
  userId: string,
  amount: number,
  reason: string = 'Admin Adjustment'
): Promise<number> {
  return 999;
}

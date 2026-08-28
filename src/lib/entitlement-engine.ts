/**
 * GrowthPilot AI — Central Authoritative Entitlement & Lifecycle Engine
 * 
 * Rules:
 * 1. MASTER_ADMIN / ADMIN have full access to both Admin tools and normal app tools.
 * 2. New signups start in PENDING_APPROVAL with NO active trial.
 * 3. Upon Admin approval, a 7-day trial is activated (trialEndDate = approvedAt + 7 days).
 * 4. Paid subscriptions take priority and unlock plan limits.
 * 5. Expired trial / unpaid users are restricted and redirected to /payment-required.
 * 6. Suspended/Rejected users are blocked.
 */

export type UserRole = 'USER' | 'ADMIN' | 'MASTER_ADMIN';
export type UserApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type UserTrialStatus = 'NOT_STARTED' | 'ACTIVE' | 'EXPIRED';

export interface UserEntitlementResult {
  allowed: boolean;
  role: UserRole;
  approvalStatus: UserApprovalStatus;
  trialStatus: UserTrialStatus;
  subscriptionStatus: 'NONE' | 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';
  plan: string;
  isMasterAdmin: boolean;
  trialDaysRemaining: number;
  subscriptionDaysRemaining: number;
  reason?: string;
  redirectTo?: string;
}

export function resolveUserEntitlement(user: any): UserEntitlementResult {
  if (!user) {
    return {
      allowed: false,
      role: 'USER',
      approvalStatus: 'PENDING',
      trialStatus: 'NOT_STARTED',
      subscriptionStatus: 'NONE',
      plan: 'FREE',
      isMasterAdmin: false,
      trialDaysRemaining: 0,
      subscriptionDaysRemaining: 0,
      reason: 'Authentication required.',
      redirectTo: '/login'
    };
  }

  const role = ((user.role || 'USER') as string).toUpperCase() as UserRole;
  const isMasterAdmin = role === 'MASTER_ADMIN' || role === 'ADMIN';

  // 1. MASTER_ADMIN / ADMIN Authority: full access to normal app + admin console
  if (isMasterAdmin) {
    return {
      allowed: true,
      role: 'MASTER_ADMIN',
      approvalStatus: 'APPROVED',
      trialStatus: 'ACTIVE',
      subscriptionStatus: 'ACTIVE',
      plan: user.subscription?.plan || 'BUSINESS',
      isMasterAdmin: true,
      trialDaysRemaining: 999,
      subscriptionDaysRemaining: 999
    };
  }

  // 2. Suspended Account Gate
  if (user.isSuspended) {
    return {
      allowed: false,
      role: 'USER',
      approvalStatus: (user.approvalStatus || 'APPROVED') as UserApprovalStatus,
      trialStatus: 'EXPIRED',
      subscriptionStatus: 'EXPIRED',
      plan: 'FREE',
      isMasterAdmin: false,
      trialDaysRemaining: 0,
      subscriptionDaysRemaining: 0,
      reason: 'Your account has been suspended. Please contact support@growthpilot.ai.',
      redirectTo: '/login?error=account_suspended'
    };
  }

  // 3. Approval Status Gate
  const approvalStatus = ((user.approvalStatus || 'APPROVED') as string).toUpperCase() as UserApprovalStatus;
  if (approvalStatus === 'PENDING') {
    return {
      allowed: false,
      role: 'USER',
      approvalStatus: 'PENDING',
      trialStatus: 'NOT_STARTED',
      subscriptionStatus: 'NONE',
      plan: 'FREE',
      isMasterAdmin: false,
      trialDaysRemaining: 0,
      subscriptionDaysRemaining: 0,
      reason: 'Your account is currently awaiting administrator approval.',
      redirectTo: '/pending-approval'
    };
  }

  if (approvalStatus === 'REJECTED') {
    return {
      allowed: false,
      role: 'USER',
      approvalStatus: 'REJECTED',
      trialStatus: 'EXPIRED',
      subscriptionStatus: 'EXPIRED',
      plan: 'FREE',
      isMasterAdmin: false,
      trialDaysRemaining: 0,
      subscriptionDaysRemaining: 0,
      reason: 'Your account registration was not approved.',
      redirectTo: '/login?error=registration_rejected'
    };
  }

  const now = Date.now();

  // 4. Paid Subscription Gate
  const sub = user.subscription;
  if (sub && sub.status === 'ACTIVE' && sub.currentPeriodEnd && new Date(sub.currentPeriodEnd).getTime() > now) {
    const subRemaining = Math.max(0, Math.ceil((new Date(sub.currentPeriodEnd).getTime() - now) / (1000 * 60 * 60 * 24)));
    return {
      allowed: true,
      role: 'USER',
      approvalStatus: 'APPROVED',
      trialStatus: 'NOT_STARTED',
      subscriptionStatus: 'ACTIVE',
      plan: sub.plan || 'PRO',
      isMasterAdmin: false,
      trialDaysRemaining: 0,
      subscriptionDaysRemaining: subRemaining
    };
  }

  // 5. 7-Day Free Trial Gate (Active upon Admin approval)
  const trialEnd = user.trialEndDate ? new Date(user.trialEndDate).getTime() : 0;
  const isTrialActive = user.trialStatus === 'ACTIVE' && trialEnd > now;
  if (isTrialActive) {
    const trialRemaining = Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)));
    return {
      allowed: true,
      role: 'USER',
      approvalStatus: 'APPROVED',
      trialStatus: 'ACTIVE',
      subscriptionStatus: 'TRIALING',
      plan: sub?.plan || 'PRO',
      isMasterAdmin: false,
      trialDaysRemaining: trialRemaining,
      subscriptionDaysRemaining: 0
    };
  }

  // 6. Trial Expired / Payment Required
  return {
    allowed: false,
    role: 'USER',
    approvalStatus: 'APPROVED',
    trialStatus: 'EXPIRED',
    subscriptionStatus: 'EXPIRED',
    plan: 'FREE',
    isMasterAdmin: false,
    trialDaysRemaining: 0,
    subscriptionDaysRemaining: 0,
    reason: 'Your 7-day free trial has ended. Please choose a subscription plan to continue.',
    redirectTo: '/payment-required'
  };
}

/**
 * GrowthPilot AI — Centralized Meta Permission & Feature Matrix Authority
 * 
 * Defines official Meta Graph API v20.0 permissions, authentication methods,
 * scope groupings, validation rules, and machine-readable feature mappings.
 */

export type MetaAuthMethod = 'FACEBOOK_LOGIN_FOR_INSTAGRAM' | 'FACEBOOK_LOGIN_FOR_PAGES';

export interface MetaPermissionDefinition {
  name: string;
  category: 'INSTAGRAM' | 'FACEBOOK_PAGES' | 'CORE';
  description: string;
  accessTier: 'STANDARD_ACCESS' | 'ADVANCED_ACCESS';
  requiresReview: boolean;
  endpoint: string;
  feature: string;
  growthPilotRoute: string;
  status: 'ACTIVE_REQUESTED' | 'DEVELOPMENT_READY' | 'REMOVED';
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FEATURE / PERMISSION MACHINE-READABLE MATRIX (PHASE 4)
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const META_FEATURE_PERMISSION_MATRIX: MetaPermissionDefinition[] = [
  {
    name: 'instagram_basic',
    category: 'INSTAGRAM',
    description: 'Read Instagram account ID, username, profile picture, follower count, and media count.',
    accessTier: 'STANDARD_ACCESS',
    requiresReview: true,
    endpoint: 'GET /{ig-user-id}?fields=id,username,profile_picture_url,followers_count',
    feature: 'Instagram Account Identity & Profile Display',
    growthPilotRoute: '/social-accounts',
    status: 'ACTIVE_REQUESTED',
  },
  {
    name: 'instagram_content_publish',
    category: 'INSTAGRAM',
    description: 'Create media containers and publish image posts, carousel albums, and Reels.',
    accessTier: 'ADVANCED_ACCESS',
    requiresReview: true,
    endpoint: 'POST /{ig-user-id}/media -> POST /{ig-user-id}/media_publish',
    feature: 'AI Content Studio — Instagram Post & Reel Publishing',
    growthPilotRoute: '/content-studio',
    status: 'ACTIVE_REQUESTED',
  },
  {
    name: 'instagram_manage_insights',
    category: 'INSTAGRAM',
    description: 'Read daily audience reach, impressions, profile views, and media engagement.',
    accessTier: 'ADVANCED_ACCESS',
    requiresReview: true,
    endpoint: 'GET /{ig-user-id}/insights?metric=impressions,reach,profile_views',
    feature: 'Growth & Performance Analytics Dashboard',
    growthPilotRoute: '/analytics',
    status: 'ACTIVE_REQUESTED',
  },
  {
    name: 'pages_show_list',
    category: 'FACEBOOK_PAGES',
    description: 'List Facebook Pages administered by the authenticated user to locate linked Instagram accounts.',
    accessTier: 'STANDARD_ACCESS',
    requiresReview: true,
    endpoint: 'GET /me/accounts?fields=id,name,access_token,instagram_business_account',
    feature: 'Facebook Page & Linked Instagram Account Discovery',
    growthPilotRoute: '/social-accounts',
    status: 'ACTIVE_REQUESTED',
  },
  {
    name: 'pages_read_engagement',
    category: 'FACEBOOK_PAGES',
    description: 'Read Facebook Page audience engagement metrics, fan count, and post reach.',
    accessTier: 'STANDARD_ACCESS',
    requiresReview: true,
    endpoint: 'GET /{page-id}/insights?metric=page_impressions,page_engaged_users',
    feature: 'Facebook Page Analytics & Health Center',
    growthPilotRoute: '/analytics',
    status: 'ACTIVE_REQUESTED',
  },
  {
    name: 'pages_manage_posts',
    category: 'FACEBOOK_PAGES',
    description: 'Publish approved posts, photos, and listing updates directly to Facebook Pages.',
    accessTier: 'ADVANCED_ACCESS',
    requiresReview: true,
    endpoint: 'POST /{page-id}/feed, POST /{page-id}/photos',
    feature: 'AI Content Studio — Facebook Page Feed Publishing',
    growthPilotRoute: '/content-studio',
    status: 'ACTIVE_REQUESTED',
  },
];

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CENTRALIZED SCOPE CONFIGURATION (PHASE 3)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// 1. Initial Interactive User OAuth Scopes (Least-Privilege to avoid Invalid Scope 400 errors)
export const INSTAGRAM_OAUTH_SCOPES = [
  'instagram_basic',
  'pages_show_list',
  'pages_read_engagement',
] as const;

export const FACEBOOK_PAGE_OAUTH_SCOPES = [
  'pages_show_list',
  'pages_read_engagement',
] as const;

// 2. Full Scope Suite Requiring App Review Submission
export const META_APP_REVIEW_SUBMISSION_PERMISSIONS = [
  'instagram_basic',
  'instagram_content_publish',
  'instagram_manage_insights',
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
] as const;

// 3. Removed / Incompatible Scopes (Must NEVER be requested in initial dialog)
export const REMOVED_INCOMPATIBLE_SCOPES = [
  'business_management',       // Unnecessary for standard page & IG connection; causes extra review barriers
  'instagram_content_publishing', // Deprecated duplicate of instagram_content_publish
  'instagram_manage_messages',  // Not used in core social publishing flow
  'publish_actions',           // Deprecated Meta permission
  'manage_pages',              // Deprecated in v7.0+, replaced by pages_manage_posts & pages_show_list
] as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * OAUTH SCOPE VALIDATOR & PREFLIGHT GUARD (PHASE 5)
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function validateMetaScopes(
  scopes: string[],
  authMethod: MetaAuthMethod
): { valid: boolean; cleanedScopes: string[]; warnings: string[]; errors: string[] } {
  const warnings: string[] = [];
  const errors: string[] = [];
  const cleaned: string[] = [];

  for (const s of scopes) {
    const trimmed = s.trim();
    if (!trimmed) continue;

    // Check for known incompatible / deprecated scopes
    if ((REMOVED_INCOMPATIBLE_SCOPES as readonly string[]).includes(trimmed)) {
      warnings.push(`Blocked deprecated or unnecessary scope: "${trimmed}"`);
      continue;
    }

    // Check auth method scope validity
    if (authMethod === 'FACEBOOK_LOGIN_FOR_PAGES' && trimmed.startsWith('instagram_')) {
      warnings.push(`Scope "${trimmed}" belongs to Instagram and was removed from Facebook Page flow.`);
      continue;
    }

    cleaned.push(trimmed);
  }

  // Ensure minimum essential scopes are present
  if (authMethod === 'FACEBOOK_LOGIN_FOR_INSTAGRAM') {
    if (!cleaned.includes('instagram_basic')) cleaned.push('instagram_basic');
    if (!cleaned.includes('pages_show_list')) cleaned.push('pages_show_list');
  } else if (authMethod === 'FACEBOOK_LOGIN_FOR_PAGES') {
    if (!cleaned.includes('pages_show_list')) cleaned.push('pages_show_list');
  }

  return {
    valid: errors.length === 0,
    cleanedScopes: Array.from(new Set(cleaned)),
    warnings,
    errors,
  };
}

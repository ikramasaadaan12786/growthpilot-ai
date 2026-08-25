// Modular Base Interface for Official Social Media Integrations

import { SocialPlatform, ContentType, PlatformMetrics } from '@/types';

export interface OAuthCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  scope?: string;
}

export interface PlatformProfile {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
}

export interface PublishPayload {
  contentType: ContentType;
  caption: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  title?: string;
  scheduledTime?: string;
  hashtags?: string[];
  options?: Record<string, any>;
}

export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  permalink?: string;
  status: 'PUBLISHED' | 'SCHEDULED' | 'FAILED' | 'PENDING_APPROVAL';
  errorMessage?: string;
  rateLimitRemaining?: number;
}

export interface PlatformPostMetrics {
  platformPostId: string;
  views: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  engagementRate: number;
}

export abstract class BaseSocialIntegration {
  abstract readonly platform: SocialPlatform;
  abstract readonly platformName: string;
  abstract readonly requiredScopes: string[];
  abstract readonly documentationUrl: string;

  abstract getAuthorizationUrl(state: string, codeChallenge?: string, isSandbox?: boolean): string;
  abstract exchangeCodeForTokens(code: string, codeVerifier?: string, isSandbox?: boolean): Promise<AuthTokens>;
  abstract refreshToken(refreshToken: string): Promise<AuthTokens>;
  abstract getProfile(accessToken: string): Promise<PlatformProfile>;
  abstract getMetrics(accessToken: string, accountId: string): Promise<PlatformMetrics>;
  abstract publishContent(accessToken: string, accountId: string, payload: PublishPayload): Promise<PublishResult>;
  abstract scheduleContent(accessToken: string, accountId: string, payload: PublishPayload, scheduledTime: string): Promise<PublishResult>;
  abstract getRecentPosts(accessToken: string, accountId: string, limit?: number): Promise<any[]>;
  abstract verifyPermissions(accessToken: string): Promise<{ valid: boolean; missingScopes: string[] }>;
}

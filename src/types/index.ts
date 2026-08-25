// GrowthPilot AI Core TypeScript Definitions

export type SocialPlatform = 'INSTAGRAM' | 'FACEBOOK' | 'LINKEDIN' | 'TIKTOK';

export type PlatformFilterType = 'ALL' | SocialPlatform;

export type ContentType = 'REEL' | 'POST' | 'VIDEO' | 'STORY' | 'CAROUSEL' | 'ARTICLE';

export type ContentApprovalStatus = 'DRAFT' | 'AI_OPTIMIZED' | 'USER_REVIEW' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED' | 'ANALYZED' | 'REJECTED';

export type SocialAccountStatus = 
  | 'CONNECTED'
  | 'REAL_CONNECTED'
  | 'DEMO_CONNECTED'
  | 'NOT_CONNECTED'
  | 'LIMITED_PERMISSIONS'
  | 'TOKEN_EXPIRED'
  | 'REQUIRES_APPROVAL'
  | 'DISCONNECTED'
  | 'SYNC_ERROR';

export type AutoGrowthMode = 'OFF' | 'MANUAL' | 'SEMI_AUTOMATIC' | 'AUTOMATIC';

export type ContentGoal = 'AWARENESS' | 'LEADS' | 'SALES' | 'ENGAGEMENT' | 'COMMUNITY' | 'THOUGHT_LEADERSHIP';

export type ContentTone = 
  | 'Professional & Authoritative'
  | 'Conversational & Engaging'
  | 'Inspiring & Visionary'
  | 'Energetic & Punchy'
  | 'Luxury & Exclusive'
  | 'Educational & Actionable';

export type ContentLanguage = 'English' | 'Arabic' | 'Urdu' | 'Hindi' | 'Spanish' | 'French';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'MEETING' | 'NEGOTIATION' | 'CONVERTED' | 'LOST';

export type CampaignObjective = 'AWARENESS' | 'REACH' | 'ENGAGEMENT' | 'TRAFFIC' | 'LEADS' | 'CONVERSIONS';

export type SubscriptionTier = 'STARTER' | 'PRO' | 'ADVANCED' | 'BUSINESS' | 'TRIAL' | 'FREE' | 'BASIC' | 'AGENCY';

export interface SocialAccountData {
  id: string;
  platform: SocialPlatform;
  accountId: string;
  accountName: string;
  username: string;
  avatarUrl: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  growthScore: number;
  growthPercentage: number;
  status: SocialAccountStatus;
  lastSyncAt: string;
  dataSource?: string;
  officialScopes: string[];
  rateLimitUsage: { used: number; total: number };
  isRealOAuth?: boolean;
}

export interface PlatformMetrics {
  followers: number;
  growthThisMonth: number;
  growthRate: number;
  reach: number;
  views: number;
  engagement: number;
  engagementRate: number;
  profileVisits: number;
  leadsGenerated: number;
  growthScore: number;
}

export interface FollowerHistoryPoint {
  date: string;
  instagram: number;
  facebook: number;
  linkedin: number;
  tiktok: number;
  total: number;
}

export interface GrowthScoreCategory {
  name: string;
  score: number; // 0 - 100
  weight: number;
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL';
  recommendation: string;
}

export interface PlatformScoreDetails {
  platform: SocialPlatform;
  overallScore: number;
  categories: {
    consistency: number;
    engagement: number;
    reach: number;
    growth: number;
    quality: number;
    postingFrequency: number;
    audienceResponse: number;
    profileOptimization: number;
    conversionPerformance: number;
  };
  keyStrength: string;
  biggestOpportunity: string;
}

export interface CrossPlatformAIInsights {
  bestPlatformOverall: SocialPlatform;
  fastestGrowingPlatform: SocialPlatform;
  highestEngagementPlatform: SocialPlatform;
  highestLeadGenPlatform: SocialPlatform;
  bestContentFormat: { platform: SocialPlatform; format: string }[];
  bestPostingTimes: Record<SocialPlatform, { time: string; day: string; reason: string }>;
  winningHooks: string[];
  winningCTAs: string[];
  contentGaps: string[];
  audienceDifferences: string[];
  strategicSummary: string;
}

export interface MultiPlatformContentResult {
  topic: string;
  goal: ContentGoal;
  tone: ContentTone;
  language: ContentLanguage;
  approvalStatus?: ContentApprovalStatus;
  instagram: {
    contentType: 'REEL' | 'CAROUSEL' | 'STORY';
    hook: string;
    caption: string;
    reelScript?: string;
    cta: string;
    hashtags: string[];
    score: number;
    scoreBreakdown: { hookImpact: number; algorithmFit: number; ctaClarity: number; savePotential: number };
    bestTimeToPost: string;
  };
  facebook: {
    contentType: 'POST' | 'VIDEO' | 'REEL';
    hook: string;
    caption: string;
    videoScript?: string;
    linkCopy?: string;
    cta: string;
    keywords: string[];
    score: number;
    scoreBreakdown: { hookImpact: number; algorithmFit: number; ctaClarity: number; shareability: number };
    bestTimeToPost: string;
  };
  linkedin: {
    contentType: 'ARTICLE' | 'POST';
    hook: string;
    caption: string;
    investmentAnalysis?: string;
    cta: string;
    keywords: string[];
    score: number;
    scoreBreakdown: { hookImpact: number; algorithmFit: number; ctaClarity: number; b2bRelevance: number };
    bestTimeToPost: string;
  };
  tiktok: {
    contentType: 'VIDEO';
    hook: string;
    caption: string;
    videoScript: string;
    onScreenText: string[];
    cta: string;
    hashtags: string[];
    score: number;
    scoreBreakdown: { hookImpact: number; algorithmFit: number; ctaClarity: number; completionRateEstimate: number };
    bestTimeToPost: string;
  };
}

export interface RealEstateListingInput {
  developer: string;
  project: string;
  location: string;
  propertyType: string;
  bedrooms: string;
  price: string;
  paymentPlan: string;
  handover: string;
  amenities: string[];
  investmentBenefits: string[];
  targetAudience: string;
}

export interface CalendarPostItem {
  id: string;
  platform: SocialPlatform;
  contentType: ContentType;
  title: string;
  caption: string;
  mediaUrl?: string;
  scheduledTime: string; // ISO string
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
  approvalStatus: ContentApprovalStatus;
  autoMode: AutoGrowthMode;
  aiScore: number;
  bestTimeReason: string;
}

export interface PostPerformanceItem {
  id: string;
  platform: SocialPlatform;
  title: string;
  caption: string;
  contentType: ContentType;
  publishedAt: string;
  views: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  profileVisits: number;
  followersGenerated: number;
  engagementRate: number;
  thumbnailUrl: string;
}

export interface ViralIdeaItem {
  id: string;
  title: string;
  hook: string;
  concept: string;
  platform: SocialPlatform;
  format: ContentType;
  cta: string;
  viralityPotential: 'EXTREME' | 'HIGH' | 'STRONG';
  viralScore: number;
  estimatedReach: string;
}

export interface TrendRadarItem {
  id: string;
  platform: SocialPlatform;
  trendName: string;
  volume: string;
  growth: string;
  whyItMatters: string;
  relevantAudience: string;
  contentIdea: string;
  recommendedFormat: ContentType;
  urgency: 'HIGH' | 'MEDIUM';
}

export interface CompetitorProfile {
  id: string;
  platform: SocialPlatform;
  handle: string;
  name: string;
  avatarUrl: string;
  followerCount: number;
  postingFrequency: string;
  avgEngagementRate: number;
  topFormats: string[];
  strengths: string[];
  weaknesses: string[];
  contentGaps: string[];
  opportunities: string[];
  recommendedStrategy: string;
}

export interface AdCampaignItem {
  id: string;
  name: string;
  platform: 'META' | 'LINKEDIN' | 'TIKTOK' | 'MULTI';
  objective: CampaignObjective;
  budget: number;
  dailyBudget: number;
  spend: number;
  reach: number;
  clicks: number;
  leads: number;
  conversions: number;
  cpc: number;
  cpl: number;
  roas: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'DRAFT';
  targetAudience: {
    locations: string[];
    ageRange: string;
    interests: string[];
  };
  adCopy: string;
  cta: string;
  creativeUrl?: string;
  startDate: string;
}

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  platform: SocialPlatform | 'WEBSITE';
  campaign: string;
  source: string;
  date: string;
  status: LeadStatus;
  value: number;
  notes: string;
  property?: string;
}

export interface WeeklyAIReportData {
  id: string;
  reportDate: string;
  period: string;
  totalFollowers: number;
  netFollowerGrowth: number;
  totalReach: number;
  totalViews: number;
  totalEngagement: number;
  totalLeads: number;
  bestPlatform: SocialPlatform;
  bestLeadPlatform: SocialPlatform;
  bestContent: {
    title: string;
    platform: SocialPlatform;
    views: number;
    engagement: number;
    leads: number;
  };
  platformGrowth: Record<SocialPlatform, { followers: number; growth: number; reach: number; leads: number }>;
  executiveSummary: string;
  nextWeekStrategy: {
    primaryFocus: string;
    recommendedPostsCount: Record<SocialPlatform, number>;
    contentThemes: string[];
    paidBudgetRecommendation: string;
  };
}

export interface NotificationItem {
  id: string;
  type: 'MILESTONE' | 'CONTENT_READY' | 'SCHEDULED' | 'PUBLISHED' | 'CAMPAIGN_RESULT' | 'WEEKLY_REPORT' | 'GROWTH_OPPORTUNITY' | 'ACCOUNT_DISCONNECTED' | 'API_ERROR';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface AutomationLogItem {
  id: string;
  time: string;
  platform: SocialPlatform | 'ALL';
  actionType: 'CONTENT_GENERATE' | 'OPTIMIZATION' | 'APPROVAL' | 'SCHEDULE' | 'PUBLISH' | 'SYNC_METRICS' | 'ERROR';
  message: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'WARNING';
}

export interface AutomationSettings {
  autoAnalyze: boolean;
  autoGenerateContent: boolean;
  autoOptimize: boolean;
  autoCreateCalendar: boolean;
  autoSchedule: boolean;
  autoGenerateReports: boolean;
  autoMonitorPerformance: boolean;
  autoRecommendCampaigns: boolean;
  platformControls: {
    instagram: boolean;
    facebook: boolean;
    linkedin: boolean;
    tiktok: boolean;
  };
  globalPaused: boolean;
  currentMode: AutoGrowthMode;
}

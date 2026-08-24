// GrowthPilot AI Core Mock Data & Realistic Initial State

import { 
  SocialAccountData, 
  PlatformMetrics, 
  FollowerHistoryPoint, 
  PlatformScoreDetails, 
  CrossPlatformAIInsights, 
  CalendarPostItem, 
  PostPerformanceItem, 
  ViralIdeaItem, 
  TrendRadarItem, 
  CompetitorProfile, 
  AdCampaignItem, 
  LeadItem, 
  WeeklyAIReportData, 
  NotificationItem, 
  AutomationSettings 
} from '@/types';

export const INITIAL_SOCIAL_ACCOUNTS: SocialAccountData[] = [
  {
    id: 'acc-ig-1',
    platform: 'INSTAGRAM',
    accountId: '',
    accountName: 'Instagram Professional',
    username: 'Not Connected',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    growthScore: 0,
    growthPercentage: 0,
    status: 'NOT_CONNECTED',
    lastSyncAt: 'Never',
    officialScopes: ['instagram_basic', 'pages_show_list', 'pages_read_engagement', 'business_management'],
    rateLimitUsage: { used: 0, total: 200 }
  },
  {
    id: 'acc-fb-1',
    platform: 'FACEBOOK',
    accountId: '',
    accountName: 'Facebook Page',
    username: 'Not Connected',
    avatarUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    growthScore: 0,
    growthPercentage: 0,
    status: 'NOT_CONNECTED',
    lastSyncAt: 'Never',
    officialScopes: ['pages_show_list', 'pages_read_engagement', 'business_management'],
    rateLimitUsage: { used: 0, total: 200 }
  },
  {
    id: 'acc-li-1',
    platform: 'LINKEDIN',
    accountId: '',
    accountName: 'LinkedIn Profile / Page',
    username: 'Not Connected',
    avatarUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    growthScore: 0,
    growthPercentage: 0,
    status: 'NOT_CONNECTED',
    lastSyncAt: 'Never',
    officialScopes: ['openid', 'profile', 'email', 'w_member_social'],
    rateLimitUsage: { used: 0, total: 500 }
  },
  {
    id: 'acc-tt-1',
    platform: 'TIKTOK',
    accountId: '',
    accountName: 'TikTok Account',
    username: 'Not Connected',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    growthScore: 0,
    growthPercentage: 0,
    status: 'NOT_CONNECTED',
    lastSyncAt: 'Never',
    officialScopes: ['user.info.basic', 'video.list', 'video.upload', 'video.publish'],
    rateLimitUsage: { used: 0, total: 300 }
  }
];

export const DEMO_BENCHMARK_ACCOUNTS: SocialAccountData[] = [
  {
    id: 'acc-ig-1',
    platform: 'INSTAGRAM',
    accountId: '17841405309211904',
    accountName: 'GrowthPilot Properties',
    username: '@growthpilot_re',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    followerCount: 24850,
    followingCount: 420,
    postCount: 318,
    growthScore: 87,
    growthPercentage: 8.4,
    status: 'DEMO_CONNECTED',
    lastSyncAt: 'Just now',
    officialScopes: ['instagram_basic', 'pages_show_list', 'pages_read_engagement', 'business_management'],
    rateLimitUsage: { used: 42, total: 200 }
  },
  {
    id: 'acc-fb-1',
    platform: 'FACEBOOK',
    accountId: '109283746501928',
    accountName: 'GrowthPilot Global',
    username: 'facebook.com/GrowthPilotGlobal',
    avatarUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
    followerCount: 12430,
    followingCount: 88,
    postCount: 512,
    growthScore: 78,
    growthPercentage: 4.2,
    status: 'DEMO_CONNECTED',
    lastSyncAt: '2 mins ago',
    officialScopes: ['pages_show_list', 'pages_read_engagement', 'business_management'],
    rateLimitUsage: { used: 19, total: 200 }
  },
  {
    id: 'acc-li-1',
    platform: 'LINKEDIN',
    accountId: 'urn:li:organization:98471203',
    accountName: 'GrowthPilot Capital & Real Estate',
    username: 'linkedin.com/company/growthpilot',
    avatarUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    followerCount: 8920,
    followingCount: 154,
    postCount: 184,
    growthScore: 91,
    growthPercentage: 14.6,
    status: 'DEMO_CONNECTED',
    lastSyncAt: '5 mins ago',
    officialScopes: ['openid', 'profile', 'email', 'w_member_social'],
    rateLimitUsage: { used: 31, total: 500 }
  },
  {
    id: 'acc-tt-1',
    platform: 'TIKTOK',
    accountId: 'tt_user_689123049281',
    accountName: 'GrowthPilot Live',
    username: '@growthpilot_ai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followerCount: 31200,
    followingCount: 210,
    postCount: 142,
    growthScore: 84,
    growthPercentage: 22.1,
    status: 'DEMO_CONNECTED',
    lastSyncAt: '1 min ago',
    officialScopes: ['user.info.basic', 'video.list', 'video.upload', 'video.publish'],
    rateLimitUsage: { used: 55, total: 300 }
  }
];

export const INITIAL_PLATFORM_METRICS: Record<'ALL' | 'INSTAGRAM' | 'FACEBOOK' | 'LINKEDIN' | 'TIKTOK', PlatformMetrics> = {
  ALL: {
    followers: 0,
    growthThisMonth: 0,
    growthRate: 0,
    reach: 0,
    views: 0,
    engagement: 0,
    engagementRate: 0,
    profileVisits: 0,
    leadsGenerated: 0,
    growthScore: 0
  },
  INSTAGRAM: {
    followers: 0,
    growthThisMonth: 0,
    growthRate: 0,
    reach: 0,
    views: 0,
    engagement: 0,
    engagementRate: 0,
    profileVisits: 0,
    leadsGenerated: 0,
    growthScore: 0
  },
  FACEBOOK: {
    followers: 0,
    growthThisMonth: 0,
    growthRate: 0,
    reach: 0,
    views: 0,
    engagement: 0,
    engagementRate: 0,
    profileVisits: 0,
    leadsGenerated: 0,
    growthScore: 0
  },
  LINKEDIN: {
    followers: 0,
    growthThisMonth: 0,
    growthRate: 0,
    reach: 0,
    views: 0,
    engagement: 0,
    engagementRate: 0,
    profileVisits: 0,
    leadsGenerated: 0,
    growthScore: 0
  },
  TIKTOK: {
    followers: 0,
    growthThisMonth: 0,
    growthRate: 0,
    reach: 0,
    views: 0,
    engagement: 0,
    engagementRate: 0,
    profileVisits: 0,
    leadsGenerated: 0,
    growthScore: 0
  }
};

export const DEMO_BENCHMARK_METRICS: Record<'ALL' | 'INSTAGRAM' | 'FACEBOOK' | 'LINKEDIN' | 'TIKTOK', PlatformMetrics> = {
  ALL: {
    followers: 77400,
    growthThisMonth: 8240,
    growthRate: 11.9,
    reach: 642800,
    views: 1284500,
    engagement: 98400,
    engagementRate: 7.6,
    profileVisits: 34100,
    leadsGenerated: 218,
    growthScore: 85
  },
  INSTAGRAM: {
    followers: 24850,
    growthThisMonth: 1920,
    growthRate: 8.4,
    reach: 184500,
    views: 312000,
    engagement: 29800,
    engagementRate: 9.5,
    profileVisits: 11400,
    leadsGenerated: 54,
    growthScore: 87
  },
  FACEBOOK: {
    followers: 12430,
    growthThisMonth: 500,
    growthRate: 4.2,
    reach: 98200,
    views: 142000,
    engagement: 11200,
    engagementRate: 7.8,
    profileVisits: 4800,
    leadsGenerated: 32,
    growthScore: 78
  },
  LINKEDIN: {
    followers: 8920,
    growthThisMonth: 1140,
    growthRate: 14.6,
    reach: 124100,
    views: 198500,
    engagement: 21400,
    engagementRate: 10.8,
    profileVisits: 7900,
    leadsGenerated: 94,
    growthScore: 91
  },
  TIKTOK: {
    followers: 31200,
    growthThisMonth: 4680,
    growthRate: 22.1,
    reach: 236000,
    views: 632000,
    engagement: 36000,
    engagementRate: 8.1,
    profileVisits: 10000,
    leadsGenerated: 38,
    growthScore: 84
  }
};

export const FOLLOWER_GROWTH_HISTORY: FollowerHistoryPoint[] = [
  { date: 'Aug 01', instagram: 22930, facebook: 11930, linkedin: 7780, tiktok: 26520, total: 69160 },
  { date: 'Aug 05', instagram: 23210, facebook: 12010, linkedin: 7940, tiktok: 27150, total: 70310 },
  { date: 'Aug 09', instagram: 23580, facebook: 12100, linkedin: 8180, tiktok: 28020, total: 71880 },
  { date: 'Aug 13', instagram: 23940, facebook: 12190, linkedin: 8400, tiktok: 28990, total: 73520 },
  { date: 'Aug 17', instagram: 24320, facebook: 12280, linkedin: 8640, tiktok: 29950, total: 75190 },
  { date: 'Aug 21', instagram: 24650, facebook: 12380, linkedin: 8810, tiktok: 30800, total: 76640 },
  { date: 'Aug 23', instagram: 24850, facebook: 12430, linkedin: 8920, tiktok: 31200, total: 77400 }
];

export const PLATFORM_SCORE_DETAILS: Record<'INSTAGRAM' | 'FACEBOOK' | 'LINKEDIN' | 'TIKTOK', PlatformScoreDetails> = {
  INSTAGRAM: {
    platform: 'INSTAGRAM',
    overallScore: 87,
    categories: {
      consistency: 90,
      engagement: 88,
      reach: 84,
      growth: 86,
      quality: 92,
      postingFrequency: 85,
      audienceResponse: 89,
      profileOptimization: 94,
      conversionPerformance: 82
    },
    keyStrength: 'High Carousel saves (14.2% save-to-reach ratio) and strong Reel hook retention.',
    biggestOpportunity: 'Add 2 weekly educational Stories with interactive poll stickers to boost profile visits.'
  },
  FACEBOOK: {
    platform: 'FACEBOOK',
    overallScore: 78,
    categories: {
      consistency: 80,
      engagement: 74,
      reach: 76,
      growth: 72,
      quality: 84,
      postingFrequency: 75,
      audienceResponse: 79,
      profileOptimization: 88,
      conversionPerformance: 81
    },
    keyStrength: 'High link click-through rate on long-form community property updates.',
    biggestOpportunity: 'Repurpose TikTok vertical videos as Facebook Reels to double organic video reach.'
  },
  LINKEDIN: {
    platform: 'LINKEDIN',
    overallScore: 91,
    categories: {
      consistency: 94,
      engagement: 93,
      reach: 89,
      growth: 92,
      quality: 96,
      postingFrequency: 88,
      audienceResponse: 91,
      profileOptimization: 95,
      conversionPerformance: 95
    },
    keyStrength: 'Industry-leading lead conversion rate (43% of total pipeline leads originated from B2B posts).',
    biggestOpportunity: 'Publish bi-weekly LinkedIn document carousels with PDF ROI breakdown worksheets.'
  },
  TIKTOK: {
    platform: 'TIKTOK',
    overallScore: 84,
    categories: {
      consistency: 86,
      engagement: 81,
      reach: 96,
      growth: 94,
      quality: 85,
      postingFrequency: 88,
      audienceResponse: 80,
      profileOptimization: 83,
      conversionPerformance: 72
    },
    keyStrength: 'Exponential viral reach (+22.1% growth this month, averaging 4,450 views per video).',
    biggestOpportunity: 'Strengthen the 3-second hook and insert pinned comment CTAs to drive bio link clicks.'
  }
};

export const CROSS_PLATFORM_AI_INSIGHTS: CrossPlatformAIInsights = {
  bestPlatformOverall: 'LINKEDIN',
  fastestGrowingPlatform: 'TIKTOK',
  highestEngagementPlatform: 'LINKEDIN',
  highestLeadGenPlatform: 'LINKEDIN',
  bestContentFormat: [
    { platform: 'TIKTOK', format: '30-second Educational Problem-Solution Videos' },
    { platform: 'INSTAGRAM', format: 'Multi-slide Luxury Carousel & 15s Cinematic Reels' },
    { platform: 'LINKEDIN', format: 'Data-Backed Investment Breakdowns & Market Analysis' },
    { platform: 'FACEBOOK', format: 'Long-Form Community Stories with Direct Inquiries Link' }
  ],
  bestPostingTimes: {
    INSTAGRAM: { time: '7:30 PM', day: 'Tuesday & Thursday', reason: 'Peak evening leisure browsing & Reel save velocity window' },
    FACEBOOK: { time: '8:00 PM', day: 'Wednesday & Sunday', reason: 'High community feed interaction during post-dinner hours' },
    LINKEDIN: { time: '9:00 AM', day: 'Tuesday & Wednesday', reason: 'Executive morning commute and business day planning peak' },
    TIKTOK: { time: '9:30 PM', day: 'Everyday', reason: 'Late night algorithm algorithmic binge consumption peak' }
  },
  winningHooks: [
    '"Why 92% of Dubai property investors are making this silent mistake in 2026..."',
    '"Stop scrolling if you want 8.5% net tax-free rental yield this quarter."',
    '"I analyzed 500 prime real estate deals. Here is the exact playbook."'
  ],
  winningCTAs: [
    'Comment "INVEST" below and our AI will DM you the private financial model.',
    'Tap the link in bio to download the complete 2026 Dubai Marina ROI breakdown.',
    'Save this post before you sign your next developer contract.'
  ],
  contentGaps: [
    'Missing payment plan comparison breakdowns on Instagram',
    'Under-utilizing TikTok educational Q&A format on Golden Visa eligibility',
    'Need more client case studies with exact ROI numbers on LinkedIn'
  ],
  audienceDifferences: [
    'TikTok audience is 64% 21-34 year olds seeking entry-level wealth creation & visa guidance.',
    'LinkedIn audience consists of 78% C-Suite & High Net Worth Individuals seeking portfolio diversification.',
    'Instagram audience values high-aesthetic video walkthroughs and architectural design cues.'
  ],
  strategicSummary: 'LinkedIn generates the highest-quality leads while TikTok generates the highest reach. Recommendation: Use TikTok for top-of-funnel viral awareness and LinkedIn for bottom-of-funnel lead generation and high-ticket conversion.'
};

export const INITIAL_CALENDAR_ITEMS: CalendarPostItem[] = [
  {
    id: 'cal-1',
    platform: 'INSTAGRAM',
    contentType: 'REEL',
    title: 'Dubai Marina Luxury Waterfront Walkthrough',
    caption: 'Step inside this 2-Bedroom penthouse offering 360-degree marina views and 9% projected net yield. Tap bio link for full floor plan! 🏙️✨ #DubaiRealEstate #LuxuryLiving #PropertyInvestment',
    scheduledTime: '2026-08-24T19:30:00Z',
    status: 'SCHEDULED',
    approvalStatus: 'SCHEDULED',
    autoMode: 'SEMI_AUTOMATIC',
    aiScore: 94,
    bestTimeReason: '7:30 PM is your verified highest engagement window on Instagram'
  },
  {
    id: 'cal-2',
    platform: 'LINKEDIN',
    contentType: 'POST',
    title: 'Q3 UAE Macro Real Estate & Rental Yield Report',
    caption: 'Why institutional capital is aggressively shifting into Dubai freehold commercial and luxury residential assets. Read our deep-dive financial forecast below. 📊🏢',
    scheduledTime: '2026-08-25T09:00:00Z',
    status: 'SCHEDULED',
    approvalStatus: 'APPROVED',
    autoMode: 'AUTOMATIC',
    aiScore: 96,
    bestTimeReason: '9:00 AM matches peak executive B2B feed review hours'
  },
  {
    id: 'cal-3',
    platform: 'TIKTOK',
    contentType: 'VIDEO',
    title: '3 Hidden Costs When Buying Property (And How To Avoid Them)',
    caption: 'Do not sign a developer contract until you know these 3 things! 🛑 #realestatetips #dubaiproperty #investing101 #wealthbuilding',
    scheduledTime: '2026-08-25T21:30:00Z',
    status: 'SCHEDULED',
    approvalStatus: 'SCHEDULED',
    autoMode: 'AUTOMATIC',
    aiScore: 91,
    bestTimeReason: '9:30 PM is peak TikTok algorithm distribution window'
  },
  {
    id: 'cal-4',
    platform: 'FACEBOOK',
    contentType: 'POST',
    title: 'Investor Spotlight: Achieving 8.4% ROI in 12 Months',
    caption: 'Meet Sarah and David, who transitioned from rental tenants to property investors using our structured 60/40 payment plan. Read their full journey here.',
    scheduledTime: '2026-08-26T20:00:00Z',
    status: 'SCHEDULED',
    approvalStatus: 'USER_REVIEW',
    autoMode: 'SEMI_AUTOMATIC',
    aiScore: 88,
    bestTimeReason: '8:00 PM matches highest community comment frequency'
  },
  {
    id: 'cal-5',
    platform: 'INSTAGRAM',
    contentType: 'CAROUSEL',
    title: '5 Steps to Securing a 10-Year UAE Golden Visa Through Real Estate',
    caption: 'Swipe through to understand the exact investment thresholds, eligible properties, and required documentation for your family visa. 🇦🇪',
    scheduledTime: '2026-08-27T19:30:00Z',
    status: 'SCHEDULED',
    approvalStatus: 'USER_REVIEW',
    autoMode: 'SEMI_AUTOMATIC',
    aiScore: 95,
    bestTimeReason: 'High save rate predicted for Thursday evening carousel'
  },
  {
    id: 'cal-6',
    platform: 'LINKEDIN',
    contentType: 'ARTICLE',
    title: 'B2B Wealth Allocation: Why Family Offices Are Flocking to Dubai Real Estate',
    caption: 'An executive analysis on zero capital gains tax, sovereign stability, and high currency peg advantages in global real estate portfolios.',
    scheduledTime: '2026-08-28T09:00:00Z',
    status: 'DRAFT',
    approvalStatus: 'DRAFT',
    autoMode: 'MANUAL',
    aiScore: 92,
    bestTimeReason: 'Friday morning professional reflection peak'
  }
];

export const INITIAL_POST_PERFORMANCE: PostPerformanceItem[] = [
  {
    id: 'post-1',
    platform: 'TIKTOK',
    title: 'Dubai Marina vs Palm Jumeirah ROI Breakdown',
    caption: 'Which luxury location actually pays higher rental yield in 2026?',
    contentType: 'VIDEO',
    publishedAt: '2 days ago',
    views: 142000,
    reach: 118000,
    likes: 8900,
    comments: 642,
    shares: 1240,
    saves: 3410,
    profileVisits: 2840,
    followersGenerated: 940,
    engagementRate: 10.2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'post-2',
    platform: 'LINKEDIN',
    title: 'The 2026 Dubai Commercial Real Estate Forecast',
    caption: 'Why grade-A office supply crunch will drive 15% rent appreciation.',
    contentType: 'POST',
    publishedAt: '3 days ago',
    views: 48500,
    reach: 41200,
    likes: 1840,
    comments: 290,
    shares: 310,
    saves: 820,
    profileVisits: 1950,
    followersGenerated: 380,
    engagementRate: 11.4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'post-3',
    platform: 'INSTAGRAM',
    title: 'Luxury 3-BR Penthouse Tour - Sky Collection',
    caption: 'Private pool on the 45th floor overlooking the Arabian Gulf. ✨',
    contentType: 'REEL',
    publishedAt: '4 days ago',
    views: 89400,
    reach: 72100,
    likes: 6400,
    comments: 380,
    shares: 890,
    saves: 2150,
    profileVisits: 3100,
    followersGenerated: 620,
    engagementRate: 9.8,
    thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'post-4',
    platform: 'FACEBOOK',
    title: 'Community Guide: Living in Dubai Hills Estate',
    caption: 'Schools, parks, golf courses and investment trends in Dubai top family community.',
    contentType: 'POST',
    publishedAt: '5 days ago',
    views: 31200,
    reach: 26400,
    likes: 1120,
    comments: 185,
    shares: 140,
    saves: 290,
    profileVisits: 890,
    followersGenerated: 110,
    engagementRate: 6.8,
    thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&auto=format&fit=crop&q=80'
  }
];

export const DAILY_VIRAL_IDEAS: ViralIdeaItem[] = [
  {
    id: 'idea-1',
    title: 'The "Silent Cashflow" Strategy in 2026',
    hook: '"Most people buy property for capital appreciation, but the top 1% buy exclusively for tax-free passive cashflow."',
    concept: 'Compare standard stock market dividend yields (2-3%) with high-demand Dubai residential holiday rentals (8-10% net).',
    platform: 'TIKTOK',
    format: 'VIDEO',
    cta: 'Comment "CASHFLOW" to get our free 10-page financial comparison sheet.',
    viralityPotential: 'EXTREME',
    viralScore: 98,
    estimatedReach: '50k - 120k Views'
  },
  {
    id: 'idea-2',
    title: 'Why Global Executives Are Relocating to the UAE',
    hook: '"Zero corporate tax on qualifying income, zero personal income tax, and 100% foreign ownership. Here is what happened to my client\'s bottom line."',
    concept: 'Case study of a tech founder who relocated their business and purchased real estate for a Golden Visa.',
    platform: 'LINKEDIN',
    format: 'POST',
    cta: 'Connect or send a direct message to schedule a private advisory consultation.',
    viralityPotential: 'HIGH',
    viralScore: 94,
    estimatedReach: '25k - 60k Impressions'
  },
  {
    id: 'idea-3',
    title: '5 Property Red Flags That Cost First-Time Buyers $50,000+',
    hook: '"If your real estate agent doesn\'t mention these 5 critical clauses before you sign, walk away immediately."',
    concept: 'Educational checklist on service charges, handover delays, snagging guarantees, and developer escrow rules.',
    platform: 'INSTAGRAM',
    format: 'CAROUSEL',
    cta: 'Save this post so you have it ready when touring properties this weekend.',
    viralityPotential: 'EXTREME',
    viralScore: 96,
    estimatedReach: '40k - 90k Reach'
  },
  {
    id: 'idea-4',
    title: 'How to Buy a Luxury Apartment with a 1% Monthly Payment Plan',
    hook: '"You don\'t need $1 Million upfront to own a prime beachfront apartment in Dubai. Here is the math."',
    concept: 'Explaining post-handover payment plans where rental income covers the remaining 40% installment.',
    platform: 'TIKTOK',
    format: 'VIDEO',
    cta: 'Tap link in bio to see available 1% payment plan inventory.',
    viralityPotential: 'HIGH',
    viralScore: 92,
    estimatedReach: '45k - 80k Views'
  },
  {
    id: 'idea-5',
    title: 'The Anatomy of an 8.8% Net Yield Property Deal',
    hook: '"Let\'s break down the exact numbers: Purchase price, DLD fees, furnishing cost, Airbnb ADR, and net profit."',
    concept: 'Transparent financial spreadsheet breakdown of a completed property deal in Downtown Dubai.',
    platform: 'LINKEDIN',
    format: 'ARTICLE',
    cta: 'Download the unlocked Excel model from the link in comments.',
    viralityPotential: 'STRONG',
    viralScore: 89,
    estimatedReach: '15k - 40k Impressions'
  },
  {
    id: 'idea-6',
    title: 'Virtual 3D Walkthrough: Sunset Villa in Palm Jumeirah',
    hook: '"POV: You just woke up in your private beachfront villa with Burj Al Arab views."',
    concept: 'Fast-paced cinematic montage with relaxing aesthetic audio and key luxury amenity overlays.',
    platform: 'INSTAGRAM',
    format: 'REEL',
    cta: 'DM us "PALM" for off-market pricing and private viewing access.',
    viralityPotential: 'EXTREME',
    viralScore: 97,
    estimatedReach: '60k - 150k Reach'
  },
  {
    id: 'idea-7',
    title: 'Facebook Community Q&A: Is Dubai in a Property Bubble?',
    hook: '"Everyone is asking if prices will crash in 2026. Here is what population growth and infrastructure data tell us."',
    concept: 'Fact-based breakdown comparing 2008 vs 2026 cash-buyer ratios and mortgage regulations.',
    platform: 'FACEBOOK',
    format: 'POST',
    cta: 'What do you think? Share your perspective in the comments below!',
    viralityPotential: 'HIGH',
    viralScore: 91,
    estimatedReach: '20k - 45k Reach'
  },
  {
    id: 'idea-8',
    title: 'Off-Plan vs Ready Properties: Which Makes You Richer?',
    hook: '"Never buy off-plan if you need cash flow today, but never buy ready if you want maximum capital leverage. Here is why."',
    concept: 'Pros and cons battle graphic comparing construction appreciation vs immediate tenant income.',
    platform: 'INSTAGRAM',
    format: 'CAROUSEL',
    cta: 'Share this with a partner or investor friend debating their next move.',
    viralityPotential: 'STRONG',
    viralScore: 88,
    estimatedReach: '30k - 65k Reach'
  },
  {
    id: 'idea-9',
    title: 'Real Estate Tax Guide 2026: UK & Europe vs UAE',
    hook: '"Compare losing 40-50% in stamp duty, council tax, and capital gains vs keeping 100% of your gains."',
    concept: 'Side-by-side tax calculation for high-earning expats and international property portfolios.',
    platform: 'LINKEDIN',
    format: 'POST',
    cta: 'Request our comparative international expat wealth report.',
    viralityPotential: 'HIGH',
    viralScore: 93,
    estimatedReach: '20k - 50k Impressions'
  },
  {
    id: 'idea-10',
    title: 'Day in the Life: Inspecting a $4.5M Luxury Penthouse Handover',
    hook: '"Let\'s see what $4.5M gets you in Downtown Dubai. Snagging inspection with a thermal camera!"',
    concept: 'Behind-the-scenes engineering & architectural quality inspection highlighting finishes, marble, smart home tech.',
    platform: 'TIKTOK',
    format: 'VIDEO',
    cta: 'Follow for daily insider property tours and expert reviews.',
    viralityPotential: 'EXTREME',
    viralScore: 95,
    estimatedReach: '70k - 180k Views'
  }
];

export const TREND_RADAR_ITEMS: TrendRadarItem[] = [
  {
    id: 'tr-ig-1',
    platform: 'INSTAGRAM',
    trendName: 'Aesthetic "POV" High-FPS Luxury Drone Walkthroughs',
    volume: '2.4M Searches',
    growth: '+142% this week',
    whyItMatters: 'Instagram algorithm is giving 3.2x higher explore feed distribution to 4K 60fps architectural drone footage.',
    relevantAudience: 'HNWIs, luxury lifestyle seekers, international buyers',
    contentIdea: 'Cinematic sunset drone glide through floor-to-ceiling balcony windows into master suite.',
    recommendedFormat: 'REEL',
    urgency: 'HIGH'
  },
  {
    id: 'tr-tt-1',
    platform: 'TIKTOK',
    trendName: 'Calculated Cost of Living & Wealth Hacks in UAE',
    volume: '18.9M Views',
    growth: '+210% this week',
    whyItMatters: 'Viewers are obsessively sharing realistic budget breakdowns comparing London/NYC/Toronto living costs to Dubai.',
    relevantAudience: 'Expats, tech workers, digital nomads, young professionals',
    contentIdea: '"What $3,000/month rent gets you in London vs Dubai Marina (with private gym & pool)."',
    recommendedFormat: 'VIDEO',
    urgency: 'HIGH'
  },
  {
    id: 'tr-li-1',
    platform: 'LINKEDIN',
    trendName: 'Document Carousel: 10-Year Global Wealth Allocation Strategies',
    volume: '850K Impressions',
    growth: '+88% this week',
    whyItMatters: 'LinkedIn algorithm rewards PDF document attachments with 4.5x higher dwell time than standard text posts.',
    relevantAudience: 'C-Suite, fund managers, family office directors, real estate developers',
    contentIdea: 'Upload a 7-slide PDF report on "Macro Liquidity & Real Estate Hedge Strategies in 2026".',
    recommendedFormat: 'CAROUSEL',
    urgency: 'HIGH'
  },
  {
    id: 'tr-fb-1',
    platform: 'FACEBOOK',
    trendName: 'Long-Form Expat Relocation Stories & Community Guides',
    volume: '420K Engagements',
    growth: '+64% this week',
    whyItMatters: 'Facebook Page posts with 250+ words that tell emotional family relocation stories generate 3x more shares in Expat groups.',
    relevantAudience: 'Relocating families, retirees, business owners',
    contentIdea: 'Interview with a British family who moved to Dubai Hills: school choices, visa process, and neighbourhood living.',
    recommendedFormat: 'POST',
    urgency: 'MEDIUM'
  }
];

export const INITIAL_COMPETITORS: CompetitorProfile[] = [
  {
    id: 'comp-1',
    platform: 'INSTAGRAM',
    handle: '@luxurydxb_properties',
    name: 'Luxury DXB Properties',
    avatarUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80',
    followerCount: 94200,
    postingFrequency: '6 posts/week',
    avgEngagementRate: 3.8,
    topFormats: ['Cinematic Reels', 'Architecture Carousels'],
    strengths: ['High production quality video', 'Consistent visual aesthetic', 'Celebrity walkthrough collaborations'],
    weaknesses: ['Zero financial ROI breakdowns', 'Weak call-to-actions', 'Slow comment reply times (24h+)'],
    contentGaps: ['No post-handover payment plan education', 'Missing Golden Visa step-by-step guidance'],
    opportunities: ['Create educational financial comparison carousels that demystify actual buying costs'],
    recommendedStrategy: 'Out-educate them. While they show only pretty aesthetics, publish concrete net yield calculations and snagging tips to capture high-intent buyers.'
  },
  {
    id: 'comp-2',
    platform: 'TIKTOK',
    handle: '@dubai_investor_daily',
    name: 'Dubai Investor Daily',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    followerCount: 185000,
    postingFrequency: '12 videos/week',
    avgEngagementRate: 4.2,
    topFormats: ['30s Talking Head', 'Controversial Hook Videos'],
    strengths: ['Aggressive hook delivery', 'High posting velocity', 'Captures broad viral attention'],
    weaknesses: ['Low conversion to actual booked meetings', 'Overhyped titles lead to skeptical comments'],
    contentGaps: ['Lack of verified institutional market reports and official developer certifications'],
    opportunities: ['Build trust with transparent, mathematically audited investment spreadsheets'],
    recommendedStrategy: 'Match their punchy hook style in the first 3 seconds, but deliver genuine audited figures and verified developer contracts to dominate lead quality.'
  },
  {
    id: 'comp-3',
    platform: 'LINKEDIN',
    handle: 'linkedin.com/company/apex-capital-partners',
    name: 'Apex Capital Real Estate',
    avatarUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&auto=format&fit=crop&q=80',
    followerCount: 34100,
    postingFrequency: '3 posts/week',
    avgEngagementRate: 5.1,
    topFormats: ['Executive Opinion Articles', 'Quarterly PDF Reports'],
    strengths: ['High trust among institutional investors', 'Strong B2B network', 'Detailed economic charts'],
    weaknesses: ['Boring corporate tone', 'No video content', 'Irregular posting schedule'],
    contentGaps: ['Interactive case studies and founder interviews'],
    opportunities: ['Produce engaging video summaries of complex economic trends'],
    recommendedStrategy: 'Take their dry institutional topics and translate them into snappy, visually engaging LinkedIn carousels and executive video summaries.'
  }
];

export const INITIAL_CAMPAIGNS: AdCampaignItem[] = [
  {
    id: 'camp-1',
    name: 'Dubai Marina Luxury Waterfront Leads - Q3',
    platform: 'META',
    objective: 'LEADS',
    budget: 1500,
    dailyBudget: 50,
    spend: 680,
    reach: 48500,
    clicks: 1420,
    leads: 64,
    conversions: 18,
    cpc: 0.48,
    cpl: 10.62,
    roas: 4.8,
    status: 'ACTIVE',
    targetAudience: {
      locations: ['United Kingdom', 'Germany', 'United Arab Emirates', 'Saudi Arabia'],
      ageRange: '30 - 62',
      interests: ['Luxury Real Estate', 'Property Investment', 'Wealth Management', 'Expat Relocation']
    },
    adCopy: 'Own a prime 2-Bedroom Waterfront Penthouse in Dubai Marina with 60/40 payment plan and 9% projected net yield. Download the official brochure and ROI calculator.',
    cta: 'GET_QUOTE',
    creativeUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80',
    startDate: '2026-08-10'
  },
  {
    id: 'camp-2',
    name: 'B2B Executive Real Estate & Golden Visa',
    platform: 'LINKEDIN',
    objective: 'LEADS',
    budget: 2000,
    dailyBudget: 75,
    spend: 920,
    reach: 22400,
    clicks: 680,
    leads: 48,
    conversions: 14,
    cpc: 1.35,
    cpl: 19.16,
    roas: 6.2,
    status: 'ACTIVE',
    targetAudience: {
      locations: ['Global / EMEA', 'Switzerland', 'Singapore', 'United States'],
      ageRange: '35 - 65',
      interests: ['CEO', 'Founder', 'Managing Director', 'Private Equity', 'Venture Capital']
    },
    adCopy: 'Diversify your wealth with zero-tax UAE prime real estate. Qualifying properties grant full 10-Year Renewable Golden Visa for you and your family.',
    cta: 'APPLY_NOW',
    creativeUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    startDate: '2026-08-12'
  },
  {
    id: 'camp-3',
    name: 'First-Time Investor 1% Monthly Payment Plan',
    platform: 'TIKTOK',
    objective: 'TRAFFIC',
    budget: 800,
    dailyBudget: 35,
    spend: 315,
    reach: 84000,
    clicks: 2950,
    leads: 28,
    conversions: 6,
    cpc: 0.11,
    cpl: 11.25,
    roas: 3.4,
    status: 'ACTIVE',
    targetAudience: {
      locations: ['United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain'],
      ageRange: '22 - 40',
      interests: ['Passive Income', 'Financial Freedom', 'Real Estate Tips', 'Investing']
    },
    adCopy: 'Stop paying rent! Own your brand-new apartment in Dubai with just 1% per month. Tap below to see floor plans.',
    cta: 'LEARN_MORE',
    creativeUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    startDate: '2026-08-15'
  }
];

export const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    name: 'Alexander Wright',
    email: 'a.wright@londoncapital.co.uk',
    phone: '+44 7911 123456',
    platform: 'LINKEDIN',
    campaign: 'B2B Executive Real Estate & Golden Visa',
    source: 'LinkedIn Lead Gen Form',
    date: '2026-08-23 11:20 AM',
    status: 'QUALIFIED',
    value: 650000,
    notes: 'Looking for 2-BR penthouse in Dubai Marina or Palm Jumeirah. Budget up to $700k USD. Interested in 10-Yr Golden Visa.'
  },
  {
    id: 'lead-2',
    name: 'Fatima Al-Mansouri',
    email: 'fatima.m@almansourifamily.ae',
    phone: '+971 50 894 2100',
    platform: 'INSTAGRAM',
    campaign: 'Dubai Marina Luxury Waterfront Leads - Q3',
    source: 'Instagram Direct Ad Lead',
    date: '2026-08-23 09:45 AM',
    status: 'MEETING',
    value: 1200000,
    notes: 'Scheduled private zoom consultation for Thursday 3:00 PM. Interested in full-floor luxury off-plan units.'
  },
  {
    id: 'lead-3',
    name: 'Dr. Marcus Vance',
    email: 'dr.vance@genevaclinic.ch',
    phone: '+41 78 901 2345',
    platform: 'LINKEDIN',
    campaign: 'B2B Executive Real Estate & Golden Visa',
    source: 'LinkedIn InMail Ad',
    date: '2026-08-22 04:15 PM',
    status: 'NEGOTIATION',
    value: 850000,
    notes: 'Reviewing SPA agreement for Downtown 3-Bedroom suite with Burj Khalifa views. Payment plan 50/50 approved.'
  },
  {
    id: 'lead-4',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@techventures.in',
    phone: '+91 98200 54321',
    platform: 'TIKTOK',
    campaign: 'First-Time Investor 1% Monthly Payment Plan',
    source: 'TikTok Instant Form',
    date: '2026-08-22 01:10 PM',
    status: 'CONTACTED',
    value: 280000,
    notes: 'First-time international buyer looking for high rental yield 1-Bedroom unit in JVC. Sent ROI calculations.'
  },
  {
    id: 'lead-5',
    name: 'Jean-Luc Moreau',
    email: 'jl.moreau@luxholding.fr',
    phone: '+33 6 12 34 56 78',
    platform: 'FACEBOOK',
    campaign: 'Dubai Marina Luxury Waterfront Leads - Q3',
    source: 'Facebook Messenger Lead',
    date: '2026-08-21 07:30 PM',
    status: 'CONVERTED',
    value: 920000,
    notes: 'DEAL CLOSED! Signed reservation agreement for Palm Jumeirah villa. First installment wired to escrow account.'
  },
  {
    id: 'lead-6',
    name: 'Elena Rostova',
    email: 'elena.rostova@monacotrade.mc',
    phone: '+377 93 15 00 00',
    platform: 'INSTAGRAM',
    campaign: 'Organic Reel DM',
    source: 'Instagram Comment "INVEST"',
    date: '2026-08-21 02:40 PM',
    status: 'QUALIFIED',
    value: 500000,
    notes: 'Commented on our Sky Collection Reel. Wants off-market beachfront inventory ready by Q4 2026.'
  }
];

export const INITIAL_WEEKLY_REPORT: WeeklyAIReportData = {
  id: 'rep-wk-34-2026',
  reportDate: '2026-08-23',
  period: 'Aug 17, 2026 – Aug 23, 2026',
  totalFollowers: 77400,
  netFollowerGrowth: 2210,
  totalReach: 642800,
  totalViews: 1284500,
  totalEngagement: 98400,
  totalLeads: 58,
  bestPlatform: 'TIKTOK',
  bestLeadPlatform: 'LINKEDIN',
  bestContent: {
    title: 'Dubai Marina vs Palm Jumeirah ROI Breakdown',
    platform: 'TIKTOK',
    views: 142000,
    engagement: 14500,
    leads: 18
  },
  platformGrowth: {
    INSTAGRAM: { followers: 24850, growth: 530, reach: 184500, leads: 14 },
    FACEBOOK: { followers: 12430, growth: 150, reach: 98200, leads: 8 },
    LINKEDIN: { followers: 8920, growth: 280, reach: 124100, leads: 26 },
    TIKTOK: { followers: 31200, growth: 1250, reach: 236000, leads: 10 }
  },
  executiveSummary: 'Outstanding 7-day performance across all integrated social channels. Overall audience increased by +2,210 verified followers (+2.9% weekly surge). TikTok led raw awareness and viral discovery (+1,250 followers, 632k total views), while LinkedIn dominated lead acquisition and high-ticket B2B conversions ($3.2M pipeline value generated).',
  nextWeekStrategy: {
    primaryFocus: 'Scale TikTok educational video series to feed LinkedIn B2B lead generation funnel.',
    recommendedPostsCount: {
      INSTAGRAM: 5,
      FACEBOOK: 4,
      LINKEDIN: 5,
      TIKTOK: 7
    },
    contentThemes: [
      '2026 UAE Tax Optimization & Golden Visa Requirements',
      'Dubai Freehold vs Leasehold Comparison for Foreign Nationals',
      'Behind-the-Scenes Penthouse Architectural Walkthroughs',
      'Off-Plan 1% Monthly Payment Plan ROI Audits'
    ],
    paidBudgetRecommendation: 'Allocate 60% of paid budget to LinkedIn Lead Gen Forms ($1,200) and 40% to Meta Retargeting ($800) for highest ROAS.'
  }
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'MILESTONE',
    title: 'Follower Milestone Achieved! 🎉',
    message: 'Your total social audience surpassed 77,000 genuine followers across all 4 platforms.',
    timestamp: '10 mins ago',
    isRead: false,
    actionUrl: '/analytics'
  },
  {
    id: 'notif-2',
    type: 'CONTENT_READY',
    title: 'AI Generated 4 Platform Posts',
    message: 'Cross-platform content for "Dubai Marina Penthouse" is generated with an avg AI Score of 92/100.',
    timestamp: '45 mins ago',
    isRead: false,
    actionUrl: '/content-studio'
  },
  {
    id: 'notif-3',
    type: 'PUBLISHED',
    title: 'Scheduled Post Successfully Published',
    message: 'Your LinkedIn thought leadership article went live at 9:00 AM optimal window.',
    timestamp: '3 hours ago',
    isRead: true,
    actionUrl: '/calendar'
  },
  {
    id: 'notif-4',
    type: 'GROWTH_OPPORTUNITY',
    title: 'AI Growth Opportunity Detected',
    message: 'TikTok educational videos are generating 4.2x higher reach than property tours. Calendar updated.',
    timestamp: '6 hours ago',
    isRead: true,
    actionUrl: '/growth-score'
  },
  {
    id: 'notif-5',
    type: 'WEEKLY_REPORT',
    title: 'Weekly AI Growth Report Ready',
    message: 'Your executive performance digest for Aug 17–23 is ready for review and PDF export.',
    timestamp: '1 day ago',
    isRead: true,
    actionUrl: '/reports'
  }
];

export const INITIAL_AUTOMATION_SETTINGS: AutomationSettings = {
  autoAnalyze: true,
  autoGenerateContent: true,
  autoOptimize: true,
  autoCreateCalendar: true,
  autoSchedule: true,
  autoGenerateReports: true,
  autoMonitorPerformance: true,
  autoRecommendCampaigns: true,
  platformControls: {
    instagram: true,
    facebook: true,
    linkedin: true,
    tiktok: true
  },
  globalPaused: false,
  currentMode: 'SEMI_AUTOMATIC'
};

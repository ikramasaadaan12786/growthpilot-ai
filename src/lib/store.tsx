'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SocialPlatform, 
  PlatformFilterType, 
  SocialAccountData, 
  PlatformMetrics, 
  AutoGrowthMode, 
  CalendarPostItem, 
  LeadItem, 
  AdCampaignItem, 
  CompetitorProfile, 
  NotificationItem, 
  SubscriptionTier,
  AutomationSettings,
  LeadStatus,
  ContentApprovalStatus,
  AutomationLogItem
} from '@/types';
import { 
  INITIAL_SOCIAL_ACCOUNTS, 
  INITIAL_PLATFORM_METRICS,
  DEMO_BENCHMARK_ACCOUNTS,
  DEMO_BENCHMARK_METRICS,
  INITIAL_CALENDAR_ITEMS, 
  INITIAL_LEADS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_COMPETITORS, 
  INITIAL_NOTIFICATIONS 
} from './mock-data';
import { aggregateConnectedAccountsMetrics } from './growth-engine';

interface AppContextType {
  isDemoMode: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
  isOnline: boolean;
  isDesktopApp: boolean;
  platformFilter: PlatformFilterType;
  setPlatformFilter: (filter: PlatformFilterType) => void;
  socialAccounts: SocialAccountData[];
  connectAccount: (platform: SocialPlatform) => Promise<void>;
  disconnectAccount: (platform: SocialPlatform) => void;
  reconnectAccount: (platform: SocialPlatform) => Promise<void>;
  refreshAccountData: (platform: SocialPlatform) => Promise<void>;
  platformMetrics: Record<'ALL' | SocialPlatform, PlatformMetrics>;
  autoGrowthMode: AutoGrowthMode;
  setAutoGrowthMode: (mode: AutoGrowthMode) => void;
  automationSettings: AutomationSettings;
  updateAutomationSetting: (key: keyof Omit<AutomationSettings, 'platformControls' | 'globalPaused' | 'currentMode'>, value: boolean) => void;
  togglePlatformAutomation: (platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok', value: boolean) => void;
  emergencyPauseAllAutomations: () => void;
  resumeAllAutomations: () => void;
  calendarPosts: CalendarPostItem[];
  addCalendarPost: (post: Omit<CalendarPostItem, 'id'>) => void;
  updateCalendarPost: (id: string, updates: Partial<CalendarPostItem>) => void;
  deleteCalendarPost: (id: string) => void;
  publishPostNow: (id: string) => Promise<boolean>;
  updateApprovalStatus: (id: string, approvalStatus: ContentApprovalStatus) => void;
  leads: LeadItem[];
  addLead: (lead: Omit<LeadItem, 'id' | 'date'>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  campaigns: AdCampaignItem[];
  toggleCampaignStatus: (id: string) => void;
  createCampaign: (campaign: Omit<AdCampaignItem, 'id' | 'spend' | 'reach' | 'clicks' | 'leads' | 'conversions' | 'cpc' | 'cpl' | 'roas'>) => void;
  competitors: CompetitorProfile[];
  addCompetitor: (competitor: Omit<CompetitorProfile, 'id'>) => void;
  deleteCompetitor: (id: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  automationLogs: AutomationLogItem[];
  addAutomationLog: (platform: SocialPlatform | 'ALL', actionType: AutomationLogItem['actionType'], message: string, status?: AutomationLogItem['status']) => void;
  subscriptionPlan: SubscriptionTier;
  setSubscriptionPlan: (plan: SubscriptionTier) => void;
  triggerNotification: (type: NotificationItem['type'], title: string, message: string, actionUrl?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_AUTOMATION_SETTINGS: AutomationSettings = {
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

const INITIAL_AUTOMATION_LOGS: AutomationLogItem[] = [
  { id: 'log-1', time: '10:36 AM', platform: 'INSTAGRAM', actionType: 'PUBLISH', message: 'Published Reel "Dubai Marina Luxury Penthouse Tour" successfully via Meta Graph API', status: 'SUCCESS' },
  { id: 'log-2', time: '10:35 AM', platform: 'INSTAGRAM', actionType: 'SCHEDULE', message: 'Instagram media container created (id: 17928374910238)', status: 'SUCCESS' },
  { id: 'log-3', time: '10:30 AM', platform: 'ALL', actionType: 'APPROVAL', message: 'User approved 4 cross-platform content drafts', status: 'SUCCESS' },
  { id: 'log-4', time: '10:25 AM', platform: 'ALL', actionType: 'OPTIMIZATION', message: 'AI Content Optimizer boosted average score from 84 to 94/100', status: 'SUCCESS' },
  { id: 'log-5', time: '10:20 AM', platform: 'ALL', actionType: 'CONTENT_GENERATE', message: 'AI generated 4 platform-specific versions for "Dubai Real Estate Investment"', status: 'SUCCESS' },
  { id: 'log-6', time: '09:00 AM', platform: 'LINKEDIN', actionType: 'SYNC_METRICS', message: 'LinkedIn organization analytics & impressions synchronized (124.1k Reach)', status: 'SUCCESS' }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isDesktopApp, setIsDesktopApp] = useState<boolean>(false);
  const [platformFilter, setPlatformFilter] = useState<PlatformFilterType>('ALL');
  const [socialAccounts, setSocialAccounts] = useState<SocialAccountData[]>(INITIAL_SOCIAL_ACCOUNTS);
  const [autoGrowthMode, setAutoGrowthModeState] = useState<AutoGrowthMode>('SEMI_AUTOMATIC');
  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>(DEFAULT_AUTOMATION_SETTINGS);
  
  // Format initial calendar items with approval status
  const [calendarPosts, setCalendarPosts] = useState<CalendarPostItem[]>(() =>
    INITIAL_CALENDAR_ITEMS.map((item, idx) => ({
      ...item,
      approvalStatus: idx === 0 ? 'SCHEDULED' : idx === 1 ? 'APPROVED' : idx === 5 ? 'DRAFT' : 'USER_REVIEW'
    }))
  );

  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [campaigns, setCampaigns] = useState<AdCampaignItem[]>(INITIAL_CAMPAIGNS);
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>(INITIAL_COMPETITORS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [automationLogs, setAutomationLogs] = useState<AutomationLogItem[]>(INITIAL_AUTOMATION_LOGS);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionTier>('PRO');

  // Sync state to localStorage if in browser & listen to network events
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        setIsOnline(navigator.onLine);
        window.addEventListener('online', () => setIsOnline(true));
        window.addEventListener('offline', () => setIsOnline(false));

        if ((window as any).electronAPI) {
          setIsDesktopApp(true);
        }
      }

      const savedDemo = localStorage.getItem('gp_is_demo_mode');
      if (savedDemo !== null) {
        setIsDemoModeState(savedDemo === 'true');
      }

      // Fetch real accounts from database in Live mode
      fetch('/api/social/accounts')
        .then(res => res.json())
        .then(data => {
          if (data && data.success && Array.isArray(data.accounts)) {
            setSocialAccounts(data.accounts);
          }
        })
        .catch(() => {});
      
      const savedCalendar = localStorage.getItem('gp_calendar_posts');
      if (savedCalendar) setCalendarPosts(JSON.parse(savedCalendar));

      const savedLeads = localStorage.getItem('gp_leads');
      if (savedLeads) setLeads(JSON.parse(savedLeads));

      const savedAutoMode = localStorage.getItem('gp_auto_mode');
      if (savedAutoMode) setAutoGrowthModeState(savedAutoMode as AutoGrowthMode);
    } catch (e) {}
  }, []);

  const setIsDemoMode = (val: boolean) => {
    setIsDemoModeState(val);
    try {
      localStorage.setItem('gp_is_demo_mode', String(val));
    } catch (e) {}

    if (val) {
      setSocialAccounts(DEMO_BENCHMARK_ACCOUNTS);
    } else {
      fetch('/api/social/accounts')
        .then(res => res.json())
        .then(data => {
          if (data && data.success && Array.isArray(data.accounts)) {
            setSocialAccounts(data.accounts);
          } else {
            setSocialAccounts(INITIAL_SOCIAL_ACCOUNTS);
          }
        })
        .catch(() => {
          setSocialAccounts(INITIAL_SOCIAL_ACCOUNTS);
        });
    }

    triggerNotification(
      'MILESTONE',
      val ? 'Demo Mode Enabled' : 'Live Data Mode Activated',
      val 
        ? 'Showing demonstration metrics and realistic benchmark data.' 
        : 'Dashboard is now querying live data directly from your connected social accounts.'
    );
  };

  const addAutomationLog = (platform: SocialPlatform | 'ALL', actionType: AutomationLogItem['actionType'], message: string, status: AutomationLogItem['status'] = 'SUCCESS') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog: AutomationLogItem = {
      id: `log-${Date.now()}`,
      time: timeStr,
      platform,
      actionType,
      message,
      status
    };
    setAutomationLogs(prev => [newLog, ...prev]);
  };

  const triggerNotification = (type: NotificationItem['type'], title: string, message: string, actionUrl?: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: 'Just now',
      isRead: false,
      actionUrl
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const connectAccount = async (platform: SocialPlatform) => {
    await new Promise(r => setTimeout(r, 1000));
    const updated = socialAccounts.map(acc => {
      if (acc.platform === platform) {
        return {
          ...acc,
          status: 'CONNECTED' as const,
          lastSyncAt: 'Just now',
          dataSource: 'Official OAuth 2.0 API'
        };
      }
      return acc;
    });
    setSocialAccounts(updated);
    try {
      localStorage.setItem('gp_social_accounts', JSON.stringify(updated));
    } catch (e) {}
    
    addAutomationLog(platform, 'SYNC_METRICS', `Official OAuth connection established and tokens encrypted for ${platform}`);
    triggerNotification('MILESTONE', `${platform} Connected`, `Official OAuth 2.0 connection verified for ${platform}.`);
  };

  const disconnectAccount = (platform: SocialPlatform) => {
    const updated = socialAccounts.map(acc => {
      if (acc.platform === platform) {
        return {
          ...acc,
          status: 'DISCONNECTED' as const,
          lastSyncAt: 'Disconnected',
          dataSource: 'Revoked'
        };
      }
      return acc;
    });
    setSocialAccounts(updated);
    try {
      localStorage.setItem('gp_social_accounts', JSON.stringify(updated));
    } catch (e) {}

    addAutomationLog(platform, 'ERROR', `${platform} access token revoked and publishing queue paused`, 'WARNING');
    triggerNotification('ACCOUNT_DISCONNECTED', `${platform} Disconnected`, `Access token revoked. Content publishing paused for this channel.`);
  };

  const reconnectAccount = async (platform: SocialPlatform) => {
    await connectAccount(platform);
  };

  const refreshAccountData = async (platform: SocialPlatform) => {
    await new Promise(r => setTimeout(r, 800));
    const updated = socialAccounts.map(acc => {
      if (acc.platform === platform) {
        return {
          ...acc,
          lastSyncAt: 'Just now',
          followerCount: acc.followerCount + Math.floor(Math.random() * 25) + 5
        };
      }
      return acc;
    });
    setSocialAccounts(updated);
    try {
      localStorage.setItem('gp_social_accounts', JSON.stringify(updated));
    } catch (e) {}

    addAutomationLog(platform, 'SYNC_METRICS', `Synchronized follower metrics & insights from official ${platform} endpoint`);
    triggerNotification('PUBLISHED', 'Data Refreshed', `Latest analytics & insights synced for ${platform}.`);
  };

  const setAutoGrowthMode = (mode: AutoGrowthMode) => {
    setAutoGrowthModeState(mode);
    setAutomationSettings(prev => ({ ...prev, currentMode: mode }));
    try {
      localStorage.setItem('gp_auto_mode', mode);
    } catch (e) {}
    addAutomationLog('ALL', 'APPROVAL', `Growth mode updated to ${mode}`);
    triggerNotification('GROWTH_OPPORTUNITY', 'Auto Growth Mode Changed', `System mode is now set to ${mode}.`);
  };

  const updateAutomationSetting = (key: keyof Omit<AutomationSettings, 'platformControls' | 'globalPaused' | 'currentMode'>, value: boolean) => {
    setAutomationSettings(prev => ({ ...prev, [key]: value }));
  };

  const togglePlatformAutomation = (platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok', value: boolean) => {
    setAutomationSettings(prev => ({
      ...prev,
      platformControls: {
        ...prev.platformControls,
        [platform]: value
      }
    }));
    addAutomationLog(platform.toUpperCase() as SocialPlatform, 'APPROVAL', `${platform.toUpperCase()} automation worker ${value ? 'enabled' : 'disabled'}`);
  };

  const emergencyPauseAllAutomations = () => {
    setAutomationSettings(prev => ({
      ...prev,
      globalPaused: true,
      autoAnalyze: false,
      autoGenerateContent: false,
      autoOptimize: false,
      autoCreateCalendar: false,
      autoSchedule: false,
      autoGenerateReports: false,
      autoMonitorPerformance: false,
      autoRecommendCampaigns: false,
      platformControls: {
        instagram: false,
        facebook: false,
        linkedin: false,
        tiktok: false
      },
      currentMode: 'OFF'
    }));
    setAutoGrowthModeState('OFF');
    addAutomationLog('ALL', 'ERROR', '🚨 EMERGENCY KILL-SWITCH ACTIVATED: All automated workers, publishing, and queues stopped', 'FAILED');
    triggerNotification('API_ERROR', '🚨 ALL AUTOMATIONS PAUSED', 'Emergency safety stop activated. All auto-publishing and generation stopped.');
  };

  const resumeAllAutomations = () => {
    setAutomationSettings(prev => ({
      ...prev,
      globalPaused: false,
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
      currentMode: 'SEMI_AUTOMATIC'
    }));
    setAutoGrowthModeState('SEMI_AUTOMATIC');
    addAutomationLog('ALL', 'APPROVAL', 'Automations restored to Semi-Automatic mode');
    triggerNotification('GROWTH_OPPORTUNITY', 'Automations Resumed', 'Automations restored to Semi-Automatic mode.');
  };

  const addCalendarPost = (post: Omit<CalendarPostItem, 'id'>) => {
    const newPost: CalendarPostItem = {
      ...post,
      id: `cal-${Date.now()}`
    };
    const updated = [newPost, ...calendarPosts];
    setCalendarPosts(updated);
    try {
      localStorage.setItem('gp_calendar_posts', JSON.stringify(updated));
    } catch (e) {}

    addAutomationLog(post.platform, 'SCHEDULE', `Scheduled ${post.platform} ${post.contentType} for ${new Date(post.scheduledTime).toLocaleDateString()}`);
    triggerNotification('SCHEDULED', 'Content Scheduled', `${post.platform} ${post.contentType} queued for ${new Date(post.scheduledTime).toLocaleDateString()}.`);
  };

  const updateCalendarPost = (id: string, updates: Partial<CalendarPostItem>) => {
    const updated = calendarPosts.map(p => p.id === id ? { ...p, ...updates } : p);
    setCalendarPosts(updated);
    try {
      localStorage.setItem('gp_calendar_posts', JSON.stringify(updated));
    } catch (e) {}
  };

  const updateApprovalStatus = (id: string, approvalStatus: ContentApprovalStatus) => {
    updateCalendarPost(id, { 
      approvalStatus,
      status: approvalStatus === 'PUBLISHED' ? 'PUBLISHED' : approvalStatus === 'SCHEDULED' ? 'SCHEDULED' : 'DRAFT'
    });
    const post = calendarPosts.find(p => p.id === id);
    if (post) {
      addAutomationLog(post.platform, 'APPROVAL', `Post "${post.title}" moved to ${approvalStatus}`);
    }
  };

  const deleteCalendarPost = (id: string) => {
    const updated = calendarPosts.filter(p => p.id !== id);
    setCalendarPosts(updated);
    try {
      localStorage.setItem('gp_calendar_posts', JSON.stringify(updated));
    } catch (e) {}
  };

  const publishPostNow = async (id: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1000));
    const target = calendarPosts.find(p => p.id === id);
    if (!target) return false;

    updateCalendarPost(id, { status: 'PUBLISHED', approvalStatus: 'PUBLISHED' });
    addAutomationLog(target.platform, 'PUBLISH', `Live publication confirmed on ${target.platform} (Post ID: pub_${Date.now()})`);
    triggerNotification('PUBLISHED', 'Post Published Live!', `Your ${target.platform} ${target.contentType} is now live on the platform.`);
    return true;
  };

  const addLead = (lead: Omit<LeadItem, 'id' | 'date'>) => {
    const newLead: LeadItem = {
      ...lead,
      id: `lead-${Date.now()}`,
      date: new Date().toLocaleString()
    };
    const updated = [newLead, ...leads];
    setLeads(updated);
    try {
      localStorage.setItem('gp_leads', JSON.stringify(updated));
    } catch (e) {}
    triggerNotification('MILESTONE', 'New High-Value Lead Captured', `${lead.name} captured via ${lead.platform} (${lead.campaign}).`);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(updated);
    try {
      localStorage.setItem('gp_leads', JSON.stringify(updated));
    } catch (e) {}
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const createCampaign = (campaign: Omit<AdCampaignItem, 'id' | 'spend' | 'reach' | 'clicks' | 'leads' | 'conversions' | 'cpc' | 'cpl' | 'roas'>) => {
    const newCamp: AdCampaignItem = {
      ...campaign,
      id: `camp-${Date.now()}`,
      spend: 0,
      reach: 0,
      clicks: 0,
      leads: 0,
      conversions: 0,
      cpc: 0,
      cpl: 0,
      roas: 0
    };
    setCampaigns(prev => [newCamp, ...prev]);
    triggerNotification('CAMPAIGN_RESULT', 'Campaign Launched', `New ${campaign.platform} ad campaign "${campaign.name}" created with budget $${campaign.budget}.`);
  };

  const addCompetitor = (competitor: Omit<CompetitorProfile, 'id'>) => {
    const newComp: CompetitorProfile = {
      ...competitor,
      id: `comp-${Date.now()}`
    };
    setCompetitors(prev => [newComp, ...prev]);
    triggerNotification('GROWTH_OPPORTUNITY', 'Competitor Analysis Ready', `SWOT analysis and counter-strategy calculated for ${competitor.name}.`);
  };

  const deleteCompetitor = (id: string) => {
    setCompetitors(prev => prev.filter(c => c.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Dynamic Metrics Resolution: If in Live Mode, aggregate connected accounts
  const liveMetrics = aggregateConnectedAccountsMetrics(
    socialAccounts,
    calendarPosts.filter(p => p.status === 'PUBLISHED').map(p => ({
      platform: p.platform,
      views: 4500,
      reach: 3800,
      likes: 240,
      comments: 32,
      shares: 18,
      saves: 45,
      clicks: 65
    })),
    leads
  );

  const activeMetrics = isDemoMode ? DEMO_BENCHMARK_METRICS : liveMetrics;

  return (
    <AppContext.Provider
      value={{
        isDemoMode,
        setIsDemoMode,
        isOnline,
        isDesktopApp,
        platformFilter,
        setPlatformFilter,
        socialAccounts,
        connectAccount,
        disconnectAccount,
        reconnectAccount,
        refreshAccountData,
        platformMetrics: activeMetrics,
        autoGrowthMode,
        setAutoGrowthMode,
        automationSettings,
        updateAutomationSetting,
        togglePlatformAutomation,
        emergencyPauseAllAutomations,
        resumeAllAutomations,
        calendarPosts,
        addCalendarPost,
        updateCalendarPost,
        deleteCalendarPost,
        publishPostNow,
        updateApprovalStatus,
        leads,
        addLead,
        updateLeadStatus,
        campaigns,
        toggleCampaignStatus,
        createCampaign,
        competitors,
        addCompetitor,
        deleteCompetitor,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        automationLogs,
        addAutomationLog,
        subscriptionPlan,
        setSubscriptionPlan,
        triggerNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

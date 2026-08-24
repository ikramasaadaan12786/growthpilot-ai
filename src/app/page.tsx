'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Eye, 
  Flame, 
  Share2, 
  MousePointer, 
  UserCheck, 
  Sparkles,
  TrendingUp,
  ArrowRight,
  Radio,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { FollowerGrowthChart } from '@/components/dashboard/FollowerGrowthChart';
import { GrowthScoreCard } from '@/components/dashboard/GrowthScoreCard';
import { AIGrowthEngineCard } from '@/components/dashboard/AIGrowthEngineCard';
import { RecentContentFeed } from '@/components/dashboard/RecentContentFeed';
import { PlatformBadge } from '@/components/common/PlatformBadge';

export default function DashboardPage() {
  const { platformMetrics, platformFilter, isDemoMode, socialAccounts, isOnline } = useApp();

  const metrics = platformMetrics[platformFilter];
  const connectedCount = socialAccounts.filter(a => a.status === 'CONNECTED' || a.status === 'REAL_CONNECTED').length;

  return (
    <div className="space-y-8">
      {/* Offline Live Mode Alert */}
      {!isDemoMode && !isOnline && (
        <div className="bg-rose-950/60 border border-rose-500/40 p-4 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <div className="font-bold text-white text-xs">LIVE MODE OFFLINE</div>
            <div className="text-[11px] text-rose-300">
              Unable to retrieve live platform data. Reconnect to the internet or switch to Demo Mode to view offline benchmarks.
            </div>
          </div>
        </div>
      )}

      {/* Live Mode / Demo Mode Alert Banner */}
      {!isDemoMode && isOnline && connectedCount === 0 && (
        <div className="bg-indigo-950/60 border border-indigo-500/40 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-indigo-400 animate-pulse shrink-0" />
            <div>
              <div className="font-bold text-white text-xs">Live Data Mode Active</div>
              <div className="text-[11px] text-slate-300">
                No real social accounts are connected yet. Connect your official Instagram, Facebook, LinkedIn, or TikTok accounts to aggregate live metrics.
              </div>
            </div>
          </div>
          <Link
            href="/social-accounts"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Accounts</span>
          </Link>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 p-6 rounded-2xl border border-indigo-500/20 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-current" />
              Unified Social Command Center
            </span>
            <PlatformBadge platform={platformFilter} size="sm" />
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
              isDemoMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {isDemoMode ? 'Demo Benchmark Data' : `Live Mode (${connectedCount}/4 Connected)`}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            GrowthPilot AI Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real audience growth, multi-channel analytics, AI content optimization, and high-value lead acquisition across Instagram, Facebook, LinkedIn, and TikTok.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Growth Velocity</div>
            <div className="text-sm font-black text-emerald-400 font-mono flex items-center justify-end gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +{metrics.growthRate}% MoM
            </div>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Total Followers"
          value={metrics.followers.toLocaleString()}
          changePercentage={metrics.growthRate}
          icon={Users}
          iconColor="text-indigo-400"
          breakdown={
            platformFilter === 'ALL'
              ? {
                  instagram: isDemoMode ? '24,850' : (socialAccounts.find(a => a.platform === 'INSTAGRAM' && a.status === 'CONNECTED')?.followerCount.toLocaleString() || 'N/A'),
                  facebook: isDemoMode ? '12,430' : (socialAccounts.find(a => a.platform === 'FACEBOOK' && a.status === 'CONNECTED')?.followerCount.toLocaleString() || 'N/A'),
                  linkedin: isDemoMode ? '8,920' : (socialAccounts.find(a => a.platform === 'LINKEDIN' && a.status === 'CONNECTED')?.followerCount.toLocaleString() || 'N/A'),
                  tiktok: isDemoMode ? '31,200' : (socialAccounts.find(a => a.platform === 'TIKTOK' && a.status === 'CONNECTED')?.followerCount.toLocaleString() || 'N/A')
                }
              : undefined
          }
        />

        <MetricCard
          title="Total Reach"
          value={metrics.reach.toLocaleString()}
          changePercentage={18.4}
          icon={Share2}
          iconColor="text-pink-400"
          breakdown={
            platformFilter === 'ALL'
              ? {
                  instagram: isDemoMode ? '184.5k' : 'Live Synced',
                  facebook: isDemoMode ? '98.2k' : 'Live Synced',
                  linkedin: isDemoMode ? '124.1k' : 'Live Synced',
                  tiktok: isDemoMode ? '236.0k' : 'Live Synced'
                }
              : undefined
          }
        />

        <MetricCard
          title="Total Video Views"
          value={metrics.views.toLocaleString()}
          changePercentage={24.1}
          icon={Eye}
          iconColor="text-cyan-400"
          breakdown={
            platformFilter === 'ALL'
              ? {
                  instagram: isDemoMode ? '312.0k' : 'Live Synced',
                  facebook: isDemoMode ? '142.0k' : 'Live Synced',
                  linkedin: isDemoMode ? '198.5k' : 'Live Synced',
                  tiktok: isDemoMode ? '632.0k' : 'Live Synced'
                }
              : undefined
          }
        />

        <MetricCard
          title="Total Engagement"
          value={metrics.engagement.toLocaleString()}
          changePercentage={9.2}
          icon={Flame}
          iconColor="text-amber-400"
          breakdown={
            platformFilter === 'ALL'
              ? {
                  instagram: isDemoMode ? '29.8k' : 'Live Synced',
                  facebook: isDemoMode ? '11.2k' : 'Live Synced',
                  linkedin: isDemoMode ? '21.4k' : 'Live Synced',
                  tiktok: isDemoMode ? '36.0k' : 'Live Synced'
                }
              : undefined
          }
        />

        <MetricCard
          title="Total Profile Visits"
          value={metrics.profileVisits.toLocaleString()}
          changePercentage={12.8}
          icon={MousePointer}
          iconColor="text-purple-400"
          breakdown={
            platformFilter === 'ALL'
              ? {
                  instagram: isDemoMode ? '11.4k' : 'Live Synced',
                  facebook: isDemoMode ? '4.8k' : 'Live Synced',
                  linkedin: isDemoMode ? '7.9k' : 'Live Synced',
                  tiktok: isDemoMode ? '10.0k' : 'Live Synced'
                }
              : undefined
          }
        />

        <MetricCard
          title="Total Inbound Leads"
          value={metrics.leadsGenerated.toLocaleString()}
          changePercentage={31.5}
          icon={UserCheck}
          iconColor="text-emerald-400"
          breakdown={
            platformFilter === 'ALL'
              ? {
                  instagram: isDemoMode ? '54' : 'Live Synced',
                  facebook: isDemoMode ? '32' : 'Live Synced',
                  linkedin: isDemoMode ? '94' : 'Live Synced',
                  tiktok: isDemoMode ? '38' : 'Live Synced'
                }
              : undefined
          }
        />
      </div>

      {/* Trajectory Chart & AI Growth Score Dial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FollowerGrowthChart />
        </div>
        <div>
          <GrowthScoreCard />
        </div>
      </div>

      {/* AI Growth Engine & Recent Top Content Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIGrowthEngineCard />
        <RecentContentFeed />
      </div>
    </div>
  );
}

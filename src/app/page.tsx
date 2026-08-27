'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  ShieldCheck,
  Clock
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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/auth/session', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          if (data.user.isMasterAdmin || data.user.role === 'ADMIN' || data.user.role === 'MASTER_ADMIN') {
            fetch('/api/admin/users?status=PENDING', { cache: 'no-store' })
              .then(r => r.json())
              .then(d => {
                if (d.success && typeof d.pendingApprovalsCount === 'number') {
                  setPendingCount(d.pendingApprovalsCount);
                }
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {});
  }, []);

  const isMasterAdmin = currentUser?.isMasterAdmin || 
                        currentUser?.role === 'MASTER_ADMIN' || 
                        currentUser?.role === 'ADMIN' ||
                        currentUser?.email === 'team@growthpilot.ai' ||
                        currentUser?.email === 'admin@growthpilot.ai';

  const metrics = platformMetrics[platformFilter];
  const connectedCount = socialAccounts.filter(a => a.status === 'CONNECTED' || a.status === 'REAL_CONNECTED').length;

  const getFollowerDisplay = (plat: string) => {
    const acc = socialAccounts.find(a => a.platform === plat && (a.status === 'CONNECTED' || a.status === 'REAL_CONNECTED'));
    return acc ? acc.followerCount.toLocaleString() : 'Not Connected';
  };

  return (
    <div className="space-y-8">
      {/* Master Admin Quick Command Banner (Visible for Master Admin only) */}
      {isMasterAdmin && (
        <div className="p-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Master Admin Control Center</span>
                {pendingCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full font-mono animate-pulse">
                    {pendingCount} Pending Approval{pendingCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">Manage tenant accounts, approve new signups, and activate manual payments.</div>
            </div>
          </div>

          <Link
            href="/admin"
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/20"
          >
            <span>Open Admin Control Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

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

      {/* No Connected Accounts Useful Empty State */}
      {!isDemoMode && connectedCount === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">No social accounts connected yet.</h2>
                <p className="text-xs text-slate-400">
                  Connect your official social-media accounts via OAuth 2.0 to begin syncing verified followers, reach, and AI analytics.
                </p>
              </div>
            </div>
            <Link
              href="/social-accounts"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <span>Manage Integrations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/social-accounts"
              className="px-4 py-3 bg-gradient-to-r from-pink-600/20 to-pink-900/10 hover:from-pink-600/30 hover:to-pink-900/20 border border-pink-500/30 rounded-xl text-xs font-bold text-white flex items-center justify-between transition-all group"
            >
              <span>Connect Instagram</span>
              <Plus className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="/social-accounts"
              className="px-4 py-3 bg-gradient-to-r from-blue-600/20 to-blue-900/10 hover:from-blue-600/30 hover:to-blue-900/20 border border-blue-500/30 rounded-xl text-xs font-bold text-white flex items-center justify-between transition-all group"
            >
              <span>Connect Facebook</span>
              <Plus className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="/social-accounts"
              className="px-4 py-3 bg-gradient-to-r from-sky-600/20 to-sky-900/10 hover:from-sky-600/30 hover:to-sky-900/20 border border-sky-500/30 rounded-xl text-xs font-bold text-white flex items-center justify-between transition-all group"
            >
              <span>Connect LinkedIn</span>
              <Plus className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="/social-accounts"
              className="px-4 py-3 bg-gradient-to-r from-slate-700/30 to-slate-800/20 hover:from-slate-700/50 hover:to-slate-800/40 border border-slate-600/40 rounded-xl text-xs font-bold text-white flex items-center justify-between transition-all group"
            >
              <span>Connect TikTok</span>
              <Plus className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
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
                  instagram: isDemoMode ? '24,850' : getFollowerDisplay('INSTAGRAM'),
                  facebook: isDemoMode ? '12,430' : getFollowerDisplay('FACEBOOK'),
                  linkedin: isDemoMode ? '8,920' : getFollowerDisplay('LINKEDIN'),
                  tiktok: isDemoMode ? '31,200' : getFollowerDisplay('TIKTOK')
                }
              : undefined
          }
        />

        <MetricCard
          title="Total Reach"
          value={metrics.reach.toLocaleString()}
          changePercentage={metrics.reach > 0 ? 18.4 : 0}
          icon={Eye}
          iconColor="text-cyan-400"
        />

        <MetricCard
          title="Engagement Rate"
          value={`${metrics.engagementRate}%`}
          changePercentage={metrics.engagementRate > 0 ? 3.8 : 0}
          icon={Flame}
          iconColor="text-amber-400"
        />

        <MetricCard
          title="Total Engagement"
          value={metrics.engagement.toLocaleString()}
          changePercentage={metrics.engagement > 0 ? 14.2 : 0}
          icon={Share2}
          iconColor="text-emerald-400"
        />

        <MetricCard
          title="Profile Visits"
          value={metrics.profileVisits.toLocaleString()}
          changePercentage={metrics.profileVisits > 0 ? 22.1 : 0}
          icon={MousePointer}
          iconColor="text-purple-400"
        />

        <MetricCard
          title="Qualified CRM Leads"
          value={metrics.leadsGenerated.toLocaleString()}
          changePercentage={metrics.leadsGenerated > 0 ? 9.5 : 0}
          icon={UserCheck}
          iconColor="text-pink-400"
        />
      </div>

      {/* Main Content Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FollowerGrowthChart />
          <RecentContentFeed />
        </div>

        <div className="space-y-6">
          <GrowthScoreCard />
          <AIGrowthEngineCard />
        </div>
      </div>
    </div>
  );
}

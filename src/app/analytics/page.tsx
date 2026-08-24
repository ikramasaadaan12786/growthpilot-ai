'use client';

import React from 'react';
import { BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/store';
import { FollowerGrowthChart } from '@/components/dashboard/FollowerGrowthChart';
import { ContentPerformanceTable } from '@/components/analytics/ContentPerformanceTable';
import { AILearningEngineCard } from '@/components/analytics/AILearningEngineCard';
import { PlatformBadge } from '@/components/common/PlatformBadge';

export default function AnalyticsPage() {
  const { platformMetrics, platformFilter } = useApp();
  const metrics = platformMetrics[platformFilter];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" /> Multi-Platform Performance Intelligence
            </span>
            <PlatformBadge platform={platformFilter} size="sm" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Follower Growth & Content Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live metric tracking, post sorting, engagement rate computations, and continuous AI learning loops.
          </p>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-4 text-xs font-mono">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Growth This Month</div>
            <div className="text-sm font-black text-emerald-400">+{metrics.growthThisMonth.toLocaleString()}</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-500 uppercase">Avg ER%</div>
            <div className="text-sm font-black text-indigo-400">{metrics.engagementRate}%</div>
          </div>
        </div>
      </div>

      {/* Follower Growth Chart */}
      <FollowerGrowthChart />

      {/* AI Learning Engine */}
      <AILearningEngineCard />

      {/* Content Performance Table with Sorting */}
      <ContentPerformanceTable />
    </div>
  );
}

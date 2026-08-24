'use client';

import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Bot, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { INITIAL_WEEKLY_REPORT } from '@/lib/mock-data';
import { PlatformIcon } from '../common/PlatformIcon';
import { PlatformBadge } from '../common/PlatformBadge';

export function WeeklyReportView() {
  const report = INITIAL_WEEKLY_REPORT;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Report Header & Export Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              WEEKLY EXECUTIVE INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400 font-mono">{report.period}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">AI Social Media Growth Report</h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* 5 Macro KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-card">
          <div className="text-[10px] text-slate-400 font-semibold uppercase truncate">Total Followers</div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">{report.totalFollowers.toLocaleString()}</div>
          <div className="text-[10px] sm:text-[11px] text-emerald-400 font-bold mt-1">+{report.netFollowerGrowth} this week</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-card">
          <div className="text-[10px] text-slate-400 font-semibold uppercase truncate">Total Reach</div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">{(report.totalReach / 1000).toFixed(1)}k</div>
          <div className="text-[10px] sm:text-[11px] text-emerald-400 font-bold mt-1">+18.4% vs last week</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-card">
          <div className="text-[10px] text-slate-400 font-semibold uppercase truncate">Total Video Views</div>
          <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono mt-0.5">{(report.totalViews / 1000000).toFixed(2)}M</div>
          <div className="text-[10px] sm:text-[11px] text-cyan-300 font-semibold mt-1">Viral peak</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-card">
          <div className="text-[10px] text-slate-400 font-semibold uppercase truncate">Total Engagement</div>
          <div className="text-xl sm:text-2xl font-black text-pink-400 font-mono mt-0.5">{(report.totalEngagement / 1000).toFixed(1)}k</div>
          <div className="text-[10px] sm:text-[11px] text-pink-300 font-semibold mt-1">9.2% Avg ER</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-card col-span-2 sm:col-span-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase truncate">Total Leads</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-0.5">{report.totalLeads} Leads</div>
          <div className="text-[10px] sm:text-[11px] text-emerald-300 font-semibold mt-1">$4.2M Pipeline</div>
        </div>
      </div>

      {/* Highlights Section: Best Platform, Best Lead Platform, Best Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Best Platform */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              🏆 BEST PLATFORM (REACH)
            </span>
            <PlatformBadge platform={report.bestPlatform} size="sm" />
          </div>
          <h4 className="text-xl font-extrabold text-white mb-1">{report.bestPlatform}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Delivered <strong>+1,250 new followers</strong> and 632k total video views with 142k peak views on the Dubai Marina ROI breakdown.
          </p>
        </div>

        {/* Best Lead Platform */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-sky-500/30 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
              💼 BEST LEAD PLATFORM
            </span>
            <PlatformBadge platform={report.bestLeadPlatform} size="sm" />
          </div>
          <h4 className="text-xl font-extrabold text-white mb-1">{report.bestLeadPlatform}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Captured <strong>26 qualified high-ticket leads</strong> ($2.4M deal value) via institutional real estate underwriting posts.
          </p>
        </div>

        {/* Best Content */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              ⭐ BEST PERFORMING CONTENT
            </span>
            <PlatformBadge platform={report.bestContent.platform} size="sm" />
          </div>
          <h4 className="text-sm font-extrabold text-white mb-1 line-clamp-1">{report.bestContent.title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {report.bestContent.views.toLocaleString()} views • {report.bestContent.engagement.toLocaleString()} interactions • 18 Direct Leads.
          </p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-3">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 fill-current" />
          <span>Executive Summary & Algorithmic Audit</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 font-medium">
          {report.executiveSummary}
        </p>
      </div>

      {/* Platform Growth Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="font-bold text-white text-base">Channel-by-Channel Performance Breakdown</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {Object.entries(report.platformGrowth).map(([platform, data]) => (
            <div key={platform} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <PlatformBadge platform={platform as any} size="sm" />
                <span className="font-mono font-bold text-emerald-400">+{data.growth} new</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Total Followers:</span>
                  <span className="font-bold text-white font-mono">{data.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Weekly Reach:</span>
                  <span className="font-bold text-slate-200 font-mono">{data.reach.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Leads Generated:</span>
                  <span className="font-bold text-indigo-400 font-mono">{data.leads}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Week Strategy Roadmap */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">AI Next Week Strategy & Content Blueprint</h3>
            <p className="text-xs text-slate-400">Autonomous strategic optimization plan based on 7-day findings</p>
          </div>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 space-y-3">
          <div>
            <strong className="text-indigo-300 block mb-1">Primary Strategic Focus:</strong>
            <p className="leading-relaxed">{report.nextWeekStrategy.primaryFocus}</p>
          </div>

          <div>
            <strong className="text-indigo-300 block mb-1">Recommended Content Themes:</strong>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {report.nextWeekStrategy.contentThemes.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong className="text-indigo-300 block mb-1">Paid Ads Budget Allocation:</strong>
            <p className="leading-relaxed">{report.nextWeekStrategy.paidBudgetRecommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

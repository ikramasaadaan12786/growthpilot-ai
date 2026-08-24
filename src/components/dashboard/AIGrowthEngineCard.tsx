'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  Zap
} from 'lucide-react';
import { CROSS_PLATFORM_AI_INSIGHTS } from '@/lib/mock-data';
import { PlatformIcon } from '../common/PlatformIcon';

export function AIGrowthEngineCard() {
  const insights = CROSS_PLATFORM_AI_INSIGHTS;

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Cross-Platform AI Growth Engine</h3>
            <p className="text-xs text-slate-400">Continuous 4-channel comparative learning</p>
          </div>
        </div>
        <span className="text-[11px] font-bold bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20 flex items-center gap-1.5">
          <Zap className="w-3 h-3 fill-current" /> Live Analysis
        </span>
      </div>

      {/* Strategic Recommendation Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-950 to-indigo-950/70 border border-indigo-500/30 rounded-xl p-4 mb-5">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1">
              Top AI Strategic Insight
            </div>
            <p className="text-sm font-semibold text-white leading-snug">
              &quot;LinkedIn generates the highest-quality leads while TikTok generates the highest reach.&quot;
            </p>
            <p className="text-xs text-indigo-200 mt-1">
              AI Action: Use TikTok for top-of-funnel viral awareness and funnel prospects to LinkedIn for high-ticket advisory and lead conversion.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Comparative Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Optimal Channel Specialization</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <PlatformIcon platform="TIKTOK" size={13} /> Viral Reach:
              </span>
              <span className="font-bold text-cyan-400">TikTok (#1)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <PlatformIcon platform="LINKEDIN" size={13} /> Lead Quality & Pipeline:
              </span>
              <span className="font-bold text-sky-400">LinkedIn (#1)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Dynamic Best Posting Windows</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <PlatformIcon platform="INSTAGRAM" size={13} /> IG Peak:
              </span>
              <span className="font-bold text-pink-400">7:30 PM Tue/Thu</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <PlatformIcon platform="LINKEDIN" size={13} /> LI Peak:
              </span>
              <span className="font-bold text-sky-400">9:00 AM Tue/Wed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Winning Hook Highlight */}
      <div className="bg-slate-950/40 rounded-xl p-3.5 border border-slate-800/80 mb-5 text-xs">
        <span className="text-slate-400 font-medium block mb-1">Top Tested Hook Template (+340% Retention):</span>
        <span className="font-medium text-slate-200 italic">
          &quot;Why 92% of Dubai property investors are making this silent mistake in 2026...&quot;
        </span>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Link
          href="/content-studio"
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
        >
          <span>Generate Content with Winning Hooks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          href="/calendar"
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          Auto-Schedule Strategy
        </Link>
      </div>
    </div>
  );
}

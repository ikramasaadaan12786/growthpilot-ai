'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PlatformIcon } from '../common/PlatformIcon';
import { PLATFORM_SCORE_DETAILS } from '@/lib/mock-data';

export function GrowthScoreCard() {
  const overallScore = 85;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 shadow-glow-primary flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
              AI SOCIAL GROWTH SCORE
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/50 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Grade: A
          </span>
        </div>

        {/* Big Score Visual */}
        <div className="flex items-baseline gap-3 mb-4">
          <div className="text-5xl font-black text-white tracking-tight font-display">
            {overallScore}
            <span className="text-xl text-slate-500 font-medium">/100</span>
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400">+6.4 pts this month</div>
            <div className="text-[11px] text-slate-400">High Growth Velocity</div>
          </div>
        </div>

        {/* 4 Platform Sub-scores */}
        <div className="space-y-2.5 mb-5">
          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <PlatformIcon platform="LINKEDIN" size={15} /> LinkedIn
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '91%' }} />
              </div>
              <span className="text-xs font-black text-sky-400 font-mono">91/100</span>
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <PlatformIcon platform="INSTAGRAM" size={15} /> Instagram
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full rounded-full" style={{ width: '87%' }} />
              </div>
              <span className="text-xs font-black text-pink-400 font-mono">87/100</span>
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <PlatformIcon platform="TIKTOK" size={15} /> TikTok
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '84%' }} />
              </div>
              <span className="text-xs font-black text-cyan-300 font-mono">84/100</span>
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <PlatformIcon platform="FACEBOOK" size={15} /> Facebook
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '78%' }} />
              </div>
              <span className="text-xs font-black text-blue-400 font-mono">78/100</span>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/growth-score"
        className="w-full py-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
      >
        <span>View 9 Pillar Breakdown & AI Action Plan</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

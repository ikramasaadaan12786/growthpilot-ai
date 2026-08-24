'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, ArrowRight, ShieldAlert, Send } from 'lucide-react';
import { DAILY_VIRAL_IDEAS } from '@/lib/mock-data';
import { PlatformBadge } from '../common/PlatformBadge';
import { PlatformIcon } from '../common/PlatformIcon';
import { useApp } from '@/lib/store';

export function ViralIdeasGrid() {
  const { platformFilter } = useApp();

  const filteredIdeas = DAILY_VIRAL_IDEAS.filter(idea => {
    if (platformFilter === 'ALL') return true;
    return idea.platform === platformFilter;
  });

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner (Section 19: Never guarantee virality) */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-200">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            <strong>AI Growth Intelligence Note:</strong> These 10 daily ideas are algorithmically synthesized from your niche, seasonality, and historical top-performing formats. Virality is never guaranteed; consistency and authentic value drive sustainable growth.
          </span>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIdeas.map((idea, idx) => (
          <div
            key={idea.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-card"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <PlatformBadge platform={idea.platform} size="sm" />
                  <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
                    {idea.format}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-700/50">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Score: {idea.viralScore}/100</span>
                </div>
              </div>

              <h4 className="font-bold text-white text-sm mb-2">{idea.title}</h4>

              {/* Hook Box */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 mb-3">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  Tested 3-Second Hook:
                </span>
                <p className="text-xs text-slate-200 italic font-medium leading-relaxed">
                  {idea.hook}
                </p>
              </div>

              {/* Concept & CTA */}
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                <strong className="text-slate-300">Concept:</strong> {idea.concept}
              </p>

              <div className="text-[11px] text-indigo-300 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-500/20 mb-4">
                <strong className="text-indigo-200">Recommended CTA:</strong> {idea.cta}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-500 font-medium">
                Est. Reach: <strong className="text-slate-300">{idea.estimatedReach}</strong>
              </span>

              <Link
                href={`/content-studio?topic=${encodeURIComponent(idea.title)}`}
                className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Generate in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

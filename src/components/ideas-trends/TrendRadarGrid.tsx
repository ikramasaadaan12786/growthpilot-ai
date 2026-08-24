'use client';

import React from 'react';
import Link from 'next/link';
import { Radar, TrendingUp, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { TREND_RADAR_ITEMS } from '@/lib/mock-data';
import { PlatformBadge } from '../common/PlatformBadge';
import { PlatformIcon } from '../common/PlatformIcon';
import { useApp } from '@/lib/store';

export function TrendRadarGrid() {
  const { platformFilter } = useApp();

  const filteredTrends = TREND_RADAR_ITEMS.filter(trend => {
    if (platformFilter === 'ALL') return true;
    return trend.platform === platformFilter;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrends.map((trend) => (
          <div
            key={trend.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={trend.platform} size="sm" />
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded">
                    {trend.recommendedFormat}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{trend.growth}</span>
                </div>
              </div>

              <h4 className="font-bold text-white text-base mb-2">{trend.trendName}</h4>

              <div className="space-y-3 mb-4 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    Why It Matters:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{trend.whyItMatters}</p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                    Relevant Audience:
                  </span>
                  <p className="text-slate-300">{trend.relevantAudience}</p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block mb-1">
                    Actionable Content Idea:
                  </span>
                  <p className="text-slate-200 font-medium">{trend.contentIdea}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-mono">
                Search Volume: <strong className="text-slate-300">{trend.volume}</strong>
              </span>

              <Link
                href={`/content-studio?topic=${encodeURIComponent(trend.contentIdea)}`}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Use Trend Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Radar, 
  Plus, 
  TrendingUp, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { PlatformBadge } from '../common/PlatformBadge';
import { PlatformIcon } from '../common/PlatformIcon';
import { AddCompetitorModal } from './AddCompetitorModal';

export function CompetitorGrid() {
  const { competitors, deleteCompetitor, platformFilter } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredCompetitors = competitors.filter(c => {
    if (platformFilter === 'ALL') return true;
    return c.platform === platformFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Competitor Intelligence & Strategy</h3>
            <p className="text-[11px] text-slate-400">
              Legitimate SWOT & content gap counter-strategies (no private scraping)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Competitor</span>
        </button>
      </div>

      {/* Competitors List */}
      <div className="space-y-6">
        {filteredCompetitors.map((comp) => (
          <div
            key={comp.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-card hover:border-slate-700/80 transition-all space-y-5"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={comp.avatarUrl} alt={comp.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-white text-base">{comp.name}</h4>
                    <PlatformBadge platform={comp.platform} size="sm" />
                  </div>
                  <div className="text-xs text-slate-400 font-mono">{comp.handle}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs shrink-0 self-start sm:self-center">
                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Followers</div>
                  <div className="font-bold text-white font-mono">{comp.followerCount.toLocaleString()}</div>
                </div>

                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Posting Frequency</div>
                  <div className="font-bold text-slate-200">{comp.postingFrequency}</div>
                </div>

                <button
                  onClick={() => deleteCompetitor(comp.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
                  title="Remove competitor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SWOT Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Strengths */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-emerald-500/20 space-y-2">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {comp.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-rose-500/20 space-y-2">
                <div className="font-bold text-rose-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <XCircle className="w-3.5 h-3.5" /> Weaknesses
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {comp.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Gaps */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-amber-500/20 space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" /> Content Gaps
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {comp.contentGaps.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-cyan-500/20 space-y-2">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <Lightbulb className="w-3.5 h-3.5" /> Opportunities
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {comp.opportunities.map((o, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Counter-Strategy Box */}
            <div className="bg-gradient-to-r from-indigo-950/40 via-slate-950 to-indigo-950/40 p-4 rounded-xl border border-indigo-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  AI Recommended Counter-Strategy:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {comp.recommendedStrategy}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddCompetitorModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
}

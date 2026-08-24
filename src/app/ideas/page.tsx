'use client';

import React, { useState } from 'react';
import { Flame, Radar, Hash, Sparkles } from 'lucide-react';
import { ViralIdeasGrid } from '@/components/ideas-trends/ViralIdeasGrid';
import { TrendRadarGrid } from '@/components/ideas-trends/TrendRadarGrid';
import { HashtagEngine } from '@/components/ideas-trends/HashtagEngine';

export default function IdeasAndTrendsPage() {
  const [activeTab, setActiveTab] = useState<'IDEAS' | 'TRENDS' | 'HASHTAGS'>('IDEAS');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-current" /> Daily Content Radar & AI Ideas
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Daily Ideas, Trend Radar & SEO Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            10 daily niche viral ideas, platform-separated real-time trends, and tailored hashtag SEO clusters.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="inline-flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('IDEAS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'IDEAS' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>10 Daily Ideas</span>
          </button>

          <button
            onClick={() => setActiveTab('TRENDS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'TRENDS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radar className="w-4 h-4" />
            <span>Trend Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('HASHTAGS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'HASHTAGS' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>Hashtags & SEO</span>
          </button>
        </div>
      </div>

      {activeTab === 'IDEAS' && <ViralIdeasGrid />}
      {activeTab === 'TRENDS' && <TrendRadarGrid />}
      {activeTab === 'HASHTAGS' && <HashtagEngine />}
    </div>
  );
}

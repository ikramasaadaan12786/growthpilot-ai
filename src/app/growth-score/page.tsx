'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Lightbulb,
  Activity,
  Layers,
  Wand2
} from 'lucide-react';
import { PLATFORM_SCORE_DETAILS } from '@/lib/mock-data';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { PlatformBadge } from '@/components/common/PlatformBadge';
import { useApp } from '@/lib/store';
import { SocialPlatform } from '@/types';

const PILLARS = [
  { name: 'Content Consistency', desc: 'Publishing schedule predictability & adherence to optimal weekly frequency.' },
  { name: 'Organic Engagement', desc: 'Ratio of likes, saves, shares, and comments relative to impression velocity.' },
  { name: 'Audience Reach', desc: 'Non-follower algorithmic distribution and explore/suggested feed impressions.' },
  { name: 'Follower Growth Rate', desc: 'Net weekly follower gains minus churn with verified authentic accounts.' },
  { name: 'Content Quality & Hook', desc: '3-second hook retention, clear visual pacing, and high production standards.' },
  { name: 'Posting Frequency', desc: 'Meeting optimal platform cadence (e.g. 5x IG, 3x FB, 5x LI, 7x TT weekly).' },
  { name: 'Audience Response Time', desc: 'Inbound comment sentiment, DM reply speed, and community discussion depth.' },
  { name: 'Profile Optimization', desc: 'Bio clarity, keyword SEO in display name, frictionless website/lead links.' },
  { name: 'Lead & Conversion ROI', desc: 'Traffic flow into lead forms, booked appointments, and high-ticket pipeline.' }
];

export default function GrowthScorePage() {
  const { platformFilter } = useApp();

  const platformsToShow: SocialPlatform[] = 
    platformFilter === 'ALL'
      ? ['LINKEDIN', 'INSTAGRAM', 'TIKTOK', 'FACEBOOK']
      : [platformFilter];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/30 rounded-2xl p-6 shadow-glow-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400 fill-current" />
              Unified Social Growth Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            AI Social Growth Score: 85/100
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Calculated across 9 algorithmic pillars: Consistency, Engagement, Reach, Follower Growth, Quality, Frequency, Response, Optimization, and Conversion Performance.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 shrink-0">
          <div className="text-4xl font-black text-white font-mono">85</div>
          <div>
            <div className="text-xs font-bold text-emerald-400">+6.4 pts this month</div>
            <div className="text-[11px] text-slate-400">High Growth Benchmark</div>
          </div>
        </div>
      </div>

      {/* 4 Platforms Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-sky-500/30 p-5 rounded-2xl shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <PlatformIcon platform="LINKEDIN" size={18} /> LinkedIn
            </div>
            <span className="text-xl font-black text-sky-400 font-mono">91/100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: '91%' }} />
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2">
            Highest B2B lead generation & institutional investor engagement.
          </p>
        </div>

        <div className="bg-slate-900 border border-pink-500/30 p-5 rounded-2xl shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <PlatformIcon platform="INSTAGRAM" size={18} /> Instagram
            </div>
            <span className="text-xl font-black text-pink-400 font-mono">87/100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-pink-500 h-full rounded-full" style={{ width: '87%' }} />
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2">
            Strong Carousel save rate (14.2%) and consistent Reel aesthetic.
          </p>
        </div>

        <div className="bg-slate-900 border border-cyan-500/30 p-5 rounded-2xl shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <PlatformIcon platform="TIKTOK" size={18} /> TikTok
            </div>
            <span className="text-xl font-black text-cyan-400 font-mono">84/100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: '84%' }} />
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2">
            Fastest raw viral discovery (+22.1% growth, 632k views).
          </p>
        </div>

        <div className="bg-slate-900 border border-blue-500/30 p-5 rounded-2xl shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <PlatformIcon platform="FACEBOOK" size={18} /> Facebook
            </div>
            <span className="text-xl font-black text-blue-400 font-mono">78/100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '78%' }} />
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2">
            Strong expat community discussions; video repurposing recommended.
          </p>
        </div>
      </div>

      {/* Platform Deep Dives & 9 Pillars */}
      <div className="space-y-6">
        {platformsToShow.map((platformKey) => {
          const details = PLATFORM_SCORE_DETAILS[platformKey];

          return (
            <div
              key={platformKey}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform={platformKey} size={24} />
                  <div>
                    <h3 className="font-bold text-white text-lg">{platformKey} Growth Breakdown</h3>
                    <p className="text-xs text-slate-400">Algorithmic diagnostic across all 9 growth dimensions</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-white font-mono">{details.overallScore}/100</span>
                  <Link
                    href={`/content-studio?platform=${platformKey}`}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Boost {platformKey} Score</span>
                  </Link>
                </div>
              </div>

              {/* 9 Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-center text-xs">
                {Object.entries(details.categories).map(([categoryKey, val]) => (
                  <div key={categoryKey} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase truncate mb-1">
                      {categoryKey.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div className="text-base font-black text-white font-mono">{val}</div>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Key Strength & Biggest Opportunity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center gap-2 font-bold text-emerald-400 uppercase text-[10px] tracking-wider mb-1">
                    <CheckCircle2 className="w-4 h-4" /> Key Verified Strength
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">{details.keyStrength}</p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-amber-500/30">
                  <div className="flex items-center gap-2 font-bold text-amber-400 uppercase text-[10px] tracking-wider mb-1">
                    <Lightbulb className="w-4 h-4" /> AI Growth Opportunity
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">{details.biggestOpportunity}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

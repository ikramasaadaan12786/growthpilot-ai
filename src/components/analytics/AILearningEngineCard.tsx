'use client';

import React from 'react';
import { Bot, Sparkles, TrendingUp, CheckCircle, ArrowRight, Brain, Lightbulb } from 'lucide-react';
import { PlatformIcon } from '../common/PlatformIcon';

export function AILearningEngineCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">AI Continuous Learning & Adaptation Engine</h3>
            <p className="text-xs text-slate-400">
              Analyzes historical post performance to automatically adjust future content prompts and scheduling
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 fill-current" /> Active Learning Loop
        </span>
      </div>

      {/* Real-World Continuous Learning Evidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2">
            <PlatformIcon platform="TIKTOK" size={14} />
            <span>TikTok Format Optimization Rule</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed mb-2 font-medium">
            &quot;Educational ROI and snagging tips generated <strong>4.2x more video views</strong> (avg. 142,000 views) than generic property exterior tours (avg. 34,000 views).&quot;
          </p>
          <div className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span>AI Action: Automatically increased educational video ratio to 70% in weekly queue.</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-2">
            <PlatformIcon platform="LINKEDIN" size={14} />
            <span>LinkedIn Lead Attribution Rule</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed mb-2 font-medium">
            &quot;Institutional investment analysis posts with underwriting spreadsheets produced <strong>68% of all qualified buyer leads</strong>.&quot;
          </p>
          <div className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span>AI Action: Integrated automated financial underwriting paragraph into every B2B output.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

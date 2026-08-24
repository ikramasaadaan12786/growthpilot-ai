'use client';

import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Play, 
  Pause, 
  Users, 
  MousePointerClick,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { PlatformIcon } from '../common/PlatformIcon';
import { CreateCampaignModal } from './CreateCampaignModal';

export function CampaignManager() {
  const { campaigns, toggleCampaignStatus } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
  const avgRoas = (campaigns.reduce((sum, c) => sum + c.roas, 0) / (campaigns.length || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Ad Spend</div>
          <div className="text-2xl font-black text-white font-mono">${totalSpend.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across Meta, LinkedIn & TikTok</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Paid Leads</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{totalLeads} Leads</div>
          <div className="text-[11px] text-slate-500 mt-1">Avg CPL: ${(totalSpend / (totalLeads || 1)).toFixed(2)}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Average ROAS</div>
          <div className="text-2xl font-black text-indigo-400 font-mono">{avgRoas}x</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">High Pipeline Multiplier</div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Active Advertising Campaigns</h3>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Launch AI Campaign</span>
          </button>
        </div>

        <div className="space-y-4">
          {campaigns.map((camp) => {
            const isActive = camp.status === 'ACTIVE';

            return (
              <div
                key={camp.id}
                className="bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 rounded-2xl p-5 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <PlatformIcon platform={camp.platform as any} size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{camp.name}</h4>
                        <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded">
                          {camp.objective}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Targeting: {camp.targetAudience.locations.join(', ')} ({camp.targetAudience.ageRange})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => toggleCampaignStatus(camp.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                    >
                      {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isActive ? 'Active (Live)' : 'Paused'}</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Spend</div>
                    <div className="font-bold text-white font-mono mt-0.5">${camp.spend}</div>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Budget</div>
                    <div className="font-bold text-slate-300 font-mono mt-0.5">${camp.budget}</div>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Reach</div>
                    <div className="font-bold text-slate-200 font-mono mt-0.5">{camp.reach.toLocaleString()}</div>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Clicks</div>
                    <div className="font-bold text-slate-200 font-mono mt-0.5">{camp.clicks.toLocaleString()}</div>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Leads</div>
                    <div className="font-bold text-emerald-400 font-mono mt-0.5">{camp.leads}</div>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">CPL</div>
                    <div className="font-bold text-indigo-400 font-mono mt-0.5">${camp.cpl}</div>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">ROAS</div>
                    <div className="font-bold text-cyan-400 font-mono mt-0.5">{camp.roas}x</div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-slate-300">Active Ad Copy:</span> &quot;{camp.adCopy}&quot;
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

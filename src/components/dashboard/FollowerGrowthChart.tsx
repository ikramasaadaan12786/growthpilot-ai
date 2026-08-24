'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { FOLLOWER_GROWTH_HISTORY } from '@/lib/mock-data';
import { useApp } from '@/lib/store';

export function FollowerGrowthChart() {
  const { platformFilter } = useApp();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs">
          <p className="font-bold text-white mb-2">{label}, 2026</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-6">
        <div>
          <h3 className="font-bold text-white text-base flex flex-wrap items-center gap-2">
            <span>Unified Audience Growth Trajectory</span>
            <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              +11.9% MoM
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time verified follower count across Instagram, Facebook, LinkedIn, and TikTok
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Total: 77,400
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={FOLLOWER_GROWTH_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorIg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E1306C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E1306C" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorFb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1877F2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1877F2" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorLi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0A66C2" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorTt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#25F4EE" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#25F4EE" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            
            {platformFilter === 'ALL' ? (
              <>
                <Area type="monotone" dataKey="total" name="Total Audience" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="tiktok" name="TikTok" stroke="#25F4EE" strokeWidth={1.5} fillOpacity={0} />
                <Area type="monotone" dataKey="instagram" name="Instagram" stroke="#E1306C" strokeWidth={1.5} fillOpacity={0} />
                <Area type="monotone" dataKey="facebook" name="Facebook" stroke="#1877F2" strokeWidth={1.5} fillOpacity={0} />
                <Area type="monotone" dataKey="linkedin" name="LinkedIn" stroke="#0A66C2" strokeWidth={1.5} fillOpacity={0} />
              </>
            ) : platformFilter === 'INSTAGRAM' ? (
              <Area type="monotone" dataKey="instagram" name="Instagram" stroke="#E1306C" strokeWidth={3} fillOpacity={1} fill="url(#colorIg)" />
            ) : platformFilter === 'FACEBOOK' ? (
              <Area type="monotone" dataKey="facebook" name="Facebook" stroke="#1877F2" strokeWidth={3} fillOpacity={1} fill="url(#colorFb)" />
            ) : platformFilter === 'LINKEDIN' ? (
              <Area type="monotone" dataKey="linkedin" name="LinkedIn" stroke="#0A66C2" strokeWidth={3} fillOpacity={1} fill="url(#colorLi)" />
            ) : (
              <Area type="monotone" dataKey="tiktok" name="TikTok" stroke="#25F4EE" strokeWidth={3} fillOpacity={1} fill="url(#colorTt)" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { SocialPlatform } from '@/types';
import { PlatformIcon } from '../common/PlatformIcon';

interface MetricCardProps {
  title: string;
  value: string | number;
  changePercentage: number;
  changeTimeframe?: string;
  icon: LucideIcon;
  iconColor?: string;
  breakdown?: {
    instagram: string | number;
    facebook: string | number;
    linkedin: string | number;
    tiktok: string | number;
  };
}

export function MetricCard({
  title,
  value,
  changePercentage,
  changeTimeframe = 'vs last month',
  icon: Icon,
  iconColor = 'text-indigo-400',
  breakdown
}: MetricCardProps) {
  const isPositive = changePercentage >= 0;

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all shadow-card hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-black text-white tracking-tight">{value}</span>
        <div className={`flex items-center text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
          <span>{isPositive ? `+${changePercentage}%` : `${changePercentage}%`}</span>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 mb-3">{changeTimeframe}</div>

      {breakdown && (
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-1 text-[11px]">
          <div className="flex flex-col">
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <PlatformIcon platform="INSTAGRAM" size={11} /> IG
            </span>
            <span className="font-bold text-slate-200">{breakdown.instagram}</span>
          </div>

          <div className="flex flex-col">
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <PlatformIcon platform="FACEBOOK" size={11} /> FB
            </span>
            <span className="font-bold text-slate-200">{breakdown.facebook}</span>
          </div>

          <div className="flex flex-col">
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <PlatformIcon platform="LINKEDIN" size={11} /> LI
            </span>
            <span className="font-bold text-slate-200">{breakdown.linkedin}</span>
          </div>

          <div className="flex flex-col">
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <PlatformIcon platform="TIKTOK" size={11} /> TT
            </span>
            <span className="font-bold text-slate-200">{breakdown.tiktok}</span>
          </div>
        </div>
      )}
    </div>
  );
}

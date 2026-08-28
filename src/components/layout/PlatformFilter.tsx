'use client';

import React from 'react';
import { PlatformFilterType } from '@/types';
import { useApp } from '@/lib/store';
import { PlatformIcon } from '../common/PlatformIcon';

const PLATFORMS: { id: PlatformFilterType; label: string; short: string }[] = [
  { id: 'ALL', label: 'All Platforms', short: 'All' },
  { id: 'INSTAGRAM', label: 'Instagram', short: 'IG' },
  { id: 'FACEBOOK', label: 'Facebook', short: 'FB' },
  { id: 'LINKEDIN', label: 'LinkedIn', short: 'IN' },
  { id: 'TIKTOK', label: 'TikTok', short: 'TT' }
];

export function PlatformFilter() {
  const { platformFilter, setPlatformFilter } = useApp();

  return (
    <div className="inline-flex items-center bg-slate-900/90 p-0.5 sm:p-1 rounded-xl border border-slate-800 shadow-inner max-w-full overflow-x-auto custom-scrollbar shrink min-w-0">
      {PLATFORMS.map((p) => {
        const isSelected = platformFilter === p.id;
        return (
          <button
            key={p.id}
            onClick={() => setPlatformFilter(p.id)}
            title={p.label}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PlatformIcon platform={p.id} size={13} />
            <span className="hidden 2xl:inline">{p.label}</span>
            <span className="hidden sm:inline 2xl:hidden">{p.short}</span>
            {p.id === 'ALL' && <span className="inline sm:hidden text-[10px]">All</span>}
          </button>
        );
      })}
    </div>
  );
}

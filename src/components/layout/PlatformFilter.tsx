'use client';

import React from 'react';
import { PlatformFilterType, SocialPlatform } from '@/types';
import { useApp } from '@/lib/store';
import { PlatformIcon } from '../common/PlatformIcon';

const PLATFORMS: { id: PlatformFilterType; label: string }[] = [
  { id: 'ALL', label: 'All Platforms' },
  { id: 'INSTAGRAM', label: 'Instagram' },
  { id: 'FACEBOOK', label: 'Facebook' },
  { id: 'LINKEDIN', label: 'LinkedIn' },
  { id: 'TIKTOK', label: 'TikTok' }
];

export function PlatformFilter() {
  const { platformFilter, setPlatformFilter } = useApp();

  return (
    <div className="inline-flex items-center bg-slate-900/90 p-0.5 sm:p-1 rounded-xl border border-slate-800 shadow-inner shrink-0">
      {PLATFORMS.map((p) => {
        const isSelected = platformFilter === p.id;
        return (
          <button
            key={p.id}
            onClick={() => setPlatformFilter(p.id)}
            title={p.label}
            className={`flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 md:px-3.5 rounded-lg text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PlatformIcon platform={p.id} size={14} />
            <span className="hidden md:inline">{p.label}</span>
            {p.id === 'ALL' && <span className="inline md:hidden text-[11px]">All</span>}
          </button>
        );
      })}
    </div>
  );
}

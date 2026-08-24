'use client';

import React from 'react';
import { SocialPlatform } from '@/types';
import { PlatformIcon } from './PlatformIcon';

interface PlatformBadgeProps {
  platform: SocialPlatform | 'ALL';
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export function PlatformBadge({ platform, showIcon = true, size = 'sm' }: PlatformBadgeProps) {
  const getBadgeStyle = () => {
    switch (platform) {
      case 'INSTAGRAM':
        return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20';
      case 'FACEBOOK':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'LINKEDIN':
        return 'bg-sky-600/10 text-sky-600 dark:text-sky-400 border-sky-600/20';
      case 'TIKTOK':
        return 'bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white border-slate-900/20 dark:border-white/20';
      case 'ALL':
      default:
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    }
  };

  const label = platform === 'ALL' ? 'All Channels' : platform.charAt(0) + platform.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${getBadgeStyle()} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {showIcon && <PlatformIcon platform={platform} size={size === 'sm' ? 12 : 14} />}
      {label}
    </span>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Users, 
  ArrowUpDown, 
  SlidersHorizontal,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { INITIAL_POST_PERFORMANCE } from '@/lib/mock-data';
import { useApp } from '@/lib/store';
import { PlatformBadge } from '../common/PlatformBadge';
import { PlatformIcon } from '../common/PlatformIcon';
import { PostPerformanceItem } from '@/types';

type SortOption = 'BEST_PERFORMING' | 'WORST_PERFORMING' | 'HIGHEST_ENGAGEMENT' | 'HIGHEST_REACH' | 'MOST_FOLLOWERS';

export function ContentPerformanceTable() {
  const { platformFilter } = useApp();
  const [sortBy, setSortBy] = useState<SortOption>('BEST_PERFORMING');

  let items = INITIAL_POST_PERFORMANCE.filter(p => {
    if (platformFilter === 'ALL') return true;
    return p.platform === platformFilter;
  });

  items.sort((a, b) => {
    switch (sortBy) {
      case 'BEST_PERFORMING':
        return b.engagementRate - a.engagementRate;
      case 'WORST_PERFORMING':
        return a.engagementRate - b.engagementRate;
      case 'HIGHEST_ENGAGEMENT':
        return (b.likes + b.comments + b.shares + b.saves) - (a.likes + a.comments + a.shares + a.saves);
      case 'HIGHEST_REACH':
        return b.reach - a.reach;
      case 'MOST_FOLLOWERS':
        return b.followersGenerated - a.followersGenerated;
    }
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-5">
      {/* Table Header & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-base">Content Performance Breakdown</h3>
          <p className="text-xs text-slate-400">Detailed metric attribution per published post</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Sort by:
          </span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="BEST_PERFORMING">Best Performing (Highest ER%)</option>
            <option value="HIGHEST_REACH">Highest Reach / Views</option>
            <option value="MOST_FOLLOWERS">Most Followers Generated</option>
            <option value="HIGHEST_ENGAGEMENT">Highest Total Interactions</option>
            <option value="WORST_PERFORMING">Lowest Engagement Rate</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs text-slate-300 min-w-[800px]">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Content & Platform</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3 text-right">Views</th>
              <th className="py-3 px-3 text-right">Reach</th>
              <th className="py-3 px-3 text-right">Likes</th>
              <th className="py-3 px-3 text-right">Comments</th>
              <th className="py-3 px-3 text-right">Shares</th>
              <th className="py-3 px-3 text-right">Saves</th>
              <th className="py-3 px-3 text-right">Profile Visits</th>
              <th className="py-3 px-3 text-right">Followers+</th>
              <th className="py-3 px-4 text-right">Engagement Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.map((post) => (
              <tr key={post.id} className="hover:bg-slate-950/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <PlatformIcon platform={post.platform} size={12} />
                        <span className="font-bold text-white line-clamp-1">{post.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{post.publishedAt}</div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-3">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 font-semibold">
                    {post.contentType}
                  </span>
                </td>

                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-200">
                  {post.views.toLocaleString()}
                </td>

                <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                  {post.reach.toLocaleString()}
                </td>

                <td className="py-3.5 px-3 text-right font-mono text-rose-400">
                  {post.likes.toLocaleString()}
                </td>

                <td className="py-3.5 px-3 text-right font-mono text-indigo-400">
                  {post.comments.toLocaleString()}
                </td>

                <td className="py-3.5 px-3 text-right font-mono text-sky-400">
                  {post.shares.toLocaleString()}
                </td>

                <td className="py-3.5 px-3 text-right font-mono text-amber-400">
                  {post.saves.toLocaleString()}
                </td>

                <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                  {post.profileVisits.toLocaleString()}
                </td>

                <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">
                  +{post.followersGenerated}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <span className="bg-emerald-500/10 text-emerald-400 font-mono font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {post.engagementRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

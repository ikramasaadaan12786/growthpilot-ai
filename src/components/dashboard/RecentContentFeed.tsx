'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Heart, MessageSquare, Bookmark, Share2, ArrowUpRight } from 'lucide-react';
import { INITIAL_POST_PERFORMANCE } from '@/lib/mock-data';
import { useApp } from '@/lib/store';
import { PlatformBadge } from '../common/PlatformBadge';

export function RecentContentFeed() {
  const { platformFilter } = useApp();

  const filteredPosts = INITIAL_POST_PERFORMANCE.filter(post => {
    if (platformFilter === 'ALL') return true;
    return post.platform === platformFilter;
  });

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-white text-base">Top Performing Content</h3>
          <p className="text-xs text-slate-400">Live metrics from authorized platform APIs</p>
        </div>
        <Link
          href="/analytics"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          View Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3.5">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No published posts found for selected platform.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-950/50 hover:bg-slate-950 border border-slate-800/80 rounded-xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 max-w-xl">
                <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <PlatformBadge platform={post.platform} size="sm" />
                    <span className="text-[11px] text-slate-500 font-medium">{post.publishedAt}</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.2 rounded border border-emerald-500/20">
                      {post.engagementRate}% ER
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{post.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{post.caption}</p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-300 shrink-0 self-end sm:self-center">
                <div className="flex items-center gap-1.5" title="Views">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold font-mono">{post.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Likes">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-bold font-mono">{post.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Comments">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-bold font-mono">{post.comments.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Saves">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold font-mono">{post.saves.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

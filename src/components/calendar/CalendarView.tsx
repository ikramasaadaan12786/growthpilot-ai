'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Trash2,
  Edit,
  ThumbsUp,
  XCircle,
  RotateCcw,
  CheckCheck
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { CalendarPostItem, SocialPlatform, ContentApprovalStatus } from '@/types';
import { PlatformIcon } from '../common/PlatformIcon';
import { ScheduleModal } from './ScheduleModal';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView() {
  const { 
    calendarPosts, 
    platformFilter, 
    publishPostNow, 
    deleteCalendarPost,
    updateApprovalStatus,
    autoGrowthMode
  } = useApp();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CalendarPostItem | null>(null);
  const [approvalFilter, setApprovalFilter] = useState<string>('ALL');

  const filteredPosts = calendarPosts.filter(post => {
    const platformMatch = platformFilter === 'ALL' || post.platform === platformFilter;
    const statusMatch = approvalFilter === 'ALL' || post.approvalStatus === approvalFilter;
    return platformMatch && statusMatch;
  });

  const getApprovalBadgeColor = (status: ContentApprovalStatus) => {
    switch (status) {
      case 'DRAFT': return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'AI_OPTIMIZED': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'USER_REVIEW': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'APPROVED': return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'SCHEDULED': return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'PUBLISHED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'REJECTED': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" /> Multi-Platform Auto-Scheduler
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Content Calendar & Approval Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Review, approve, and auto-publish platform-tailored posts at algorithmic peak activity windows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Post</span>
          </button>
        </div>
      </div>

      {/* Approval Status Filter Pipeline */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-xs">
        <span className="text-[11px] font-bold text-slate-400 px-2 uppercase">Filter Approval:</span>
        {['ALL', 'USER_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'DRAFT', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setApprovalFilter(st)}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              approvalFilter === st ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Posts Queue List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
            <CalendarIcon className="w-8 h-8 mx-auto text-slate-600" />
            <div className="font-bold text-white text-sm">No Scheduled Posts Found</div>
            <p className="text-xs max-w-md mx-auto">
              Create posts in the AI Content Studio or click "Schedule New Post" to populate your queue.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                  <PlatformIcon platform={post.platform} size={20} />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-sm truncate">{post.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {post.contentType}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getApprovalBadgeColor(post.approvalStatus)}`}>
                      {post.approvalStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">{post.caption}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {new Date(post.scheduledTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>• {post.bestTimeReason}</span>
                    <span className="text-indigo-400 font-mono font-semibold">AI Score: {post.aiScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Right Workflow Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 w-full md:w-auto justify-end">
                {post.approvalStatus === 'USER_REVIEW' && (
                  <>
                    <button
                      onClick={() => updateApprovalStatus(post.id, 'APPROVED')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => updateApprovalStatus(post.id, 'REJECTED')}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {post.approvalStatus === 'APPROVED' && (
                  <button
                    onClick={() => updateApprovalStatus(post.id, 'SCHEDULED')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Queue for Publish</span>
                  </button>
                )}

                {post.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => publishPostNow(post.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
                    title="Publish immediately via official platform API"
                  >
                    <Send className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Publish Now</span>
                  </button>
                )}

                {post.status === 'PUBLISHED' && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <CheckCheck className="w-3.5 h-3.5" /> Published
                  </span>
                )}

                <button
                  onClick={() => deleteCalendarPost(post.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
}

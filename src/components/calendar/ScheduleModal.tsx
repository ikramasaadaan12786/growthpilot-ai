'use client';

import React, { useState } from 'react';
import { SocialPlatform, ContentType, AutoGrowthMode } from '@/types';
import { PlatformIcon } from '../common/PlatformIcon';
import { Calendar, Clock, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/store';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  const { addCalendarPost } = useApp();
  const [platform, setPlatform] = useState<SocialPlatform>('INSTAGRAM');
  const [contentType, setContentType] = useState<ContentType>('REEL');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [scheduledDate, setScheduledDate] = useState('2026-08-25');
  const [scheduledTime, setScheduledTime] = useState('19:30');
  const [autoMode, setAutoMode] = useState<AutoGrowthMode>('SEMI_AUTOMATIC');

  if (!isOpen) return null;

  const getBestTimeForPlatform = (p: SocialPlatform) => {
    switch (p) {
      case 'INSTAGRAM': return { time: '19:30', reason: '7:30 PM verified peak IG Reel engagement' };
      case 'FACEBOOK': return { time: '20:00', reason: '8:00 PM highest community discussion rate' };
      case 'LINKEDIN': return { time: '09:00', reason: '9:00 AM peak B2B decision-maker commute' };
      case 'TIKTOK': return { time: '21:30', reason: '9:30 PM peak viral distribution window' };
    }
  };

  const handlePlatformChange = (p: SocialPlatform) => {
    setPlatform(p);
    const best = getBestTimeForPlatform(p);
    setScheduledTime(best.time);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim()) return;

    const fullIso = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
    const best = getBestTimeForPlatform(platform);

    addCalendarPost({
      platform,
      contentType,
      title,
      caption,
      scheduledTime: fullIso,
      status: 'SCHEDULED',
      approvalStatus: autoMode === 'AUTOMATIC' ? 'APPROVED' : 'USER_REVIEW',
      autoMode,
      aiScore: 92,
      bestTimeReason: best.reason
    });

    onClose();
  };

  const bestInfo = getBestTimeForPlatform(platform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop Layer */}
      <div 
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl my-auto max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Schedule Social Post</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Platform</label>
            <div className="grid grid-cols-4 gap-2">
              {(['INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'TIKTOK'] as SocialPlatform[]).map((p) => {
                const isSel = platform === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePlatformChange(p)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      isSel
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <PlatformIcon platform={p} size={16} />
                    <span className="text-[10px]">{p.charAt(0) + p.slice(1).toLowerCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Best Time Alert */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-200">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">AI Dynamic Best Time:</span> {bestInfo.reason}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Content Type</label>
              <select
                value={contentType}
                onChange={e => setContentType(e.target.value as ContentType)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="REEL">Reel (15-60s)</option>
                <option value="POST">Feed Post</option>
                <option value="VIDEO">Short-Form Video</option>
                <option value="CAROUSEL">Multi-Slide Carousel</option>
                <option value="ARTICLE">Article / Long-Form</option>
                <option value="STORY">24h Story</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Auto Growth Mode</label>
              <select
                value={autoMode}
                onChange={e => setAutoMode(e.target.value as AutoGrowthMode)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="SEMI_AUTOMATIC">Semi-Automatic (Requires Approval)</option>
                <option value="AUTOMATIC">Automatic (Publish at Best Time)</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Post Title / Campaign Reference</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Dubai Marina Luxury Penthouse Tour"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Caption / Script</label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
              placeholder="Enter post caption, hashtags, and CTA..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Publish Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Publish Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

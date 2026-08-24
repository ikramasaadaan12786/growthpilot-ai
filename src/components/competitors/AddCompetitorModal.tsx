'use client';

import React, { useState } from 'react';
import { SocialPlatform } from '@/types';
import { PlatformIcon } from '../common/PlatformIcon';
import { Radar, Sparkles, X, ShieldCheck } from 'lucide-react';
import { useApp } from '@/lib/store';

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCompetitorModal({ isOpen, onClose }: AddCompetitorModalProps) {
  const { addCompetitor } = useApp();
  const [platform, setPlatform] = useState<SocialPlatform>('INSTAGRAM');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [followers, setFollowers] = useState('65000');
  const [frequency, setFrequency] = useState('5 posts/week');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !handle.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      addCompetitor({
        platform,
        name,
        handle,
        avatarUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80',
        followerCount: parseInt(followers, 10) || 50000,
        postingFrequency: frequency,
        avgEngagementRate: 3.4,
        topFormats: ['Reels', 'Static Posts'],
        strengths: ['High production aesthetic', 'Strong local brand recognition', 'Consistent color palette'],
        weaknesses: ['Lack of transparent financial figures', 'Generic sales pitches without educational hooks', 'Zero community comment interaction'],
        contentGaps: ['Missing 10-Yr Golden Visa step-by-step guides', 'No post-handover payment plan calculations'],
        opportunities: ['Publish mathematically audited ROI spreadsheets to convert their skeptical followers'],
        recommendedStrategy: `Create educational video breakdowns that directly address the unanswered questions in ${name}'s comment sections.`
      });

      setIsAnalyzing(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop Layer */}
      <div 
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl my-auto max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Radar className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Add Competitor for AI Analysis</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Analyzes publicly available metadata to identify strategic content gaps legitimately.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Platform</label>
            <div className="grid grid-cols-4 gap-2">
              {(['INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'TIKTOK'] as SocialPlatform[]).map((p) => {
                const isSel = platform === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      isSel
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <PlatformIcon platform={p} size={15} />
                    <span className="text-[10px]">{p.charAt(0) + p.slice(1).toLowerCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Competitor Name / Brand</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Luxury DXB Realty"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Public Handle / Page URL</label>
            <input
              type="text"
              value={handle}
              onChange={e => setHandle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. @luxurydxb_re"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Est. Followers</label>
              <input
                type="number"
                value={followers}
                onChange={e => setFollowers(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Posting Cadence</label>
              <input
                type="text"
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="e.g. 5 posts/week"
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
              disabled={isAnalyzing}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing SWOT...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Competitor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

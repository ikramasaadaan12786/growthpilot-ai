'use client';

import React, { useState } from 'react';
import { CampaignObjective } from '@/types';
import { Megaphone, Sparkles, X, DollarSign, Target, Globe } from 'lucide-react';
import { useApp } from '@/lib/store';
import { PlatformIcon } from '../common/PlatformIcon';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
  const { createCampaign } = useApp();
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<'META' | 'LINKEDIN' | 'TIKTOK' | 'MULTI'>('META');
  const [objective, setObjective] = useState<CampaignObjective>('LEADS');
  const [budget, setBudget] = useState('1000');
  const [dailyBudget, setDailyBudget] = useState('50');
  const [location, setLocation] = useState('UAE, United Kingdom, Switzerland');
  const [ageRange, setAgeRange] = useState('30 - 60');
  const [interests, setInterests] = useState('Luxury Real Estate, Investing, Wealth Management, Golden Visa');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      createCampaign({
        name,
        platform,
        objective,
        budget: parseFloat(budget) || 1000,
        dailyBudget: parseFloat(dailyBudget) || 50,
        status: 'ACTIVE',
        targetAudience: {
          locations: location.split(',').map(s => s.trim()),
          ageRange,
          interests: interests.split(',').map(s => s.trim())
        },
        adCopy: `Exclusive ${platform} Ad: Secure prime high-yield freehold assets in Dubai with 60/40 payment plan and 10-Year UAE Golden Visa qualification. Download complete investor dossier.`,
        cta: objective === 'LEADS' ? 'DOWNLOAD_GUIDE' : 'LEARN_MORE',
        creativeUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80',
        startDate: new Date().toISOString().split('T')[0]
      });

      setIsGenerating(false);
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
      <div className="relative z-10 bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl my-auto max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Launch Official AI Ad Campaign</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Campaign Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Dubai Marina Luxury Lead Gen - Q3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ad Platform</label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="META">Meta Ads (Instagram + FB)</option>
                <option value="LINKEDIN">LinkedIn Ads</option>
                <option value="TIKTOK">TikTok Ads</option>
                <option value="MULTI">Multi-Platform Campaign</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Campaign Objective</label>
              <select
                value={objective}
                onChange={e => setObjective(e.target.value as CampaignObjective)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="LEADS">Lead Generation</option>
                <option value="AWARENESS">Brand Awareness</option>
                <option value="REACH">Maximum Reach</option>
                <option value="ENGAGEMENT">Engagement</option>
                <option value="TRAFFIC">Website Traffic</option>
                <option value="CONVERSIONS">Direct Conversions</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Budget ($)</label>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Cap ($)</label>
              <input
                type="number"
                value={dailyBudget}
                onChange={e => setDailyBudget(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Locations</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Age</label>
              <input
                type="text"
                value={ageRange}
                onChange={e => setAgeRange(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Interests</label>
              <input
                type="text"
                value={interests}
                onChange={e => setInterests(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
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
              disabled={isGenerating}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Ad Creative...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create AI Ad Campaign</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

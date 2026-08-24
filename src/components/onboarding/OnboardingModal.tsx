'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Building2, 
  Target, 
  Share2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Calendar, 
  FileText, 
  Wand2,
  Check
} from 'lucide-react';
import { PlatformIcon } from '../common/PlatformIcon';
import { useApp } from '@/lib/store';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ONBOARDING_STEPS = [
  'Welcome & Business Type',
  'Primary Growth Goal',
  'Connect Social Accounts',
  'AI Profile Analysis',
  'Generate 7-Day Strategy',
  'Review & Schedule Content'
];

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { connectAccount, triggerNotification, addCalendarPost } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  const [businessType, setBusinessType] = useState('Real Estate Developer & Fund');
  const [growthGoal, setGrowthGoal] = useState('High-Net-Worth Lead Generation');
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(['INSTAGRAM', 'LINKEDIN']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleNext = async () => {
    if (currentStep === 3) {
      setIsAnalyzing(true);
      setCurrentStep(4);
      await new Promise(r => setTimeout(r, 1200));
      setIsAnalyzing(false);
      return;
    }

    if (currentStep === 5) {
      // Schedule initial starter week post
      addCalendarPost({
        platform: 'INSTAGRAM',
        contentType: 'REEL',
        title: '7-Day Onboarding Launch Reel',
        caption: 'Why savvy investors are securing prime assets before next quarter. 🏙️ #InvestmentStrategy #RealEstateGrowth',
        scheduledTime: new Date(Date.now() + 86400000).toISOString(),
        status: 'SCHEDULED',
        approvalStatus: 'APPROVED',
        autoMode: 'SEMI_AUTOMATIC',
        aiScore: 95,
        bestTimeReason: 'Auto-slotted into peak 7:30 PM engagement window'
      });
      triggerNotification('MILESTONE', 'Onboarding Complete!', 'Your first week of content has been generated and scheduled.');
      onClose();
      return;
    }

    setCurrentStep(prev => Math.min(ONBOARDING_STEPS.length, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop Layer */}
      <div 
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl my-auto flex flex-col justify-between max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Top Header & Progress Bar */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                Step {currentStep} of {ONBOARDING_STEPS.length}
              </span>
              <span className="text-slate-600">•</span>
              <h3 className="text-sm font-bold text-white">{ONBOARDING_STEPS[currentStep - 1]}</h3>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full bg-slate-800 h-1 rounded-full my-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Contents */}
        <div className="py-4 space-y-4">
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Select Your Organization Type</h4>
                <p className="text-xs text-slate-400">GrowthPilot AI customizes prompts and audience models for your niche.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  'Real Estate Developer & Fund',
                  'Luxury Brokerage & Agents',
                  'B2B Capital & Private Equity',
                  'Digital Growth Agency',
                  'Corporate Executive Brand',
                  'High-Ticket Sales Consultant'
                ].map((type) => (
                  <div
                    key={type}
                    onClick={() => setBusinessType(type)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      businessType === type
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold ring-1 ring-indigo-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{type}</span>
                    {businessType === type && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">What is Your Primary Growth Objective?</h4>
                <p className="text-xs text-slate-400">We optimize your multi-platform content cadence around this metric.</p>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: 'High-Net-Worth Lead Generation', desc: 'Prioritize LinkedIn B2B underwriting and Meta Lead Ads.' },
                  { name: 'Viral Reach & Brand Authority', desc: 'Maximize TikTok 30s video views and Instagram Reels.' },
                  { name: 'Direct Property Sales & Bookings', desc: 'Focus on 1-click consultation scheduling and DM qualification.' },
                  { name: 'Multi-Channel Expat Investor Pipeline', desc: 'Equally balance awareness on TikTok with high conversion on LinkedIn.' }
                ].map((goal) => (
                  <div
                    key={goal.name}
                    onClick={() => setGrowthGoal(goal.name)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      growthGoal === goal.name
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold ring-1 ring-indigo-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{goal.name}</span>
                      {growthGoal === goal.name && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">{goal.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-pink-600/20 border border-pink-500/30 text-pink-400 flex items-center justify-center mx-auto mb-2">
                  <Share2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Connect Your Social Accounts</h4>
                <p className="text-xs text-slate-400">100% password-free OAuth 2.0 PKCE authentication.</p>
              </div>

              <div className="space-y-2 text-xs">
                {(['INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'TIKTOK'] as const).map((platform) => {
                  const isConn = connectedPlatforms.includes(platform);
                  return (
                    <div
                      key={platform}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <PlatformIcon platform={platform} size={20} />
                        <div>
                          <div className="font-bold text-white capitalize">{platform.toLowerCase()}</div>
                          <div className="text-[10px] text-slate-400">{isConn ? 'OAuth Token Encrypted' : 'Not Connected'}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isConn) setConnectedPlatforms(prev => prev.filter(p => p !== platform));
                          else setConnectedPlatforms(prev => [...prev, platform]);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isConn
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isConn ? 'Connected' : 'Connect'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center py-8 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto animate-pulse">
                <Wand2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">AI Diagnostic Engine In Progress</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Analyzing current profile hooks, calculating baseline AI Growth Score, and establishing platform-specific peak activity schedules.
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 fill-current" />
                  <span>AI Strategy Prepared For {businessType}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  • <strong>Growth Score Calculated:</strong> 85/100 baseline established across 9 pillars.<br />
                  • <strong>Publishing Cadence:</strong> 5x IG, 3x FB, 5x LinkedIn, 7x TikTok weekly.<br />
                  • <strong>First Week Queue:</strong> 7 platform-adapted posts generated with verified hooks.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-white">Ready for 1-Click Launch</div>
                <p className="text-[11px] text-slate-400">Click below to approve your initial strategy and queue your starter calendar.</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
          >
            <span>{currentStep === ONBOARDING_STEPS.length - 1 ? 'Launch Growth Engine' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

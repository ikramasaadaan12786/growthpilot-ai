'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Rocket, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Check, 
  Radio,
  Lock
} from 'lucide-react';
import { PlatformIcon } from '@/components/common/PlatformIcon';

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'PRO' | 'BASIC' | 'AGENCY'>('PRO');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleContinue = async () => {
    setIsUpgrading(true);
    // If PRO trial is selected (default), continue directly to private dashboard
    if (selectedPlan === 'PRO') {
      router.push('/social-accounts?onboarding=true');
      return;
    }

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push('/social-accounts?onboarding=true');
      }
    } catch {
      router.push('/social-accounts?onboarding=true');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Onboarding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Step 2 of 2: Activate Growth Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Select your GrowthPilot Plan
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Your private workspace is created. Choose your growth tier or proceed with the included 14-day Pro trial.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Basic Tier */}
          <div 
            onClick={() => setSelectedPlan('BASIC')}
            className={`cursor-pointer rounded-3xl p-6 border transition-all relative space-y-4 ${
              selectedPlan === 'BASIC'
                ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-2xl shadow-indigo-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Growth Basic</div>
              <div className="text-2xl font-black text-white mt-1">$29<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-1">For solo realtors &amp; creators starting multi-channel growth.</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> 3 Connected Channels
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> 100 AI Posts / Month
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> Automated Calendar
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> Lead Ads CRM Pipeline
              </li>
            </ul>
          </div>

          {/* Pro Tier (Popular / Trial Default) */}
          <div 
            onClick={() => setSelectedPlan('PRO')}
            className={`cursor-pointer rounded-3xl p-6 border transition-all relative space-y-4 ${
              selectedPlan === 'PRO'
                ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/50 shadow-2xl shadow-emerald-500/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              14-Day Free Trial Included
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" /> Growth Pro
              </div>
              <div className="text-2xl font-black text-white mt-1">$79<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Full-stack multi-platform video &amp; real estate automation.</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> 10 Connected Channels
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Unlimited AI Generations
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Real Estate Multi-Platform Engine
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Creator Inbox Direct Publishing
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Full Analytics &amp; Growth Score
              </li>
            </ul>
          </div>

          {/* Agency Tier */}
          <div 
            onClick={() => setSelectedPlan('AGENCY')}
            className={`cursor-pointer rounded-3xl p-6 border transition-all relative space-y-4 ${
              selectedPlan === 'AGENCY'
                ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-2xl shadow-indigo-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agency Scale</div>
              <div className="text-2xl font-black text-white mt-1">$199<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-1">For brokerage firms &amp; high-volume social media marketing agencies.</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> Unlimited Channels &amp; Profiles
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> Team Collaboration &amp; Roles
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> White-Label Executive Reports
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> Emergency Kill-Switch &amp; Logs
              </li>
            </ul>
          </div>

        </div>

        {/* Action Button & Disclaimer */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-white">Ready to connect your social media channels?</h3>
            <p className="text-xs text-slate-400">
              {selectedPlan === 'PRO' 
                ? 'Your 14-day free trial will activate automatically. No charge today.' 
                : `Proceed with ${selectedPlan} Tier activation.`}
            </p>
          </div>

          <button
            onClick={handleContinue}
            disabled={isUpgrading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 shrink-0 group"
          >
            <span>{selectedPlan === 'PRO' ? 'Start Free Trial & Connect Accounts' : 'Proceed to Checkout'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Isolation & Security Notice */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Private Data Isolation
            </div>
            <p className="text-[11px] text-slate-400">Your accounts, tokens, and leads are cryptographically isolated in your private tenant.</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" /> AES-256-GCM Vault
            </div>
            <p className="text-[11px] text-slate-400">Tokens are encrypted at rest with PBKDF2 key derivation and never exposed to the client.</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Instant OAuth Sync
            </div>
            <p className="text-[11px] text-slate-400">Connect Instagram, Facebook, LinkedIn, and TikTok via official OAuth 2.0.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

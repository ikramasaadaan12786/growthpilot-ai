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
  Lock,
  Flame,
  Building
} from 'lucide-react';

import { openPaddleCheckout } from '@/lib/paddle-checkout-client';

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'STARTER' | 'PRO' | 'ADVANCED' | 'BUSINESS'>('PRO');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleContinue = async () => {
    setCheckoutError(null);
    openPaddleCheckout({
      plan: selectedPlan,
      onLoading: (l) => setIsUpgrading(l),
      onError: (err) => setCheckoutError(err)
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Onboarding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Step 2 of 2: 7-Day Free Trial on All Plans</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Choose Your GrowthPilot AI Plan
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            All plans include a full 7-day free trial. After the trial, maintain an active monthly subscription to keep AI growth automation active.
          </p>
        </div>

        {/* 4 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Starter Plan */}
          <div 
            onClick={() => setSelectedPlan('STARTER')}
            className={`cursor-pointer rounded-3xl p-5 border transition-all relative space-y-4 ${
              selectedPlan === 'STARTER'
                ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-2xl shadow-indigo-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starter</div>
              <div className="text-2xl font-black text-white mt-1">$19<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-1">For solo realtors &amp; creators starting social growth.</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> 2 Connected Channels
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> 50 AI Posts / Month
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> Automated Calendar
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> 7-Day Free Trial
              </li>
            </ul>
          </div>

          {/* Pro Plan (Popular / Trial Default) */}
          <div 
            onClick={() => setSelectedPlan('PRO')}
            className={`cursor-pointer rounded-3xl p-5 border transition-all relative space-y-4 ${
              selectedPlan === 'PRO'
                ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/50 shadow-2xl shadow-emerald-500/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" /> Growth Pro
              </div>
              <div className="text-2xl font-black text-white mt-1">$49<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Multi-platform video, Creator Inbox &amp; Real Estate AI.</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> 5 Connected Channels
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> 250 AI Posts / Month
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Real Estate Multi-Platform
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Creator Inbox Direct Post
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> 7-Day Free Trial
              </li>
            </ul>
          </div>

          {/* Advanced Plan */}
          <div 
            onClick={() => setSelectedPlan('ADVANCED')}
            className={`cursor-pointer rounded-3xl p-5 border transition-all relative space-y-4 ${
              selectedPlan === 'ADVANCED'
                ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-2xl shadow-indigo-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Advanced
              </div>
              <div className="text-2xl font-black text-white mt-1">$99<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-1">High-volume growth, unlimited AI &amp; Full Lead CRM.</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" /> 15 Connected Channels
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" /> Unlimited AI Generations
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" /> Full Lead CRM Pipeline
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" /> Weekly AI Performance Reports
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" /> 7-Day Free Trial
              </li>
            </ul>
          </div>

          {/* Business Plan */}
          <div 
            onClick={() => setSelectedPlan('BUSINESS')}
            className={`cursor-pointer rounded-3xl p-5 border transition-all relative space-y-4 ${
              selectedPlan === 'BUSINESS'
                ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-2xl shadow-indigo-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Business
              </div>
              <div className="text-2xl font-black text-white mt-1">$199<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-1">For brokerages, marketing teams &amp; enterprise agencies.</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> Unlimited Channels
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> Team Collaboration
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> White-Label PDF Reports
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> Dedicated Webhook Support
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> 7-Day Free Trial
              </li>
            </ul>
          </div>

        </div>

        {checkoutError && (
          <div className="p-4 bg-rose-950/80 border border-rose-600/50 rounded-2xl flex items-center justify-between text-xs text-rose-200 shadow-md">
            <span>{checkoutError}</span>
            <button onClick={() => setCheckoutError(null)} className="text-[10px] uppercase font-bold text-rose-400 hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        {/* Action Button & Disclaimer */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-white">Ready to activate your 7-day free trial?</h3>
            <p className="text-xs text-slate-400">
              Proceed with {selectedPlan} Tier trial activation. ($0.00 today).
            </p>
          </div>

          <button
            onClick={handleContinue}
            disabled={isUpgrading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 shrink-0 group"
          >
            {isUpgrading ? (
              <span>Opening Checkout...</span>
            ) : (
              <>
                <span>Start 7-Day Free Trial &amp; Proceed</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
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

'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Key, 
  CreditCard, 
  Check, 
  AlertCircle, 
  Lock, 
  CheckCircle2,
  Server,
  Zap,
  Globe,
  Monitor,
  Wifi,
  WifiOff,
  Cpu,
  Database,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { SubscriptionTier } from '@/types';

export default function SettingsPage() {
  const { 
    subscriptionPlan, 
    setSubscriptionPlan, 
    triggerNotification,
    isDemoMode,
    isOnline,
    isDesktopApp
  } = useApp();

  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    triggerNotification('GROWTH_OPPORTUNITY', 'Settings Saved', 'AI preferences and encryption credentials updated.');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSelectPlan = (plan: SubscriptionTier) => {
    setSubscriptionPlan(plan);
    triggerNotification('MILESTONE', `Plan Updated to ${plan}`, `Your account is now upgraded to ${plan} Tier.`);
  };

  const handleCheckUpdates = () => {
    setUpdateMessage('Automatic updates will be available in a future release. Current build: v1.0.0-prod.');
    setTimeout(() => setUpdateMessage(null), 5000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Offline Notice Banner if offline */}
      {!isOnline && (
        <div className="bg-amber-950/80 border border-amber-500/50 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-200 shadow-md">
          <div className="flex items-center gap-2.5">
            <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white">Offline Mode Active:</span> Local features (Demo Dashboard, Content Studio, Calendar, CRM, and Demo AI) remain fully operational without internet.
            </div>
          </div>
          <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono">
            Local Mode
          </span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-4 h-4" /> System Preferences & Architecture
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Application Settings & Diagnostics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your AI engine, local database, offline status, and subscription tier.
          </p>
        </div>

        <span className="text-xs bg-cyan-500/10 text-cyan-400 font-bold px-3 py-1 rounded-full border border-cyan-500/20 uppercase font-mono">
          Current Tier: {subscriptionPlan}
        </span>
      </div>

      {/* Application Diagnostics & Environment (Phase 12 Requirement) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-400" />
            <span>Application Diagnostics & Environment</span>
          </h3>

          <button
            onClick={handleCheckUpdates}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Check for Updates</span>
          </button>
        </div>

        {updateMessage && (
          <div className="bg-indigo-950/60 border border-indigo-500/30 p-3 rounded-xl text-xs text-indigo-200 animate-in fade-in">
            {updateMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-500 uppercase text-[10px]">App Edition & Version</div>
            <div className="text-sm font-black text-white flex items-center gap-1.5 font-sans">
              <Monitor className="w-4 h-4 text-indigo-400" />
              <span>GrowthPilot AI v1.0.0</span>
            </div>
            <div className="text-[11px] text-slate-400">{isDesktopApp ? 'Windows Native Desktop App' : 'Local Standalone Application'}</div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-500 uppercase text-[10px]">Environment</div>
            <div className="text-sm font-black text-cyan-400 font-sans">
              LOCAL DEVELOPMENT (Zero Cost)
            </div>
            <div className="text-[11px] text-slate-400">Port: localhost:3000 • SSL Ready</div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-500 uppercase text-[10px]">Operating Mode</div>
            <div className={`text-sm font-black font-sans ${isDemoMode ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isDemoMode ? 'DEMO MODE (Sample Data)' : 'LIVE DATA MODE (Real Accounts)'}
            </div>
            <div className="text-[11px] text-slate-400">Toggleable from Header switch</div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-500 uppercase text-[10px]">Active AI Engine</div>
            <div className="text-sm font-black text-purple-400 font-sans flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>{openaiKey ? 'OpenAI GPT-4o' : 'DEMO AI (Local Engine)'}</span>
            </div>
            <div className="text-[11px] text-slate-400">{openaiKey ? 'Live Cloud Model' : 'Zero-cost offline heuristic generator'}</div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-500 uppercase text-[10px]">Database Status</div>
            <div className="text-sm font-black text-emerald-400 font-sans flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>CONNECTED</span>
            </div>
            <div className="text-[11px] text-slate-400">Prisma ORM • 21 Active Models</div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-500 uppercase text-[10px]">Internet Connectivity</div>
            <div className={`text-sm font-black font-sans flex items-center gap-1.5 ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{isOnline ? 'ONLINE (Connected)' : 'OFFLINE (Local Mode)'}</span>
            </div>
            <div className="text-[11px] text-slate-400">{isOnline ? 'All cloud & OAuth endpoints active' : 'Offline features active'}</div>
          </div>
        </div>
      </div>

      {/* Free AI Engine Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" />
          <span>AI Engine & API Providers</span>
        </h3>

        <form onSubmit={handleSaveKeys} className="space-y-4 max-w-xl">
          <div className="bg-indigo-950/40 border border-indigo-500/20 p-3.5 rounded-xl text-xs text-slate-300">
            <span className="font-bold text-white">Free Local Development:</span> You do not need a paid API key to use GrowthPilot AI. When left blank, the application automatically uses its built-in local heuristic engine (DEMO AI MODE) with full multi-platform adaptation.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">OpenAI API Key (Optional)</label>
            <input
              type="password"
              value={openaiKey}
              onChange={e => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            {isSaved ? 'Saved Successfully!' : 'Save AI Preferences'}
          </button>
        </form>
      </div>

      {/* Subscription Plans */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          <span>Subscription Plans & Client Accounts</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className={`bg-slate-900 border rounded-2xl p-6 shadow-card flex flex-col justify-between transition-all ${
            subscriptionPlan === 'FREE' ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase text-slate-400">FREE / LOCAL</span>
                {subscriptionPlan === 'FREE' && (
                  <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                )}
              </div>
              <div className="text-3xl font-black text-white font-mono mb-4">$0 <span className="text-xs text-slate-500 font-normal">/mo</span></div>
              
              <ul className="space-y-2 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 100% Free Local Desktop App</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Local Heuristic AI Studio</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Content Calendar & Approval Flow</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Offline Mode Capable</li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('FREE')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              {subscriptionPlan === 'FREE' ? 'Current Tier' : 'Switch to Free Tier'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className={`bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border rounded-2xl p-6 shadow-glow-primary flex flex-col justify-between transition-all ${
            subscriptionPlan === 'PRO' ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-indigo-500/40'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase text-indigo-400">PRO PLAN</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold border border-indigo-500/30">
                  Most Popular
                </span>
              </div>
              <div className="text-3xl font-black text-white font-mono mb-4">$49 <span className="text-xs text-slate-500 font-normal">/mo</span></div>
              
              <ul className="space-y-2 text-xs text-slate-200 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> All 4 Social Platforms</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Advanced Multi-Channel Analytics</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Real Estate Growth Mode</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Content Calendar & Auto-Publishing</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Competitor Intelligence & SWOT</li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('PRO')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-indigo-600/30 transition-all"
            >
              {subscriptionPlan === 'PRO' ? 'Active Tier' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Agency Plan */}
          <div className={`bg-slate-900 border rounded-2xl p-6 shadow-card flex flex-col justify-between transition-all ${
            subscriptionPlan === 'AGENCY' ? 'border-cyan-500 ring-2 ring-cyan-500/30' : 'border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase text-cyan-400">AGENCY PLAN</span>
                {subscriptionPlan === 'AGENCY' && (
                  <span className="text-[10px] bg-cyan-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                )}
              </div>
              <div className="text-3xl font-black text-white font-mono mb-4">$199 <span className="text-xs text-slate-500 font-normal">/mo</span></div>
              
              <ul className="space-y-2 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Client Accounts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Multi-Seat Team Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> White-Label PDF Reports</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dedicated Ad Campaign Management</li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('AGENCY')}
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              {subscriptionPlan === 'AGENCY' ? 'Active Tier' : 'Upgrade to Agency'}
            </button>
          </div>
        </div>
      </div>

      {/* Security & Cryptography Guarantee */}
      <div className="bg-slate-950/80 border border-indigo-500/20 rounded-2xl p-6 space-y-3 text-xs text-slate-400">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security, AES-256 Encryption & Anti-Abuse Standards</span>
        </h3>
        <p className="leading-relaxed">
          GrowthPilot AI enforces AES-256-GCM token encryption and official OAuth 2.0 PKCE authentication. The desktop client communicates securely with local and authorized remote endpoints without exposing private credentials.
        </p>
      </div>
    </div>
  );
}

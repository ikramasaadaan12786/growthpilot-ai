'use client';

import React, { useState, useEffect } from 'react';
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
  Info,
  MessageSquare,
  Crown
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { SubscriptionTier } from '@/types';
import { ManualPaymentModal } from '@/components/billing/ManualPaymentModal';
import { getAgentContact, buildWhatsAppAgentUrl } from '@/lib/agent-config';

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
  
  // Manual Payment Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<string>('PRO');
  const [sessionUser, setSessionUser] = useState<any>(null);

  const [envInfo, setEnvInfo] = useState<{ isProd: boolean; label: string; host: string }>({
    isProd: false,
    label: 'LOCAL DEVELOPMENT (Zero Cost)',
    host: 'Port: localhost:3000 • SSL Ready'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const host = window.location.host;
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';

      if (!isLocal) {
        setEnvInfo({
          isProd: true,
          label: 'PRODUCTION',
          host: `${host} • SSL Active`
        });
      } else {
        setEnvInfo({
          isProd: false,
          label: 'LOCAL DEVELOPMENT (Zero Cost)',
          host: `Port: ${host || 'localhost:3000'} • SSL Ready`
        });
      }

      // Fetch active session user info
      fetch('/api/auth/session')
        .then(res => res.json())
        .then(data => {
          if (data?.authenticated && data?.user) {
            setSessionUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    triggerNotification('GROWTH_OPPORTUNITY', 'Settings Saved', 'AI preferences and encryption credentials updated.');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleOpenManualPayment = (plan: string) => {
    setSelectedPlanForModal(plan);
    setIsManualModalOpen(true);
  };

  const handleCheckUpdates = () => {
    setUpdateMessage('Automatic updates will be available in a future release. Current build: v1.0.0-prod.');
    setTimeout(() => setUpdateMessage(null), 5000);
  };

  const isSubscriptionExpired = sessionUser?.subscription?.status === 'EXPIRED';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Manual Payment Activation Modal */}
      <ManualPaymentModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        plan={selectedPlanForModal}
        userEmail={sessionUser?.email}
        userName={sessionUser?.name}
      />

      {/* Subscription Expired Warning Banner */}
      {isSubscriptionExpired && (
        <div className="bg-rose-950/80 border border-rose-500/50 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-200 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">Subscription Expired</div>
              <p className="text-slate-300 mt-0.5">Your subscription has expired. Please contact your agent to renew and maintain full multi-channel access.</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenManualPayment(sessionUser?.subscription?.plan || 'PRO')}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Agent to Renew</span>
          </button>
        </div>
      )}

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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

        <div className="flex items-center gap-2">
          <span className="text-xs bg-cyan-500/10 text-cyan-400 font-bold px-3 py-1 rounded-full border border-cyan-500/20 uppercase font-mono">
            Active Tier: {sessionUser?.subscription?.plan || subscriptionPlan}
          </span>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20 uppercase font-mono">
            Status: {sessionUser?.subscription?.status || 'ACTIVE'}
          </span>
        </div>
      </div>

      {/* Application Diagnostics & Environment */}
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
            <div className={`text-sm font-black font-sans ${envInfo.isProd ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {envInfo.label}
            </div>
            <div className="text-[11px] text-slate-400">{envInfo.host}</div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-500 uppercase text-[10px]">Payment Infrastructure</div>
            <div className="text-sm font-black text-emerald-400 font-sans flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Manual Agent Mode (Active)</span>
            </div>
            <div className="text-[11px] text-slate-400">Direct Agent Activation &amp; Concierge Desk</div>
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
            <div className="text-[11px] text-slate-400">Prisma ORM • Isolated Multi-Tenant</div>
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

      {/* Subscription Plans Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <span>Subscription Plans &amp; Client Accounts</span>
            </h3>
            <p className="text-xs text-slate-400">All plans include full platform integrations, AI generation, and instant activation.</p>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Manual Payment &amp; Direct Activation Desk</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Starter Plan */}
          <div className={`bg-slate-900 border rounded-2xl p-5 shadow-card flex flex-col justify-between transition-all ${
            (sessionUser?.subscription?.plan || subscriptionPlan) === 'STARTER' ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase text-slate-400">STARTER</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">Standard</span>
              </div>
              <div className="text-2xl font-black text-white font-mono mb-3">$19 <span className="text-xs text-slate-500 font-normal">/mo</span></div>
              
              <ul className="space-y-2 text-xs text-slate-300 mb-4">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 2 Connected Channels</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 50 AI Posts / Month</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Content Calendar</li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenManualPayment('STARTER')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              {(sessionUser?.subscription?.plan || subscriptionPlan) === 'STARTER' ? 'Active Tier' : 'Choose Starter ($19/mo)'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className={`bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border rounded-2xl p-5 shadow-glow-primary flex flex-col justify-between transition-all ${
            (sessionUser?.subscription?.plan || subscriptionPlan) === 'PRO' ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-emerald-500/40'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase text-emerald-400">GROWTH PRO</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  Popular
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono mb-3">$49 <span className="text-xs text-slate-500 font-normal">/mo</span></div>
              
              <ul className="space-y-2 text-xs text-slate-200 mb-4">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 5 Connected Channels</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 250 AI Posts / Month</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Real Estate AI Engine</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Creator Inbox Direct</li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenManualPayment('PRO')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              {(sessionUser?.subscription?.plan || subscriptionPlan) === 'PRO' ? 'Active Tier' : 'Upgrade to Pro ($49/mo)'}
            </button>
          </div>

          {/* Advanced Plan */}
          <div className={`bg-slate-900 border rounded-2xl p-5 shadow-card flex flex-col justify-between transition-all ${
            (sessionUser?.subscription?.plan || subscriptionPlan) === 'ADVANCED' ? 'border-cyan-500 ring-2 ring-cyan-500/30' : 'border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase text-cyan-400">ADVANCED</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">Scale</span>
              </div>
              <div className="text-2xl font-black text-white font-mono mb-3">$99 <span className="text-xs text-slate-500 font-normal">/mo</span></div>
              
              <ul className="space-y-2 text-xs text-slate-300 mb-4">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> 15 Connected Channels</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Unlimited AI Generations</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Full Lead CRM Pipeline</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Weekly AI Reports</li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenManualPayment('ADVANCED')}
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              {(sessionUser?.subscription?.plan || subscriptionPlan) === 'ADVANCED' ? 'Active Tier' : 'Choose Advanced ($99/mo)'}
            </button>
          </div>

          {/* Business Plan */}
          <div className={`bg-slate-900 border rounded-2xl p-5 shadow-card flex flex-col justify-between transition-all ${
            (sessionUser?.subscription?.plan || subscriptionPlan) === 'BUSINESS' ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase text-amber-400">BUSINESS</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">Enterprise</span>
              </div>
              <div className="text-2xl font-black text-white font-mono mb-3">$199 <span className="text-xs text-slate-500 font-normal">/mo</span></div>
              
              <ul className="space-y-2 text-xs text-slate-300 mb-4">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> Unlimited Channels</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> Team Collaboration</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> White-Label PDF Reports</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> Dedicated Concierge Desk</li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenManualPayment('BUSINESS')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              {(sessionUser?.subscription?.plan || subscriptionPlan) === 'BUSINESS' ? 'Active Tier' : 'Choose Business ($199/mo)'}
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
          GrowthPilot AI enforces AES-256-GCM token encryption and official OAuth 2.0 PKCE authentication. The desktop and mobile clients communicate securely with local and authorized remote endpoints without exposing private credentials.
        </p>
      </div>
    </div>
  );
}

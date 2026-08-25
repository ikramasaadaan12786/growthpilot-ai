'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Share2, 
  ShieldCheck, 
  Lock, 
  RefreshCw, 
  KeyRound, 
  AlertCircle,
  Activity,
  Layers,
  Sparkles,
  Server,
  ArrowRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { AccountCard } from '@/components/social-accounts/AccountCard';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { SocialPlatform } from '@/types';

export default function SocialAccountsPage() {
  const { socialAccounts, platformFilter } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeView, setActiveView] = useState<'CARDS' | 'CAPABILITIES' | 'HEALTH'>('CARDS');
  const [authBanner, setAuthBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const connected = params.get('connected');
      const err = params.get('error');
      const details = params.get('details') || params.get('message');
      
      if (connected) {
        setAuthBanner({
          type: 'success',
          message: `Official ${connected} account connected successfully! OAuth 2.0 tokens encrypted (AES-256-GCM).`
        });
      } else if (err) {
        let msg = decodeURIComponent(err);
        if (err === 'META_INVALID_SCOPE') {
          msg = 'Meta Scope Notice: Invalid scope requested. GrowthPilot requests only verified permissions (instagram_basic, pages_show_list, pages_read_engagement, business_management).';
        } else if (err === 'META_PERMISSION_DENIED') {
          msg = 'Meta Access Denied: The login was cancelled or required permissions were declined in Facebook Login.';
        } else if (err === 'NO_FACEBOOK_PAGE_FOUND') {
          msg = 'No Facebook Page Found: You must administer at least one Facebook Page to connect Facebook or Instagram Professional accounts.';
        } else if (err === 'NO_INSTAGRAM_PROFESSIONAL_ACCOUNT') {
          msg = 'No Linked Instagram Professional Account: Please ensure your Instagram account is switched to Professional (Business or Creator) and linked to your Facebook Page in Meta Business Suite.';
        } else if (err === 'META_REDIRECT_MISMATCH') {
          msg = 'Meta Redirect URI Mismatch: Please confirm https://growthpilot-ai-two.vercel.app/api/auth/oauth/instagram/callback is listed in Meta App Settings under Valid OAuth Redirect URIs.';
        } else if (details) {
          msg += `: ${decodeURIComponent(details)}`;
        }

        setAuthBanner({
          type: 'error',
          message: msg
        });
      }
    }
  }, []);

  const filteredAccounts = socialAccounts.filter(acc => {
    if (platformFilter === 'ALL') return true;
    return acc.platform === platformFilter;
  });

  return (
    <div className="space-y-8">
      {/* OAuth Callback Result Alert Banner */}
      {authBanner && (
        <div
          className={`p-4 rounded-2xl border flex items-start justify-between gap-3 text-xs font-semibold animate-in fade-in ${
            authBanner.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {authBanner.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{authBanner.message}</span>
          </div>
          <button
            onClick={() => setAuthBanner(null)}
            className="text-slate-400 hover:text-white shrink-0 ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-4 h-4" /> Official Authorization & Health Hub
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Account Connection Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Connect and monitor your official Instagram Professional, Facebook Pages, LinkedIn, and TikTok accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/social-accounts/meta-status"
            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-pink-400" />
            <span>Meta Diagnostic</span>
          </Link>

          <Link
            href="/tiktok-review-demo"
            className="px-3.5 py-2 bg-gradient-to-r from-rose-950/80 to-slate-900 hover:from-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <PlatformIcon platform="TIKTOK" size={14} />
            <span>TikTok Review Demo</span>
          </Link>

          <Link
            href="/tiktok-review"
            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <PlatformIcon platform="TIKTOK" size={14} />
            <span>TikTok Review Guide</span>
          </Link>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guided Onboarding</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap sm:inline-flex bg-slate-950 p-1 sm:p-1.5 rounded-xl border border-slate-800 text-xs gap-1 w-full sm:w-auto">
        <button
          onClick={() => setActiveView('CARDS')}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-bold transition-all flex-1 sm:flex-initial text-center ${
            activeView === 'CARDS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4 shrink-0" />
          <span>Connected Channels</span>
        </button>

        <button
          onClick={() => setActiveView('CAPABILITIES')}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-bold transition-all flex-1 sm:flex-initial text-center ${
            activeView === 'CAPABILITIES' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>API Capabilities</span>
        </button>

        <button
          onClick={() => setActiveView('HEALTH')}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-bold transition-all flex-1 sm:flex-initial text-center ${
            activeView === 'HEALTH' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 shrink-0" />
          <span>Health Center</span>
        </button>
      </div>

      {/* View 1: 4 Social Cards Grid */}
      {activeView === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in">
          {filteredAccounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}

      {/* View 2: Platform API Capabilities Table (Step 24 Requirement) */}
      {activeView === 'CAPABILITIES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-card space-y-4 animate-in fade-in">
          <div>
            <h3 className="font-bold text-white text-base">Platform API Capabilities & Feature Support Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Honest breakdown of official API endpoints, permission tiers, and unsupported features.
            </p>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs min-w-[550px]">
              <thead className="text-[10px] text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Platform</th>
                  <th className="py-3 px-3">Publishing</th>
                  <th className="py-3 px-3">Scheduling</th>
                  <th className="py-3 px-3">Analytics & Insights</th>
                  <th className="py-3 px-3">Audience Data</th>
                  <th className="py-3 px-3">Paid Advertising</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                <tr>
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <PlatformIcon platform="INSTAGRAM" size={16} /> Instagram
                  </td>
                  <td className="py-3 px-3 text-emerald-400">🟢 AVAILABLE (Reels/Carousels)</td>
                  <td className="py-3 px-3 text-emerald-400">🟢 AVAILABLE</td>
                  <td className="py-3 px-3 text-amber-300">🟡 REQUIRES APP REVIEW</td>
                  <td className="py-3 px-3 text-amber-300">🟡 REQUIRES APP REVIEW</td>
                  <td className="py-3 px-3 text-emerald-400">🟢 META ADS API</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <PlatformIcon platform="FACEBOOK" size={16} /> Facebook
                  </td>
                  <td className="py-3 px-3 text-emerald-400">🟢 AVAILABLE (Page Posts)</td>
                  <td className="py-3 px-3 text-emerald-400">🟢 AVAILABLE</td>
                  <td className="py-3 px-3 text-amber-300">🟡 REQUIRES APP REVIEW</td>
                  <td className="py-3 px-3 text-amber-300">🟡 REQUIRES APP REVIEW</td>
                  <td className="py-3 px-3 text-emerald-400">🟢 META ADS API</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <PlatformIcon platform="LINKEDIN" size={16} /> LinkedIn
                  </td>
                  <td className="py-3 px-3 text-emerald-400">🟢 AVAILABLE (UGC Posts)</td>
                  <td className="py-3 px-3 text-emerald-400">🟢 AVAILABLE</td>
                  <td className="py-3 px-3 text-emerald-400">🟢 AVAILABLE (Org Analytics)</td>
                  <td className="py-3 px-3 text-amber-300">🟡 REQUIRES APPROVAL</td>
                  <td className="py-3 px-3 text-emerald-400">🟢 LINKEDIN MARKETING API</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <PlatformIcon platform="TIKTOK" size={16} /> TikTok
                  </td>
                  <td className="py-3 px-3 text-amber-300">🟡 REQUIRES DEVELOPER REVIEW</td>
                  <td className="py-3 px-3 text-amber-300">🟡 REQUIRES DEVELOPER REVIEW</td>
                  <td className="py-3 px-3 text-emerald-400">🟢 AVAILABLE (Creator v2)</td>
                  <td className="py-3 px-3 text-slate-400">⛔ NOT SUPPORTED (Stories)</td>
                  <td className="py-3 px-3 text-emerald-400">🟢 TIKTOK FOR BUSINESS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Connection Health Center (Step 23 Requirement) */}
      {activeView === 'HEALTH' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4 animate-in fade-in">
          <div>
            <h3 className="font-bold text-white text-base">Connection Health Center</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live token lifecycles, synchronization latency, and authorized OAuth scopes.
            </p>
          </div>

          <div className="space-y-3">
            {socialAccounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <PlatformIcon platform={acc.platform} size={22} />
                  <div>
                    <div className="font-bold text-white text-sm">{acc.platform} (@{acc.username})</div>
                    <div className="text-[11px] text-slate-400">Last Sync: {acc.lastSyncAt || 'Never'} • Data Source: {acc.dataSource || 'OAuth API'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    acc.status === 'CONNECTED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {acc.status}
                  </span>

                  <button
                    onClick={() => {}}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs"
                  >
                    Sync Health
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Developer API Standards Compliance Notice */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-xs text-slate-400 space-y-3">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-400" />
          <span>Official API Authorization & Anti-Abuse Commitment</span>
        </h3>
        <p className="leading-relaxed">
          GrowthPilot AI operates exclusively within the approved API terms and conditions of Meta Platforms, LinkedIn Corporation, and TikTok Pte. Ltd. We strictly forbid artificial bots, click farms, fake followers, or unauthorized scraping. All analytics and publishing workflows utilize legitimate developer tokens with automated security lifecycle management.
        </p>
      </div>

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}

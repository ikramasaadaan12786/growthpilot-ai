'use client';

import React, { useState } from 'react';
import { SocialAccountData, SocialPlatform } from '@/types';
import { PlatformIcon } from '../common/PlatformIcon';
import { 
  RefreshCw, 
  Unlink, 
  Link2, 
  ShieldCheck, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Lock,
  Server,
  Key
} from 'lucide-react';
import { OAuthModal } from './OAuthModal';
import { useApp } from '@/lib/store';

interface AccountCardProps {
  account: SocialAccountData;
}

export function AccountCard({ account }: AccountCardProps) {
  const { disconnectAccount, refreshAccountData, connectAccount } = useApp();
  const [isOAuthOpen, setIsOAuthOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [showScopes, setShowScopes] = useState(false);

  const isConnected = account.status === 'CONNECTED' || account.status === 'REAL_CONNECTED' || account.status === 'DEMO_CONNECTED';
  const isTokenExpired = account.status === 'TOKEN_EXPIRED';
  const isDemo = account.status === 'DEMO_CONNECTED';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch(`/api/social/${account.platform.toLowerCase()}/refresh`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncFeedback(data.lastSyncAt ? `Updated ${data.lastSyncAt}` : 'Updated just now');
      } else {
        setSyncFeedback(data.error || 'Sync warning');
      }
    } catch (e: any) {
      setSyncFeedback('API Throttled / Offline');
    }
    await refreshAccountData(account.platform);
    setIsRefreshing(false);
  };

  const handleDisconnect = async () => {
    try {
      await fetch(`/api/social/${account.platform.toLowerCase()}/disconnect`, { method: 'POST' });
    } catch (e) {}
    disconnectAccount(account.platform);
  };

  const getPlatformHeaderStyle = () => {
    switch (account.platform) {
      case 'INSTAGRAM':
        return 'from-pink-600/20 via-slate-900 to-slate-900 border-pink-500/30';
      case 'FACEBOOK':
        return 'from-blue-600/20 via-slate-900 to-slate-900 border-blue-500/30';
      case 'LINKEDIN':
        return 'from-sky-600/20 via-slate-900 to-slate-900 border-sky-500/30';
      case 'TIKTOK':
        return 'from-slate-800/40 via-slate-900 to-slate-900 border-slate-700/50';
    }
  };

  const getDataSource = () => {
    switch (account.platform) {
      case 'INSTAGRAM': return 'Meta Graph API v20.0';
      case 'FACEBOOK': return 'Meta Pages API v20.0';
      case 'LINKEDIN': return 'LinkedIn UGC & Marketing API';
      case 'TIKTOK': return 'TikTok Content Posting API v2';
    }
  };

  return (
    <div className={`bg-gradient-to-b ${getPlatformHeaderStyle()} border rounded-2xl p-6 shadow-card flex flex-col justify-between relative`}>
      <div>
        {/* Top bar: Platform Icon, Status & Sync */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-md">
              <PlatformIcon platform={account.platform} size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-base leading-tight">{account.platform}</h3>
                {isDemo && (
                  <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded">
                    DEMO
                  </span>
                )}
                {account.status === 'REAL_CONNECTED' && (
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded">
                    REAL
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Server className="w-3 h-3 text-cyan-400" />
                {getDataSource()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border ${
                isConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : account.status === 'LIMITED_PERMISSIONS'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : account.status === 'TOKEN_EXPIRED'
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              {account.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 mb-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={account.avatarUrl}
              alt={account.accountName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-white text-sm truncate">{account.accountName}</h4>
            <p className="text-xs text-slate-400 font-mono truncate">{account.username}</p>
            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
              <span>Last synced:</span>
              <span className="text-slate-400 font-medium">{syncFeedback || account.lastSyncAt}</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mb-5 text-center">
          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Followers</div>
            <div className="text-sm font-black text-white font-mono mt-0.5">
              {account.followerCount > 0 ? account.followerCount.toLocaleString() : 'N/A'}
            </div>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Growth Rate</div>
            <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
              {account.followerCount > 0 ? `+${account.growthPercentage}%` : 'N/A'}
            </div>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">AI Score</div>
            <div className="text-sm font-black text-indigo-400 font-mono mt-0.5">
              {account.growthScore > 0 ? `${account.growthScore}/100` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Security & Scopes pill */}
        <div className="mb-5 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> OAuth 2.0 (AES-256-GCM Vault)
          </span>
          <button
            onClick={() => setShowScopes(!showScopes)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
          >
            {showScopes ? 'Hide Scopes' : 'View Scopes'}
          </button>
        </div>

        {showScopes && (
          <div className="mb-5 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1.5 animate-in fade-in">
            <div className="font-bold text-slate-300">Authorized Official API Scopes:</div>
            <div className="flex flex-wrap gap-1">
              {account.officialScopes.length > 0 ? (
                account.officialScopes.map((scope, idx) => (
                  <span key={idx} className="bg-slate-900 text-slate-400 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-800">
                    {scope}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic text-[10px]">Scopes pending authorization</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
        {isConnected ? (
          <>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Live Data'}</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
              title="Revoke access token"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </>
        ) : isTokenExpired ? (
          <button
            onClick={() => setIsOAuthOpen(true)}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-600/30 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reconnect Account (Token Expired)</span>
          </button>
        ) : (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={() => setIsOAuthOpen(true)}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Link2 className="w-4 h-4" />
              <span>CONNECT ACCOUNT</span>
            </button>
          </div>
        )}
      </div>

      <OAuthModal
        platform={account.platform}
        isOpen={isOAuthOpen}
        onClose={() => setIsOAuthOpen(false)}
        onSuccess={() => connectAccount(account.platform)}
      />
    </div>
  );
}

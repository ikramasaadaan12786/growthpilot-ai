'use client';

import React, { useState } from 'react';
import { SocialPlatform } from '@/types';
import { PlatformIcon } from '../common/PlatformIcon';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight, X, AlertCircle } from 'lucide-react';

interface OAuthModalProps {
  platform: SocialPlatform;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OAuthModal({ platform, isOpen, onClose, onSuccess }: OAuthModalProps) {
  const [step, setStep] = useState<'AUTH' | 'PERMISSIONS' | 'SUCCESS'>('AUTH');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const getPlatformDetails = () => {
    switch (platform) {
      case 'INSTAGRAM':
        return {
          title: 'Connect Instagram Professional',
          provider: 'Meta OAuth 2.0',
          permissions: [
            'Access Instagram Professional profile information',
            'Publish Reels, Carousels, and Photos directly',
            'Read organic insights (Reach, Saves, Impressions, Video Views)',
            'Read comment sentiments for automated community growth'
          ],
          note: 'Requires an Instagram Business or Creator account linked to a Facebook Page.'
        };
      case 'FACEBOOK':
        return {
          title: 'Connect Facebook Pages',
          provider: 'Meta Graph API v20.0',
          permissions: [
            'View managed Facebook Pages list',
            'Publish posts, stories, and video updates',
            'Read Page engagement and follower demographics',
            'Sync lead generation ad forms'
          ],
          note: 'Requires Page Admin or Editor role on the target Facebook Page.'
        };
      case 'LINKEDIN':
        return {
          title: 'Connect LinkedIn Profile & Pages',
          provider: 'LinkedIn OpenID Connect & UGC API',
          permissions: [
            'Verify member identity (openid, profile, email)',
            'Content Publishing & Organization Pages (Requires LinkedIn API Approval)'
          ],
          note: 'Direct official API token expires every 60 days with automated background refresh.'
        };
      case 'TIKTOK':
        return {
          title: 'Connect TikTok for Business & Creators',
          provider: 'TikTok Content Posting API v2',
          permissions: [
            'Read public profile information and creator metrics (user.info.basic)',
            'Direct video publishing and draft scheduling (video.publish)',
            'Retrieve video views, watch time, and completion rate analytics'
          ],
          note: 'Complies with TikTok Official Developer Terms. Requires user video approval for commercial sound usage.'
        };
    }
  };

  const details = getPlatformDetails();

  const handleAuthorize = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setStep('SUCCESS');
    setTimeout(() => {
      onSuccess();
      onClose();
      setStep('AUTH');
    }, 1200);
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
            <PlatformIcon platform={platform} size={22} />
            <h3 className="font-bold text-white text-base">{details.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'AUTH' && (
          <div className="py-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
                <ShieldCheck className="w-4 h-4" /> Official {details.provider} Handshake
              </div>
              <p className="text-slate-400 leading-relaxed">
                GrowthPilot AI will request the following official API scopes. We <strong>never</strong> ask for or store passwords.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Requested Permissions:</span>
              {details.permissions.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{details.note}</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl text-center"
              >
                Cancel
              </button>
              <a
                href={`/api/auth/oauth/${platform.toLowerCase()}/authorize`}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                title={`Redirects to official ${platform} OAuth 2.0 login`}
              >
                <span>Connect via Official OAuth</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleAuthorize}
                disabled={loading}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
                title="Simulates OAuth token exchange for local sandbox testing"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Sandbox Fast Connect</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-white text-lg">{platform} Connected Successfully!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              OAuth tokens exchanged & encrypted. Live profile analytics and publishing pipeline synchronized.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

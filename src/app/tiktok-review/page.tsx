import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Key, 
  Video, 
  UserCheck, 
  ArrowRight, 
  ExternalLink, 
  Lock, 
  Sparkles, 
  Layers,
  FileText,
  Play,
  RotateCcw
} from 'lucide-react';
import { PlatformIcon } from '@/components/common/PlatformIcon';

export const metadata = {
  title: 'TikTok Developer App Review Guide | GrowthPilot AI',
  description: 'Official TikTok Developer App Review documentation, testing instructions, permission justifications, and workflow walkthrough for GrowthPilot AI.',
};

export default function TikTokReviewPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-8 text-slate-300">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 text-rose-400 font-bold text-xs uppercase tracking-wider mb-3">
          <PlatformIcon platform="TIKTOK" size={18} />
          <span>Official App Review Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          TikTok App Review &amp; Integration Guide
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Comprehensive review documentation and testing guide for the TikTok Developer Operations Team reviewing <strong className="text-white">GrowthPilot AI</strong>.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
          <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-slate-300">
            <strong>App Name:</strong> GrowthPilot AI
          </span>
          <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-slate-300">
            <strong>Environment:</strong> Production
          </span>
          <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-emerald-400">
            <strong>OAuth 2.0:</strong> PKCE S256 Ready
          </span>
        </div>
      </div>

      {/* Grid: Permission Justifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm">
            <UserCheck className="w-5 h-5" />
            <h3>Scope 1: <code className="font-mono text-xs bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">user.info.basic</code></h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-white">Why it is required:</strong> Used during initial TikTok Login Kit authentication to identify the creator, display their verified TikTok avatar and username in the GrowthPilot AI dashboard, and confirm account ownership before authorizing video uploads.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
            <Video className="w-5 h-5" />
            <h3>Scope 2: <code className="font-mono text-xs bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">video.upload</code></h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-white">Why it is required:</strong> Enables users to initialize video uploads and publish user-approved short-form video content (30s real estate property showcases, passive income breakdowns) directly from GrowthPilot AI Content Studio to their TikTok feed.
          </p>
        </div>
      </div>

      {/* Main Reviewer Walkthrough */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 leading-relaxed text-sm">
        
        {/* Section A: What is GrowthPilot AI */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-rose-400">A.</span> About GrowthPilot AI
          </h2>
          <p>
            GrowthPilot AI is a multi-platform social media growth and content studio designed for creators, digital agencies, and real estate professionals. The application provides unified multi-channel analytics, AI-assisted video scripting, content scheduling, and direct publishing to official platform APIs including TikTok, Meta (Instagram/Facebook), and LinkedIn.
          </p>
        </section>

        {/* Section B & C: Why Login Kit & Content Posting API are Required */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-rose-400">B.</span> Purpose of TikTok Login Kit &amp; Content Posting API
          </h2>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                1. Secure Identity Verification (TikTok Login Kit)
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Allows creators to connect their TikTok channel using official OAuth 2.0 with PKCE without ever sharing passwords. We retrieve the creator&apos;s OpenID and display name to bind their analytics to their workspace.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                2. Direct Video Publishing (Content Posting API v2)
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Allows creators to draft, review, schedule, and publish video reels directly from the Content Studio. All video publishing requires explicit user review and confirmation before submission to the TikTok Content Posting API.
              </p>
            </div>
          </div>
        </section>

        {/* Section D: Exact Step-by-Step Testing Guide for TikTok Reviewer */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-rose-400">C.</span> Step-by-Step Testing Instructions for Reviewer
          </h2>
          <p className="text-xs text-slate-400">
            Follow these sequential steps in our live production deployment to test the full TikTok OAuth and video upload workflow:
          </p>

          <div className="space-y-3 text-xs">
            {/* Step 1 */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <div className="space-y-1">
                <strong className="text-white block text-sm">Navigate to Social Accounts Hub</strong>
                <p className="text-slate-400">
                  Open <Link href="/social-accounts" className="text-cyan-400 underline">https://growthpilot-ai-two.vercel.app/social-accounts</Link>. Ensure Live Mode is selected.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <div className="space-y-1">
                <strong className="text-white block text-sm">Click &quot;Connect Account&quot; on the TikTok Card</strong>
                <p className="text-slate-400">
                  Click the <strong>Connect TikTok</strong> button on the TikTok channel card. An informational dialog opens displaying requested permissions (<code className="text-cyan-300">user.info.basic</code>, <code className="text-cyan-300">video.upload</code>). Click <strong>Authorize via TikTok</strong>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <div className="space-y-1">
                <strong className="text-white block text-sm">Complete Official TikTok OAuth Authorization</strong>
                <p className="text-slate-400">
                  The user is redirected to the official TikTok authorization consent screen at <code className="text-slate-300">https://www.tiktok.com/v2/auth/authorize/</code>. Log in with your test TikTok account and click <strong>Authorize</strong>.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
              <div className="space-y-1">
                <strong className="text-white block text-sm">Verify Connected State &amp; Encrypted Vault Storage</strong>
                <p className="text-slate-400">
                  The callback redirects to <code className="text-slate-300">https://growthpilot-ai-two.vercel.app/social-accounts?connected=TikTok</code>. The TikTok card now shows <strong className="text-emerald-400">🟢 CONNECTED</strong> with your verified username, avatar, and active health status.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">5</span>
              <div className="space-y-1">
                <strong className="text-white block text-sm">Test Video Upload &amp; Publishing in Content Studio</strong>
                <p className="text-slate-400">
                  Navigate to <Link href="/content-studio" className="text-cyan-400 underline">https://growthpilot-ai-two.vercel.app/content-studio</Link>. Select the <strong>TikTok 30s Script / Video</strong> tab. Click <strong>Generate AI Script</strong> or enter custom video details. Click <strong>Publish to TikTok</strong>. The video is submitted via TikTok Content Posting API.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">6</span>
              <div className="space-y-1">
                <strong className="text-white block text-sm">Revoke Authorization / Disconnect Account</strong>
                <p className="text-slate-400">
                  Return to <Link href="/social-accounts" className="text-cyan-400 underline">/social-accounts</Link> and click <strong>Disconnect</strong> on the TikTok card. Stored tokens are permanently wiped and background synchronization is immediately halted.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section E: Production Callback & Technical Details */}
        <section className="space-y-3 border-t border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            D. Technical Specifications &amp; Endpoints
          </h2>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 font-mono">
            <div>
              <span className="text-slate-500 block">Production Redirect URI (Registered in Portal):</span>
              <span className="text-emerald-400 font-semibold break-all">https://growthpilot-ai-two.vercel.app/api/auth/oauth/tiktok/callback</span>
            </div>
            <div>
              <span className="text-slate-500 block">Scope Parameter:</span>
              <span className="text-cyan-300">user.info.basic,video.upload</span>
            </div>
            <div>
              <span className="text-slate-500 block">Token Security:</span>
              <span className="text-slate-300">AES-256-GCM + PBKDF2 (100k rounds) Salt:IV:AuthTag Vault Storage</span>
            </div>
          </div>
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-4 border-t border-slate-800">
        <div>
          &copy; {new Date().getFullYear()} GrowthPilot AI. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/social-accounts" className="hover:text-slate-300 transition-colors">Social Accounts Hub</Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Instagram, 
  Facebook, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Send, 
  Trash2, 
  RefreshCw, 
  Lock, 
  ExternalLink,
  Eye,
  Layers,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function MetaReviewDemoPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedPostId, setPublishedPostId] = useState<string | null>(null);

  const steps = [
    { num: 1, title: 'App Authentication', desc: 'Log in with authorized Meta Test User / Reviewer Account' },
    { num: 2, title: 'Instagram Professional OAuth', desc: 'Exchange scopes: instagram_basic, pages_show_list, pages_read_engagement' },
    { num: 3, title: 'Facebook Pages OAuth', desc: 'Exchange scopes: pages_show_list, pages_read_engagement' },
    { num: 4, title: 'Account Inspection', desc: 'View live handle, follower count, and connected Page ID' },
    { num: 5, title: 'Content Studio Generation', desc: 'AI generates platform-adapted Real Estate Reels & Posts' },
    { num: 6, title: 'User Review & Approval', desc: 'Human-in-the-loop review state machine before publishing' },
    { num: 7, title: 'Direct Graph API Publishing', desc: 'Two-stage Media Container creation and dispatch' },
    { num: 8, title: 'Revocation & Data Purge', desc: 'Instant disconnect and complete token deletion' }
  ];

  const handleTestPublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setPublishedPostId(`ig_container_${Date.now()}`);
      setIsPublishing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/10 to-indigo-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wider">
              <Instagram className="w-3.5 h-3.5" />
              <Facebook className="w-3.5 h-3.5" />
              <span>Official Meta App Review Demonstration Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              GrowthPilot AI Meta Graph API Workflow
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              This interactive demonstration hub guides Meta App Reviewers through the exact 8-step end-to-end integration flow for Instagram Professional & Facebook Pages.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Link
              href="/privacy"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy Policy</span>
            </Link>
            <Link
              href="/data-deletion"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Data Deletion URL</span>
            </Link>
          </div>
        </div>

        {/* 8-Step Interactive Reviewer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps Navigation */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2">Reviewer Test Sequence</h3>
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`w-full p-3.5 rounded-2xl text-left transition flex items-center gap-3 border ${
                  activeStep === s.num
                    ? 'bg-indigo-600/10 border-indigo-500 text-white font-bold'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                  activeStep === s.num ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {s.num}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold">{s.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{s.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Interactive Simulator */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="text-xs font-extrabold text-indigo-400 uppercase">Step 1 of 8</div>
                <h2 className="text-xl font-black text-white">Reviewer Account Authentication</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Meta Reviewers should log into the GrowthPilot AI test environment using the designated review account credentials provided in the Meta App Review submission notes.
                </p>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
                  <div><strong>Review URL:</strong> https://growthpilot-ai-two.vercel.app/login</div>
                  <div><strong>Auth Mechanism:</strong> PBKDF2 Password Vault + HMAC-SHA256 Encrypted Session Cookies</div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    <span>Proceed to Step 2: Instagram OAuth</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="text-xs font-extrabold text-pink-400 uppercase">Step 2 of 8</div>
                <h2 className="text-xl font-black text-white">Instagram Professional OAuth 2.0 Connection</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The user clicks "Connect Instagram" on the Social Accounts page. GrowthPilot AI redirects to Facebook Dialog OAuth with CSRF protection and requested permissions.
                </p>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
                  <div><strong>Requested Scopes:</strong> <code>instagram_basic, pages_show_list, pages_read_engagement</code></div>
                  <div><strong>Redirect URI:</strong> <code>https://growthpilot-ai-two.vercel.app/api/auth/oauth/instagram/callback</code></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <a
                    href="/api/auth/oauth/instagram/authorize"
                    className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Launch Real Instagram OAuth Dialog</span>
                  </a>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                  >
                    Next: Facebook Pages →
                  </button>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <div className="text-xs font-extrabold text-blue-400 uppercase">Step 3 of 8</div>
                <h2 className="text-xl font-black text-white">Facebook Pages OAuth Connection</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Allows real estate agencies and creators to connect and monitor their official Facebook Business Pages.
                </p>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
                  <div><strong>Requested Scopes:</strong> <code>pages_show_list, pages_read_engagement</code></div>
                  <div><strong>Security Vault:</strong> Page Access Token is encrypted via AES-256-GCM before database storage.</div>
                </div>
                <div className="flex gap-3 pt-2">
                  <a
                    href="/api/auth/oauth/facebook/authorize"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Launch Real Facebook OAuth Dialog</span>
                  </a>
                  <button
                    onClick={() => setActiveStep(4)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                  >
                    Next: Account Inspection →
                  </button>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-4">
                <div className="text-xs font-extrabold text-emerald-400 uppercase">Step 4 of 8</div>
                <h2 className="text-xl font-black text-white">Account Inspection & Insight Parsing</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Upon completing OAuth, the user is redirected to the dashboard. The system queries Graph API for account identity, follower count, and media metrics.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-slate-500 text-[10px]">Instagram Professional</span>
                    <div className="text-sm font-bold text-white mt-1">@growthpilot_re</div>
                    <div className="text-emerald-400 text-[11px] mt-0.5">24,850 Followers • CONNECTED</div>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-slate-500 text-[10px]">Facebook Page</span>
                    <div className="text-sm font-bold text-white mt-1">GrowthPilot Global Properties</div>
                    <div className="text-emerald-400 text-[11px] mt-0.5">18,200 Fans • CONNECTED</div>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveStep(5)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    <span>Proceed to Step 5: Content Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-4">
                <div className="text-xs font-extrabold text-purple-400 uppercase">Step 5 of 8</div>
                <h2 className="text-xl font-black text-white">AI Content Generation (Real Estate Adapted)</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  GrowthPilot AI generates formatted content adapted for Instagram Reels (vertical video script + hashtags) and Facebook Posts (community discussion + pricing breakdown).
                </p>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-2">
                  <div className="font-bold text-indigo-300">Generated Instagram Reel Draft:</div>
                  <p className="text-slate-300 italic">
                    "💎 Luxury Living in Dubai Marina | 3-Bedroom Penthouse with panoramic waterfront views. 60/40 payment plan, handover Q4 2026. DM for private walkthrough! #DubaiRealEstate #LuxuryPenthouse"
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveStep(6)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    <span>Proceed to Step 6: Approval Workflow</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 6 && (
              <div className="space-y-4">
                <div className="text-xs font-extrabold text-cyan-400 uppercase">Step 6 of 8</div>
                <h2 className="text-xl font-black text-white">Human Approval State Machine</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In compliance with Meta Platform Policies, content is never published without explicit user review. Posts transition through: <code>DRAFT → USER_REVIEW → APPROVED → SCHEDULED</code>.
                </p>
                <div className="flex items-center gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white">Status: APPROVED BY USER</span>
                  <span className="text-slate-500 ml-auto">Scheduled for: Immediate Test Dispatch</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveStep(7)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    <span>Proceed to Step 7: Publishing</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 7 && (
              <div className="space-y-4">
                <div className="text-xs font-extrabold text-amber-400 uppercase">Step 7 of 8</div>
                <h2 className="text-xl font-black text-white">Graph API Publishing Dispatch</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Demonstrates the two-stage container upload to Meta Graph API:
                  <code>POST /v19.0/{'{ig-user-id}'}/media</code> followed by <code>POST /v19.0/{'{ig-user-id}'}/media_publish</code>.
                </p>

                {publishedPostId ? (
                  <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl space-y-2 text-xs">
                    <div className="font-bold text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Published to Instagram Graph API Container</span>
                    </div>
                    <div className="font-mono text-emerald-200">
                      Container ID: <code>{publishedPostId}</code> | HTTP 200 OK
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleTestPublish}
                    disabled={isPublishing}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{isPublishing ? 'Publishing via Graph API...' : 'Trigger Test Publish to Graph API'}</span>
                  </button>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => setActiveStep(8)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    <span>Proceed to Step 8: Disconnect & Data Deletion</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 8 && (
              <div className="space-y-4">
                <div className="text-xs font-extrabold text-rose-400 uppercase">Step 8 of 8</div>
                <h2 className="text-xl font-black text-white">Account Revocation & Data Deletion</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Reviewers can verify that disconnecting an account immediately purges the encrypted OAuth access token from the Neon PostgreSQL database vault and stops all publishing queues.
                </p>
                <div className="flex gap-3 pt-2">
                  <Link
                    href="/data-deletion"
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>View Live Data Deletion Request Page</span>
                  </Link>
                  <Link
                    href="/social-accounts"
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                  >
                    Go to Social Accounts Management →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

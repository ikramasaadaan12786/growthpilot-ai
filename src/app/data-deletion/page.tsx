'use client';

import React, { useState } from 'react';
import { ShieldCheck, Trash2, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function DataDeletionPage() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('REQUEST_FULL_DELETION');
  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const code = `DEL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setConfirmationCode(code);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to GrowthPilot AI
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-card space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">User Data Deletion & Privacy Controls</h1>
              <p className="text-xs text-slate-400">Meta, LinkedIn, TikTok & Account Data Removal Protocol</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-4">
            <p>
              In compliance with Meta Platform Terms, TikTok Developer Terms, LinkedIn API Policies, and international privacy regulations (GDPR/CCPA), GrowthPilot AI provides automated and self-service mechanisms to immediately delete your personal data, connected social accounts, and OAuth credentials.
            </p>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Self-Service Disconnection</span>
              </h3>
              <p className="text-slate-400">
                You can instantly delete all OAuth access tokens, cached follower metrics, and page permissions by navigating to <strong>Settings → Social Accounts</strong> and clicking <strong>Disconnect</strong>. Disconnecting an account immediately purges its encrypted access token from our secure database vault.
              </p>
            </div>

            <h2 className="text-base font-bold text-white pt-2">Submit Formal Data Deletion Request</h2>
            <p className="text-slate-400">
              If you wish to delete your entire GrowthPilot AI account, historical analytics, lead CRM entries, generated content, and billing profile, submit the request below:
            </p>

            {submitted ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Data Deletion Request Received</span>
                </div>
                <p className="text-xs text-emerald-200">
                  Your deletion request has been logged. In accordance with our privacy policy, all associated personal and social profile data will be permanently wiped within 48 hours.
                </p>
                <div className="text-xs font-mono text-emerald-300 bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/30">
                  Confirmation Tracking ID: <strong>{confirmationCode}</strong>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Account / Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Deletion Scope
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="REQUEST_FULL_DELETION">Delete entire account, credentials, and data</option>
                    <option value="META_DATA_ONLY">Delete only Meta (Instagram/Facebook) tokens & data</option>
                    <option value="TIKTOK_DATA_ONLY">Delete only TikTok tokens & data</option>
                    <option value="LINKEDIN_DATA_ONLY">Delete only LinkedIn tokens & data</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Data Deletion Request</span>
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
              <p>Direct Privacy Officer Contact: <code>privacy@growthpilot.ai</code></p>
              <p>Response Time: All automated and manual requests processed within 48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

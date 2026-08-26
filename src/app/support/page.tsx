'use client';

import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Bug, Mail, CheckCircle2, ArrowLeft, Send, ShieldCheck, LifeBuoy, Smartphone, Monitor, Globe } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { value: 'BUG_REPORT', label: 'Report a Bug (Public Beta)' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request / AI Capability' },
  { value: 'BILLING_ISSUE', label: 'Billing / Subscription / Trial Issue' },
  { value: 'ACCOUNT_ISSUE', label: 'Account / Login / Registration Issue' },
  { value: 'SOCIAL_CONNECTION_ISSUE', label: 'Social Account Connection Issue' },
  { value: 'TECHNICAL_SUPPORT', label: 'Technical Support / Other Platform Issue' },
  { value: 'ACCOUNT_DELETION', label: 'Data Deletion / Account Closure Request' },
];

const PLATFORMS = [
  { value: 'WEB', label: 'Web Browser (vercel app)' },
  { value: 'WINDOWS', label: 'Windows Desktop App' },
  { value: 'ANDROID', label: 'Android Mobile App' },
];

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('BUG_REPORT');
  const [platform, setPlatform] = useState('WEB');
  const [device, setDevice] = useState('');
  const [appVersion, setAppVersion] = useState('1.0.0-beta.1');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [actualResult, setActualResult] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !category) return;
    const tId = `GP-${Date.now().toString(36).toUpperCase()}`;
    setTicketId(tId);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-card space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">GrowthPilot AI Support & Help Center</h1>
              <p className="text-xs text-slate-400">Public Beta — Bug Reports, Feature Requests, Billing & Account Issues</p>
            </div>
          </div>

          {/* Quick contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Email Support</span>
              </div>
              <p className="text-slate-400">support@growthpilot.ai</p>
              <div className="text-[10px] text-slate-500">Response within 24h</div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-amber-400" />
                <span>Beta Bug Reports</span>
              </div>
              <p className="text-slate-400">Triaged continuously</p>
              <div className="text-[10px] text-slate-500">Direct engineering inbox</div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Paddle Billing</span>
              </div>
              <p className="text-slate-400">help.paddle.com</p>
              <div className="text-[10px] text-slate-500">Merchant of Record</div>
            </div>
          </div>

          {/* Beta notice */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl px-4 py-3 text-xs text-amber-300">
            <strong>⚠️ Beta Notice:</strong> Do <strong>NOT</strong> include passwords, API keys, session tokens, or payment card numbers in your support request.
          </div>

          {submitted ? (
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Support Ticket Submitted Successfully</span>
              </div>
              <p className="text-xs text-emerald-200">
                Thank you for contacting GrowthPilot Support. Our technical team has received your report and will respond via email within 24 hours.
              </p>
              <div className="text-xs font-mono text-emerald-300 bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/30">
                Ticket Reference: <strong>{ticketId}</strong>
              </div>
              <p className="text-[10px] text-emerald-500">Please save this ticket reference for future communication.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Connor"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@luxuryrealty.com"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Platform + Device */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {PLATFORMS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Device / Browser</label>
                  <input
                    type="text"
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    placeholder="Chrome 127 / Windows 11 / Samsung S24"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* App version */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">App Version</label>
                <input
                  type="text"
                  value={appVersion}
                  onChange={(e) => setAppVersion(e.target.value)}
                  placeholder="1.0.0-beta.1"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Steps to reproduce */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Steps to Reproduce</label>
                <textarea
                  rows={3}
                  value={stepsToReproduce}
                  onChange={(e) => setStepsToReproduce(e.target.value)}
                  placeholder="1. Open /content-studio&#10;2. Click Generate&#10;3. Click Publish&#10;4. See error"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Expected + Actual result */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Result</label>
                  <textarea
                    rows={2}
                    value={expectedResult}
                    onChange={(e) => setExpectedResult(e.target.value)}
                    placeholder="The post should publish successfully."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Actual Result</label>
                  <textarea
                    rows={2}
                    value={actualResult}
                    onChange={(e) => setActualResult(e.target.value)}
                    placeholder="A red error toast appears with no message."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Additional context */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Details / Context</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any other information, screenshots description, or context..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Support Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

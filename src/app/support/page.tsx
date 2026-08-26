'use client';

import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Bug, Mail, CheckCircle2, ArrowLeft, Send, ShieldCheck, LifeBuoy } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('TECHNICAL_SUPPORT');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
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
              <p className="text-xs text-slate-400">Public Beta User Assistance, Bug Reporting & Billing Enquiries</p>
            </div>
          </div>

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
                <span>Beta Bug Bounty</span>
              </div>
              <p className="text-slate-400">Direct engineering inbox</p>
              <div className="text-[10px] text-slate-500">Triaged continuously</div>
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

          {submitted ? (
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Support Ticket Submitted Successfully</span>
              </div>
              <p className="text-xs text-emerald-200">
                Thank you for contacting GrowthPilot Support. Our technical team has received your ticket and will respond via email.
              </p>
              <div className="text-xs font-mono text-emerald-300 bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/30">
                Ticket Reference: <strong>{ticketId}</strong>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email</label>
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enquiry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="TECHNICAL_SUPPORT">Technical Support / Platform Issue</option>
                  <option value="REPORT_A_BUG">Report a Bug (Public Beta)</option>
                  <option value="BILLING_ENQUIRY">Billing / Subscription / Trial Question</option>
                  <option value="FEATURE_REQUEST">Feature Request / AI Capability</option>
                  <option value="ACCOUNT_DELETION">Data Deletion / Account Closure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please provide context, steps to reproduce, or any specific questions..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Support Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

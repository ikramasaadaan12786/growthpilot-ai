'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  LogOut,
  Building2,
  Crown,
  Flame,
  MessageSquare
} from 'lucide-react';
import { ManualPaymentModal } from '@/components/billing/ManualPaymentModal';

export default function PaymentRequiredPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('PRO');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenPayment = (plan: string) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-rose-400" />
            <span>7-Day Free Trial Expired</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Activate Your Growth Subscription
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Your 7-day free trial has concluded. All your social accounts, content drafts, and lead CRM data remain securely preserved. Choose a plan below to resume full AI automation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Starter Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-extrabold uppercase text-slate-400">Starter</div>
              <div className="text-2xl font-black text-white font-mono mt-1">$19 <span className="text-xs text-slate-500 font-normal">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-1">For solo creators &amp; realtors starting growth.</p>
              
              <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800 mt-3">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400" /> 2 Connected Channels</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400" /> 50 AI Posts / Month</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400" /> Content Calendar</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400" /> Instant Activation Desk</li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenPayment('STARTER')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Select Starter ($19)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pro Plan (Recommended) */}
          <div className="bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-900 border-2 border-emerald-500 rounded-2xl p-5 shadow-glow-primary flex flex-col justify-between relative space-y-4">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" /> Growth Pro
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">$49 <span className="text-xs text-slate-500 font-normal">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Multi-platform video &amp; Real Estate AI Engine.</p>
              
              <ul className="space-y-2 text-xs text-slate-200 pt-3 border-t border-slate-800 mt-3">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> 5 Connected Channels</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> 250 AI Posts / Month</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Real Estate AI Mode</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Creator Inbox Direct</li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenPayment('PRO')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Activate Pro ($49)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Advanced Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Advanced
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">$99 <span className="text-xs text-slate-500 font-normal">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Unlimited AI &amp; Full Lead CRM pipeline.</p>
              
              <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800 mt-3">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> 15 Connected Channels</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Unlimited AI Generations</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Full Lead CRM Pipeline</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Weekly AI Reports</li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenPayment('ADVANCED')}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Choose Advanced ($99)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Business Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Business
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">$199 <span className="text-xs text-slate-500 font-normal">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-1">For brokerages &amp; enterprise agencies.</p>
              
              <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800 mt-3">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> Unlimited Channels</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> Team Collaboration</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> White-Label PDF Reports</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> Dedicated Concierge</li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenPayment('BUSINESS')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-amber-500/30 cursor-pointer"
            >
              <span>Select Business ($199)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Footer Actions & Sign Out */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Manual Transfer &amp; Direct Concierge Activation Desk</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/support"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Manual Payment Concierge Modal */}
      <ManualPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
      />
    </div>
  );
}

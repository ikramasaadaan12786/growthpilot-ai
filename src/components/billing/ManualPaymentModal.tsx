'use client';

import React from 'react';
import { 
  Check, 
  X, 
  MessageSquare, 
  Mail, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  Crown
} from 'lucide-react';
import { getAgentContact, buildWhatsAppAgentUrl, buildEmailAgentUrl } from '@/lib/agent-config';

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'STARTER' | 'PRO' | 'ADVANCED' | 'BUSINESS' | string;
  userEmail?: string;
  userName?: string;
}

const PLAN_PRICES: Record<string, { price: string; name: string; features: string[] }> = {
  STARTER: {
    price: '$19/mo',
    name: 'Starter Plan',
    features: ['2 Social Channels', '50 AI Posts / Month', 'Content Calendar', 'Instant Activation Desk']
  },
  PRO: {
    price: '$49/mo',
    name: 'Growth Pro Plan',
    features: ['5 Social Channels', '250 AI Posts / Month', 'Real Estate AI Engine', 'Creator Inbox', 'Instant Activation Desk']
  },
  ADVANCED: {
    price: '$99/mo',
    name: 'Advanced Plan',
    features: ['15 Social Channels', 'Unlimited AI Generations', 'Full Lead CRM Pipeline', 'Instant Activation Desk']
  },
  AGENCY: {
    price: '$99/mo',
    name: 'Advanced Plan',
    features: ['15 Social Channels', 'Unlimited AI Generations', 'Full Lead CRM Pipeline', 'Instant Activation Desk']
  },
  BUSINESS: {
    price: '$199/mo',
    name: 'Enterprise Business',
    features: ['Unlimited Channels', 'Team Multi-Seat', 'White-Label Reports', 'Dedicated Concierge Desk']
  }
};

export function ManualPaymentModal({
  isOpen,
  onClose,
  plan,
  userEmail,
  userName
}: ManualPaymentModalProps) {
  if (!isOpen) return null;

  const normalizedPlan = (plan || 'PRO').toUpperCase();
  const planInfo = PLAN_PRICES[normalizedPlan] || PLAN_PRICES.PRO;
  const contact = getAgentContact();

  const whatsappUrl = buildWhatsAppAgentUrl({
    plan: planInfo.name,
    userEmail,
    userName
  });

  const emailUrl = buildEmailAgentUrl({
    plan: planInfo.name,
    userEmail,
    userName
  });

  const handleContactAgent = () => {
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleContactEmail = () => {
    if (typeof window !== 'undefined') {
      window.location.href = emailUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Ambient Top Glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge & Title */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Subscription Activation</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Complete Your Subscription
          </h2>
        </div>

        {/* Professional Notice Message */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p className="font-semibold text-white">
            Online payment is currently being upgraded.
          </p>
          <p className="text-slate-400">
            Please contact your account agent to complete the payment manually. Once your payment is confirmed, your subscription will be activated.
          </p>
        </div>

        {/* Selected Plan Summary Card */}
        <div className="bg-gradient-to-r from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-500/20 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Tier</div>
              <div className="text-base font-black text-white">{planInfo.name}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-emerald-400 font-mono">{planInfo.price}</div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                7-Day Free Trial
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
            {planInfo.features.slice(0, 4).map((f, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Configured Agent Contact Information */}
        <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Assigned Agent</div>
            <div className="font-bold text-white">{contact.agentName}</div>
          </div>
          <div className="text-right space-y-0.5">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Primary Desk</div>
            <div className="text-cyan-400 font-mono font-medium">{contact.phoneNumber}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleContactAgent}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            <MessageSquare className="w-4 h-4 text-white transition-transform group-hover:scale-110" />
            <span>Contact Agent on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleContactEmail}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Send Email</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold transition-colors border border-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Trust Footnote */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secure activation • Instant account upgrade upon verification</span>
        </div>

      </div>
    </div>
  );
}

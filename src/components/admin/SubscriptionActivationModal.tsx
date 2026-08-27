'use client';

import React, { useState } from 'react';
import { 
  Crown, 
  X, 
  Check, 
  Calendar, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw,
  DollarSign
} from 'lucide-react';

interface SubscriptionActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    subscription: {
      plan: string;
      status: string;
      currentPeriodStart?: string;
      currentPeriodEnd?: string;
      paymentMode?: string;
    } | null;
  } | null;
  onSuccess: () => void;
}

export function SubscriptionActivationModal({
  isOpen,
  onClose,
  user,
  onSuccess
}: SubscriptionActivationModalProps) {
  if (!isOpen || !user) return null;

  const [selectedPlan, setSelectedPlan] = useState<string>(user.subscription?.plan || 'PRO');
  const [billingPeriod, setBillingPeriod] = useState<'1_MONTH' | '3_MONTHS' | '6_MONTHS' | '1_YEAR'>('1_MONTH');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('MANUAL_TRANSFER');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePeriodChange = (period: '1_MONTH' | '3_MONTHS' | '6_MONTHS' | '1_YEAR') => {
    setBillingPeriod(period);
    const start = new Date(startDate);
    let days = 30;
    if (period === '3_MONTHS') days = 90;
    if (period === '6_MONTHS') days = 180;
    if (period === '1_YEAR') days = 365;

    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    setExpiryDate(end.toISOString().split('T')[0]);
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MANUAL_ACTIVATE',
          plan: selectedPlan,
          billingPeriod,
          startDate,
          expiryDate,
          paymentMethod,
          paymentReference,
          internalNotes
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to activate subscription');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error executing manual activation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Ambient Top Glow */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Master Admin Manual Payment Desk</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Activate Subscription for User
          </h2>
          <p className="text-xs text-slate-400">
            Target User: <span className="text-white font-semibold">{user.name}</span> ({user.email})
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-500/60 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleActivate} className="space-y-4">
          
          {/* Plan Selection Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Select Subscription Plan
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'STARTER', label: 'STARTER', price: '$19/mo' },
                { id: 'PRO', label: 'GROWTH PRO', price: '$49/mo' },
                { id: 'ADVANCED', label: 'ADVANCED', price: '$99/mo' },
                { id: 'BUSINESS', label: 'BUSINESS', price: '$199/mo' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedPlan(tier.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPlan === tier.id
                      ? 'bg-emerald-950/50 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] font-black uppercase tracking-wider">{tier.label}</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">{tier.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Billing Period Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Billing Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: '1_MONTH', label: '1 Month' },
                { id: '3_MONTHS', label: '3 Months' },
                { id: '6_MONTHS', label: '6 Months' },
                { id: '1_YEAR', label: '1 Year' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePeriodChange(p.id as any)}
                  className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    billingPeriod === p.id
                      ? 'bg-indigo-950/50 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Subscription Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Expiry Date
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Payment Method & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Payment Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="MANUAL_TRANSFER">Bank Wire / Direct Transfer</option>
                <option value="CRYPTO">USDT / Crypto</option>
                <option value="DIRECT_INVOICE">Direct Corporate Invoice</option>
                <option value="STRIPE">Stripe Offline</option>
                <option value="PADDLE">Paddle Direct</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Payment Reference ID / TXID
              </label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="e.g. WIRE-2026-9812 / TX-0x84f..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Admin Internal Notes &amp; Audit Trail
            </label>
            <textarea
              rows={2}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Verified by Admin Desk. Full invoice settled."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Activating Subscription...</span>
                </div>
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  <span>Confirm Payment &amp; Activate Plan</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Server-Side RBAC Authority • Idempotent Audit Log Recorded</span>
        </div>

      </div>
    </div>
  );
}

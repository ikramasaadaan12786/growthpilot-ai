'use client';

import React, { useState } from 'react';
import { 
  Crown, 
  X, 
  Check, 
  Calendar, 
  CreditCard, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw,
  Zap,
  DollarSign
} from 'lucide-react';

interface SubscriptionActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    credits?: number;
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
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [creditsToAdd, setCreditsToAdd] = useState<number>(0);
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
          paymentReference,
          internalNotes,
          creditsToAdd: Number(creditsToAdd) || 0
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

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Manual Payment Activation Desk</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Activate Subscription
          </h2>
          <p className="text-xs text-slate-400">
            Confirm manual payment received outside GrowthPilot and grant paid entitlements immediately.
          </p>
        </div>

        {/* Target User Info Banner */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-white text-sm">{user.name}</div>
            <div className="text-slate-400 font-mono">{user.email}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {user.id}</div>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Plan</span>
            <div className="text-xs font-black text-cyan-400 uppercase font-mono">
              {user.subscription?.plan || 'TRIAL'} ({user.subscription?.status || 'ACTIVE'})
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">Credits: {user.credits ?? 20}</div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleActivate} className="space-y-4 text-xs">
          {/* Plan Selection */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Select Subscription Plan
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'STARTER', label: 'STARTER', price: '$19/mo' },
                { id: 'PRO', label: 'GROWTH PRO', price: '$49/mo' },
                { id: 'ADVANCED', label: 'ADVANCED', price: '$99/mo' },
                { id: 'BUSINESS', label: 'BUSINESS', price: '$199/mo' }
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedPlan === p.id 
                      ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md' 
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="font-extrabold text-xs">{p.label}</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5">{p.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Billing Period Selector */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Billing Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '1_MONTH', label: '1 Month' },
                { id: '3_MONTHS', label: '3 Months' },
                { id: '6_MONTHS', label: '6 Months' },
                { id: '1_YEAR', label: '1 Year' }
              ].map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => handlePeriodChange(b.id as any)}
                  className={`py-2 px-1 rounded-xl border text-center font-bold text-[11px] transition-all ${
                    billingPeriod === b.id 
                      ? 'border-indigo-500 bg-indigo-500/20 text-white' 
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Activation Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Subscription Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Payment Reference & Bonus Credits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Payment Reference / Tx ID</label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="e.g. Bank Wire #9042 / USDT"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Add Extra Credits (Optional)</label>
              <input
                type="number"
                min="0"
                value={creditsToAdd}
                onChange={(e) => setCreditsToAdd(parseInt(e.target.value, 10) || 0)}
                placeholder="0"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Internal Admin Note</label>
            <textarea
              rows={2}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Payment verified by Account Agent. Plan activated."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-extrabold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Activating Subscription in Database...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>ACTIVATE SUBSCRIPTION</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

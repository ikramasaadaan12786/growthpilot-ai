'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Mail, 
  Lock, 
  RefreshCw,
  LogOut
} from 'lucide-react';

export default function PendingApprovalPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/auth/session', { cache: 'no-store' });
      const data = await res.json();
      if (data.authenticated && data.user?.approvalStatus === 'APPROVED') {
        window.location.replace('/');
      } else {
        setStatusMessage('Your account is still in the approval queue. Our team reviews all new business workspaces promptly.');
      }
    } catch {
      setStatusMessage('Unable to check status at this time. Please try logging in again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Pending Workspace Review</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Account Awaiting Approval
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Your GrowthPilot AI account has been registered successfully and is currently awaiting administrator review.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-6">
          
          {/* Progress Timeline */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-2 border-b border-slate-800/80">
              <span>Onboarding Lifecycle</span>
              <span className="text-amber-400 font-mono">Step 1 of 2</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">1. Account Registered</div>
                  <div className="text-[11px] text-slate-400">Credentials created and encrypted in private database.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 text-[10px] font-bold shrink-0 mt-0.5">
                  •
                </div>
                <div>
                  <div className="font-bold text-amber-300">2. Master Admin Verification (In Progress)</div>
                  <div className="text-[11px] text-slate-400">The administration team will review and approve your workspace.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs opacity-60">
                <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-[10px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-bold text-slate-400">3. 7-Day Free Trial Activation</div>
                  <div className="text-[11px] text-slate-500">Your 7-day full access trial begins immediately upon approval.</div>
                </div>
              </div>
            </div>
          </div>

          {statusMessage && (
            <div className="p-3.5 bg-indigo-950/80 border border-indigo-500/50 rounded-xl text-xs text-indigo-300 animate-fadeIn">
              {statusMessage}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isChecking ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Checking review status...</span>
                </div>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Check Approval Status</span>
                </>
              )}
            </button>

            <Link
              href="/login"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign In to Another Account</span>
            </Link>
          </div>

          {/* Help note */}
          <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-1">
            <div>Questions regarding your approval?</div>
            <a 
              href="mailto:support@growthpilot.ai" 
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              support@growthpilot.ai
            </a>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Multi-Tenant Isolation • Admin-Gated Tenant Approval</span>
        </div>
      </div>
    </div>
  );
}

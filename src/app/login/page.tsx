'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Rocket, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({ success: false, error: 'Server returned an invalid response' }));

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Invalid email address or password. Please try again.');
        setIsLoading(false);
        return;
      }

      if (data.redirect) {
        window.location.replace(data.redirect);
        return;
      }

      // Check for redirect query parameter (e.g. ?redirect=/leads)
      let target = '/';
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectParam = urlParams.get('redirect');
        if (redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('/login')) {
          target = redirectParam;
        } else if (data.user?.role === 'ADMIN' || data.user?.role === 'MASTER_ADMIN' || data.user?.isMasterAdmin) {
          target = '/admin';
        }
      }

      // Execute full browser transition to ensure new cookie is sent to server on initial load
      window.location.replace(target);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred. Please check your connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Rocket className="w-4 h-4 text-indigo-400" />
          <span>GrowthPilot AI Cloud SaaS</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Log in to manage your AI content engine, multi-platform publishing, and verified CRM leads.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-6">
          {errorMessage && (
            <div className="p-4 bg-rose-950/80 border border-rose-500/80 rounded-2xl flex items-start gap-3 text-xs text-rose-300 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Authentication Notice</span>
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 text-xs"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to GrowthPilot</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/register"
              className="text-indigo-400 hover:text-indigo-300 font-bold"
            >
              Start 7-Day Free Trial
            </Link>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PBKDF2 10k-round Password Security • AES-256-GCM Token Vault</span>
        </div>
      </div>
    </div>
  );
}

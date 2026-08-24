'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Server, 
  Database, 
  Lock, 
  ArrowLeft, 
  RefreshCw,
  AlertTriangle,
  Key
} from 'lucide-react';
import { PlatformIcon } from '@/components/common/PlatformIcon';

interface EnvDiagnostics {
  META_CLIENT_ID: 'CONFIGURED' | 'MISSING';
  META_CLIENT_SECRET: 'CONFIGURED' | 'MISSING';
  LINKEDIN_CLIENT_ID: 'CONFIGURED' | 'MISSING';
  LINKEDIN_CLIENT_SECRET: 'CONFIGURED' | 'MISSING';
  TIKTOK_CLIENT_KEY: 'CONFIGURED' | 'MISSING';
  TIKTOK_CLIENT_SECRET: 'CONFIGURED' | 'MISSING';
  ENCRYPTION_KEY: 'CONFIGURED' | 'MISSING';
  DATABASE: 'CONNECTED' | 'FAILED';
  BACKEND: 'ONLINE' | 'OFFLINE';
}

export default function AdminDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<EnvDiagnostics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<string>('');

  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/diagnostics');
      const data = await res.json();
      if (data.success) {
        setDiagnostics(data.diagnostics);
        setLastChecked(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const items = diagnostics ? [
    { key: 'META_CLIENT_ID', label: 'Meta App Client ID (Instagram / Facebook)', status: diagnostics.META_CLIENT_ID, icon: <PlatformIcon platform="INSTAGRAM" size={16} /> },
    { key: 'META_CLIENT_SECRET', label: 'Meta App Client Secret', status: diagnostics.META_CLIENT_SECRET, icon: <PlatformIcon platform="FACEBOOK" size={16} /> },
    { key: 'LINKEDIN_CLIENT_ID', label: 'LinkedIn App Client ID', status: diagnostics.LINKEDIN_CLIENT_ID, icon: <PlatformIcon platform="LINKEDIN" size={16} /> },
    { key: 'LINKEDIN_CLIENT_SECRET', label: 'LinkedIn App Client Secret', status: diagnostics.LINKEDIN_CLIENT_SECRET, icon: <PlatformIcon platform="LINKEDIN" size={16} /> },
    { key: 'TIKTOK_CLIENT_KEY', label: 'TikTok Developer Client Key', status: diagnostics.TIKTOK_CLIENT_KEY, icon: <PlatformIcon platform="TIKTOK" size={16} /> },
    { key: 'TIKTOK_CLIENT_SECRET', label: 'TikTok Developer Client Secret', status: diagnostics.TIKTOK_CLIENT_SECRET, icon: <PlatformIcon platform="TIKTOK" size={16} /> },
    { key: 'ENCRYPTION_KEY', label: 'AES-256-GCM Vault Key (NEXTAUTH_SECRET)', status: diagnostics.ENCRYPTION_KEY, icon: <Lock className="w-4 h-4 text-emerald-400" /> },
    { key: 'DATABASE', label: 'PostgreSQL Database Connection (Prisma)', status: diagnostics.DATABASE, icon: <Database className="w-4 h-4 text-cyan-400" /> },
    { key: 'BACKEND', label: 'Isolated Backend Server API Runtime', status: diagnostics.BACKEND, icon: <Server className="w-4 h-4 text-indigo-400" /> }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          {lastChecked && (
            <span className="text-xs text-slate-500 font-medium">Checked: {lastChecked}</span>
          )}
          <button
            onClick={fetchDiagnostics}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Re-evaluate Environment</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Security & Infrastructure Gatekeeper
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Admin Environment & Secret Diagnostics
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Verifies configuration status for official platform credentials, encrypted vault keys, and database connectivity. <strong>Raw secret values are never displayed.</strong>
        </p>
      </div>

      {/* Security Disclaimer */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-2xl flex items-start gap-3 text-xs text-indigo-200">
        <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Zero-Knowledge Secret Redaction:</span> This terminal only checks variable presence and connectivity. Sensitive API secrets and decryption keys remain protected in memory and server-side environment storage.
        </div>
      </div>

      {/* Diagnostics Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-card">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Component / Variable</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mx-auto mb-2" />
              <span>Inspecting system environment...</span>
            </div>
          ) : (
            items.map((item) => {
              const isGood = item.status === 'CONFIGURED' || item.status === 'CONNECTED' || item.status === 'ONLINE';
              return (
                <div key={item.key} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono">{item.key}</div>
                      <div className="text-[11px] text-slate-400">{item.label}</div>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        isGood
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {isGood ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{item.status}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

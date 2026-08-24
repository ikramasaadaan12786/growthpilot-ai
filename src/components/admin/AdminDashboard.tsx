'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Activity, 
  Cpu, 
  Lock, 
  Server, 
  AlertCircle, 
  CheckCircle2, 
  Terminal,
  Database
} from 'lucide-react';
import { PlatformIcon } from '../common/PlatformIcon';

export function AdminDashboard() {
  const auditLogs = [
    { time: '2026-08-23 15:30:12', user: 'team@growthpilot.ai', action: 'CONTENT_GENERATE', detail: 'Cross-platform generation for Dubai Marina Penthouse', status: 'SUCCESS' },
    { time: '2026-08-23 15:28:44', user: 'system_daemon', action: 'OAUTH_TOKEN_REFRESH', detail: 'Meta Graph API token refreshed (60 days validity)', status: 'SUCCESS' },
    { time: '2026-08-23 15:15:00', user: 'system_scheduler', action: 'AUTO_PUBLISH', detail: 'LinkedIn Post ugc_98234 published via Official UGC API', status: 'SUCCESS' },
    { time: '2026-08-23 14:45:19', user: 'team@growthpilot.ai', action: 'LEAD_STATUS_UPDATE', detail: 'Lead #4102 status set to QUALIFIED ($650k pipeline)', status: 'SUCCESS' },
    { time: '2026-08-23 13:10:05', user: 'security_firewall', action: 'RATE_LIMIT_CHECK', detail: '4 authorized platform endpoints within 18% quota threshold', status: 'NORMAL' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Total Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">1,482</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">+14% MoM</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Monthly Recurring (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">$48,920</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">ARR: $587,040</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">AI Tokens Processed</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">4.82M</div>
          <div className="text-[11px] text-slate-400 mt-1">Avg Latency: 420ms</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Database Status</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">HEALTHY</div>
          <div className="text-[11px] text-slate-400 mt-1">PostgreSQL & Prisma Sync</div>
        </div>
      </div>

      {/* Official Platform API Health Monitors */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            <span>Official Social Media API Integration Status</span>
          </h3>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <a
              href="/admin/diagnostics"
              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Environment Diagnostics</span>
            </a>

            <a
              href="/admin/integration-test"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all shrink-0"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Real Account Integration Test Center</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-pink-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <PlatformIcon platform="INSTAGRAM" size={16} /> Instagram Graph API
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                v20.0 OK
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Rate Limit: 42/200 calls/hr used</div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-blue-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <PlatformIcon platform="FACEBOOK" size={16} /> Meta Pages API
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                v20.0 OK
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Rate Limit: 19/200 calls/hr used</div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-sky-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <PlatformIcon platform="LINKEDIN" size={16} /> LinkedIn Marketing API
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                Active OK
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Rate Limit: 31/500 calls/day used</div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <PlatformIcon platform="TIKTOK" size={16} /> TikTok Direct Post API
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                v2 OK
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Rate Limit: 55/300 calls/day used</div>
          </div>
        </div>
      </div>

      {/* Security & Audit Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <span>Real-Time Security & System Audit Trail</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Zero passwords stored • AES-256</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor / Entity</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Audit Details</th>
                <th className="py-2.5 px-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-950/40">
                  <td className="py-2.5 px-3 text-slate-500">{log.time}</td>
                  <td className="py-2.5 px-3 text-slate-300">{log.user}</td>
                  <td className="py-2.5 px-3 text-indigo-400 font-bold">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-400">{log.detail}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

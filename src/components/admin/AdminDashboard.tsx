'use client';

import React, { useState, useEffect } from 'react';
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
  Database,
  Search,
  UserCheck,
  UserX,
  RefreshCw,
  Crown
} from 'lucide-react';
import { PlatformIcon } from '../common/PlatformIcon';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  companyName: string | null;
  industry: string | null;
  isSuspended: boolean;
  createdAt: string;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
  } | null;
  socialAccountsCount: number;
  connectedPlatforms: string[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/admin/users?q=${encodeURIComponent(searchQuery)}`)
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      if (!statsRes.ok || !statsData.success) {
        setError(statsData.error || 'Failed to load admin stats. Admin privileges required.');
        setIsLoading(false);
        return;
      }

      setStats(statsData.stats);
      if (usersData.success) {
        setUsers(usersData.users);
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Network error fetching admin metrics.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [searchQuery]);

  const handleToggleSuspend = async (userId: string, currentStatus: boolean) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSuspended: !currentStatus })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: !currentStatus } : u));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleChangePlan = async (userId: string, newPlan: string) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? {
          ...u,
          subscription: u.subscription ? { ...u.subscription, plan: newPlan } : { plan: newPlan, status: 'ACTIVE', currentPeriodEnd: '' }
        } : u));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (error) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
        <div className="pt-2">
          <a href="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors">
            Log in with Admin Account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-200 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>GrowthPilot Multi-Tenant Control Plane</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Administrator SaaS Management
          </h1>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Top Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Total Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{stats?.totalUsers ?? '...'}</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">Multi-tenant isolated</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Monthly Recurring (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">${(stats?.mrr ?? stats?.estimatedMrr ?? 0).toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">Paddle Sandbox Catalog</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Active Subscriptions</span>
            <Crown className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono">{stats?.activeSubscriptions ?? '0'}</div>
          <div className="text-[11px] text-slate-400 mt-1">Starter $19 / Pro $49 / Agency $99 / Biz $199</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Connected Channels</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{stats?.totalSocialAccounts ?? '...'}</div>
          <div className="text-[11px] text-slate-400 mt-1">Encrypted OAuth Vaults</div>
        </div>
      </div>

      {/* User Management & Plan Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Registered Users &amp; Subscription Governance</h2>
            <p className="text-xs text-slate-400">Search, manage subscriber tiers, view platform counts, and suspend accounts.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300 min-w-[800px]">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Plan / Status</th>
                <th className="py-3 px-4">Channels</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                    No users matching search query.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className={`hover:bg-slate-950/40 ${u.isSuspended ? 'opacity-50 bg-rose-950/10' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      {u.companyName && <div className="text-[10px] text-indigo-400">{u.companyName}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={u.subscription?.plan || 'TRIAL'}
                          onChange={(e) => handleChangePlan(u.id, e.target.value)}
                          disabled={actionLoadingId === u.id}
                          aria-label={`Change subscription tier for ${u.name}`}
                          className="bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 font-mono"
                        >
                          <option value="TRIAL">TRIAL (7-Day)</option>
                          <option value="STARTER">STARTER ($19)</option>
                          <option value="PRO">PRO ($49)</option>
                          <option value="ADVANCED">ADVANCED ($99)</option>
                          <option value="BUSINESS">BUSINESS ($199)</option>
                          <option value="FREE">INACTIVE / EXPIRED</option>
                        </select>
                        <span className="text-[10px] text-slate-500 uppercase">{u.subscription?.status || 'ACTIVE'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold font-mono text-white mr-1.5">{u.socialAccountsCount}</span>
                        {u.connectedPlatforms.map((plat) => (
                          <PlatformIcon key={plat} platform={plat as any} size={14} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleSuspend(u.id, u.isSuspended)}
                        disabled={actionLoadingId === u.id || u.role === 'ADMIN'}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          u.isSuspended 
                            ? 'bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300'
                            : 'bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300'
                        } disabled:opacity-30`}
                      >
                        {u.isSuspended ? 'Reactivate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time Security & Audit Logs */}
      {stats?.auditLogs && stats.auditLogs.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <span>Real-Time SaaS Security &amp; Audit Trail</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Immutable audit logging</span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {stats.auditLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-950/40">
                    <td className="py-2.5 px-3 text-slate-500">{new Date(log.time).toLocaleTimeString()}</td>
                    <td className="py-2.5 px-3 text-slate-300">{log.user}</td>
                    <td className="py-2.5 px-3 text-indigo-400 font-bold">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-400">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

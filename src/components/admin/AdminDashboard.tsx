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
  Crown,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  PlusCircle,
  Zap
} from 'lucide-react';
import { PlatformIcon } from '../common/PlatformIcon';
import { SubscriptionActivationModal } from './SubscriptionActivationModal';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  companyName: string | null;
  industry: string | null;
  isSuspended: boolean;
  credits: number;
  createdAt: string;
  subscription: {
    plan: string;
    status: string;
    trialStatus: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    isExpired?: boolean;
    paymentMode?: string;
  } | null;
  internalNotes?: string;
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
  
  // Activation Modal State
  const [selectedUserForActivation, setSelectedUserForActivation] = useState<AdminUser | null>(null);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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
        showToast(`User ${currentStatus ? 'reactivated' : 'suspended'} successfully.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleQuickExtend = async (userId: string, days: number) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'EXTEND',
          daysToAdd: days,
          internalNotes: `Manual quick extension +${days} days by admin`
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Subscription extended by +${days} days.`);
        fetchAdminData();
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
          subscription: u.subscription ? { ...u.subscription, plan: newPlan } : { 
            plan: newPlan, 
            status: 'ACTIVE', 
            trialStatus: 'COMPLETED'
          }
        } : u));
        showToast(`Plan updated to ${newPlan}.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const openActivationModal = (user: AdminUser) => {
    setSelectedUserForActivation(user);
    setIsActivationModalOpen(true);
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Manual Activation Modal */}
      <SubscriptionActivationModal
        isOpen={isActivationModalOpen}
        onClose={() => {
          setIsActivationModalOpen(false);
          setSelectedUserForActivation(null);
        }}
        user={selectedUserForActivation}
        onSuccess={() => {
          showToast('Subscription manually activated successfully!');
          fetchAdminData();
        }}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>GrowthPilot Manual Launch &amp; Control Plane</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Administrator SaaS &amp; Subscription Governance
          </h1>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Top Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Total Registered Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{stats?.totalUsers ?? '...'}</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">Multi-tenant isolated</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Active Paid Subscribers</span>
            <Crown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{stats?.activeSubscriptions ?? '0'}</div>
          <div className="text-[11px] text-slate-400 mt-1">Manual &amp; Activated Accounts</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Operating Payment Mode</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-400 font-sans mt-1">Manual Agent Desk</div>
          <div className="text-[11px] text-slate-400 mt-1">Direct Bank Wire / Invoice</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Connected Channels</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{stats?.totalSocialAccounts ?? '...'}</div>
          <div className="text-[11px] text-slate-400 mt-1">AES-256 Encrypted Vaults</div>
        </div>
      </div>

      {/* User Management & Plan Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Users &amp; Subscription Management</span>
            </h2>
            <p className="text-xs text-slate-400">Search by Name, Email, or User ID. Activate manual payments, extend dates, and adjust plans.</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or user ID..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300 min-w-[950px]">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User &amp; ID</th>
                <th className="py-3 px-4">Role / Credits</th>
                <th className="py-3 px-4">Plan &amp; Status</th>
                <th className="py-3 px-4">Dates &amp; Mode</th>
                <th className="py-3 px-4">Channels</th>
                <th className="py-3 px-4 text-right">Subscription Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-500">
                    No users matching search query.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isExpired = u.subscription?.isExpired || (u.subscription?.status === 'EXPIRED');
                  const status = u.subscription?.status || 'TRIAL';

                  return (
                    <tr key={u.id} className={`hover:bg-slate-950/40 ${u.isSuspended ? 'opacity-50 bg-rose-950/10' : ''}`}>
                      {/* User & ID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.role === 'ADMIN' && (
                            <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono border border-amber-500/30">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>
                      </td>

                      {/* Role & Credits */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white font-mono flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>{u.credits ?? 20} Credits</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Joined: {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Plan & Status */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-cyan-400 uppercase font-mono">
                              {u.subscription?.plan || 'TRIAL'}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono uppercase ${
                              status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              status === 'TRIAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              status === 'EXPIRED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                              status === 'SUSPENDED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {status}
                            </span>
                          </div>
                          
                          {/* Quick Plan Selector */}
                          <select
                            value={u.subscription?.plan || 'TRIAL'}
                            onChange={(e) => handleChangePlan(u.id, e.target.value)}
                            disabled={actionLoadingId === u.id}
                            aria-label={`Change subscription tier for ${u.name}`}
                            className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-indigo-500 font-mono"
                          >
                            <option value="STARTER">STARTER ($19)</option>
                            <option value="PRO">PRO ($49)</option>
                            <option value="ADVANCED">ADVANCED ($99)</option>
                            <option value="BUSINESS">BUSINESS ($199)</option>
                            <option value="FREE">FREE / INACTIVE</option>
                            <option value="TRIAL">TRIAL (7-Day)</option>
                          </select>
                        </div>
                      </td>

                      {/* Dates & Mode */}
                      <td className="py-3 px-4">
                        <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
                          <div>
                            <span className="text-slate-500">Exp: </span>
                            <span className={isExpired ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                              {u.subscription?.currentPeriodEnd 
                                ? new Date(u.subscription.currentPeriodEnd).toLocaleDateString()
                                : '7-Day Trial Period'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Mode: {u.subscription?.paymentMode || 'Manual Payment'}
                          </div>
                        </div>
                      </td>

                      {/* Channels */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="font-bold font-mono text-white mr-1">{u.socialAccountsCount}</span>
                          {u.connectedPlatforms.map((plat) => (
                            <PlatformIcon key={plat} platform={plat as any} size={14} />
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openActivationModal(u)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>Activate</span>
                          </button>

                          <button
                            onClick={() => handleQuickExtend(u.id, 30)}
                            disabled={actionLoadingId === u.id}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
                            title="Extend expiry by +30 days"
                          >
                            +30d
                          </button>

                          <button
                            onClick={() => handleToggleSuspend(u.id, u.isSuspended)}
                            disabled={actionLoadingId === u.id || u.role === 'ADMIN'}
                            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              u.isSuspended 
                                ? 'bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300'
                                : 'bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300'
                            } disabled:opacity-30`}
                          >
                            {u.isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

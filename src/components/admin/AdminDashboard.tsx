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
  Zap,
  Sparkles,
  Check,
  X,
  ArrowRight,
  ShieldAlert
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
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt?: string | null;
  approvedBy?: string | null;
  trialStatus: 'NOT_STARTED' | 'ACTIVE' | 'EXPIRED';
  trialStartDate?: string | null;
  trialEndDate?: string | null;
  trialDaysRemaining: number;
  isSuspended: boolean;
  createdAt: string;
  subscription: {
    plan: string;
    status: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    isExpired?: boolean;
    paymentMethod?: string;
    paymentReference?: string;
    paymentNotes?: string;
  } | null;
  internalNotes?: string;
  socialAccountsCount: number;
  connectedPlatforms: string[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'PENDING' | 'USERS' | 'PAYMENTS' | 'AUDIT'>('PENDING');
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
        setError(statsData.error || 'Failed to load admin metrics. Master Admin privileges required.');
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

  const handleApproveUser = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'User approved & 7-day free trial activated!');
        fetchAdminData();
      } else {
        showToast(data.error || 'Failed to approve user.');
      }
    } catch (e: any) {
      showToast(e.message || 'Error approving user');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectUser = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REJECT' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('User registration rejected.');
        fetchAdminData();
      } else {
        showToast(data.error || 'Failed to reject user.');
      }
    } catch (e: any) {
      showToast(e.message || 'Error rejecting user');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleSuspend = async (userId: string, currentStatus: boolean) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: currentStatus ? 'REACTIVATE' : 'SUSPEND' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: !currentStatus } : u));
        showToast(`User ${currentStatus ? 'reactivated' : 'suspended'} successfully.`);
      } else {
        showToast(data.error || 'Action failed');
      }
    } catch (e: any) {
      showToast(e.message || 'Error executing action');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleExtendTrial = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'EXTEND_TRIAL' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('7-Day trial extended successfully!');
        fetchAdminData();
      }
    } catch (e: any) {
      showToast(e.message || 'Error extending trial');
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
        body: JSON.stringify({ action: 'MANUAL_ACTIVATE', plan: newPlan, billingPeriod: '1_MONTH' })
      });
      if (res.ok) {
        showToast(`Plan updated to ${newPlan}.`);
        fetchAdminData();
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

  const pendingUsers = users.filter(u => u.approvalStatus === 'PENDING');

  if (error) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Master Administrator Access Required</h2>
        <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
        <div className="pt-2">
          <a href="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors">
            Log in with Master Admin Account
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
            <span>Master Admin Control Plane</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            GrowthPilot AI Governance &amp; Approvals
          </h1>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Top Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">{pendingUsers.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting 7-Day Trial Grant</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Active Paid Subscribers</span>
            <Crown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{stats?.activeSubscriptions ?? '0'}</div>
          <div className="text-[11px] text-slate-400 mt-1">Manual Wire &amp; Direct Invoice</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Total Registered Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{stats?.totalUsers ?? users.length}</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">Multi-tenant isolated</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Operating Payment Mode</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-400 font-sans mt-1">Manual Concierge Desk</div>
          <div className="text-[11px] text-slate-400 mt-1">Paddle Gateway Standby</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'PENDING'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Approvals</span>
          {pendingUsers.length > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full font-mono">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'USERS'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Governance &amp; Subscriptions</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'PENDING' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Pending User Signups Awaiting Approval</span>
            </h2>
            <p className="text-xs text-slate-400">
              New registrations are blocked from accessing the application until approved. Approving a user immediately starts their official 7-Day Free Trial.
            </p>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-slate-300 min-w-[800px]">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Company &amp; Industry</th>
                  <th className="py-3 px-4">Signup Date</th>
                  <th className="py-3 px-4">Approval State</th>
                  <th className="py-3 px-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pendingUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-slate-500">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2 opacity-70" />
                      <div>All registered users have been reviewed. No pending approvals in queue.</div>
                    </td>
                  </tr>
                ) : (
                  pendingUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-medium">{u.companyName || 'Individual'}</div>
                        <div className="text-[11px] text-slate-400">{u.industry || 'General Business'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {new Date(u.createdAt).toLocaleDateString()} {new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                          Pending Review
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApproveUser(u.id)}
                            disabled={actionLoadingId === u.id}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-95 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve &amp; Start 7-Day Trial</span>
                          </button>

                          <button
                            onClick={() => handleRejectUser(u.id)}
                            disabled={actionLoadingId === u.id}
                            className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER GOVERNANCE */}
      {activeTab === 'USERS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>All Users &amp; Subscription Governance</span>
              </h2>
              <p className="text-xs text-slate-400">Search by Name, Email, or User ID. Activate manual payments, extend 7-day trials, and adjust tiers.</p>
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
                  <th className="py-3 px-4">User &amp; Role</th>
                  <th className="py-3 px-4">Approval &amp; Trial</th>
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
                    const isMasterAdmin = u.role === 'MASTER_ADMIN' || u.role === 'ADMIN' || u.email === 'team@growthpilot.ai' || u.email === 'admin@growthpilot.ai';

                    return (
                      <tr key={u.id} className={`hover:bg-slate-950/40 ${u.isSuspended ? 'opacity-50 bg-rose-950/10' : ''}`}>
                        {/* User & Role */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isMasterAdmin && (
                              <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono border border-amber-500/30">
                                MASTER ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>
                        </td>

                        {/* Approval & Trial Status */}
                        <td className="py-3 px-4 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono uppercase ${
                              u.approvalStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              u.approvalStatus === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {u.approvalStatus}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 font-mono">
                            {u.trialStatus === 'ACTIVE' ? (
                              <span className="text-cyan-400 font-semibold">7d Trial ({u.trialDaysRemaining}d left)</span>
                            ) : u.trialStatus === 'EXPIRED' ? (
                              <span className="text-rose-400">Trial Expired</span>
                            ) : (
                              <span className="text-slate-500">No Active Trial</span>
                            )}
                          </div>
                        </td>

                        {/* Plan & Status */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-cyan-400 uppercase font-mono">
                                {u.subscription?.plan || 'PRO'}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono uppercase ${
                                status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                status === 'TRIALING' || status === 'TRIAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                status === 'EXPIRED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                                'bg-slate-800 text-slate-400'
                              }`}>
                                {status}
                              </span>
                            </div>
                            
                            {/* Quick Plan Selector */}
                            <select
                              value={u.subscription?.plan || 'PRO'}
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
                                  : (u.trialEndDate ? new Date(u.trialEndDate).toLocaleDateString() : 'N/A')}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Mode: {u.subscription?.paymentMethod || 'Manual Payment'}
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
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                            >
                              <Crown className="w-3.5 h-3.5" />
                              <span>Activate</span>
                            </button>

                            <button
                              onClick={() => handleExtendTrial(u.id)}
                              disabled={actionLoadingId === u.id}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
                              title="Grant +7 days trial"
                            >
                              +7d Trial
                            </button>

                            <button
                              onClick={() => handleToggleSuspend(u.id, u.isSuspended)}
                              disabled={actionLoadingId === u.id || isMasterAdmin}
                              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                u.isSuspended 
                                  ? 'bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300'
                                  : 'bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300'
                              } disabled:opacity-30 cursor-pointer`}
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
      )}
    </div>
  );
}

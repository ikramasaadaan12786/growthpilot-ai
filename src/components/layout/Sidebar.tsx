'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Share2, 
  Sparkles, 
  PenTool, 
  CalendarDays, 
  BarChart3, 
  Radar, 
  Flame, 
  Megaphone, 
  Users2, 
  FileText, 
  Bot, 
  ShieldCheck, 
  Settings,
  Zap,
  Building2,
  Clock,
  Crown,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/lib/store';

export function Sidebar() {
  const pathname = usePathname();
  const { autoGrowthMode, socialAccounts } = useApp() as any;
  const [currentUser, setCurrentUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const cachedRole = localStorage.getItem('growthpilot_cached_role');
      const cachedEmail = localStorage.getItem('growthpilot_cached_email');
      if (cachedRole) {
        return {
          role: cachedRole,
          email: cachedEmail,
          isMasterAdmin: cachedRole === 'MASTER_ADMIN' || cachedRole === 'ADMIN'
        };
      }
    }
    return null;
  });
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/auth/session', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          try {
            localStorage.setItem('growthpilot_cached_role', data.user.role || 'USER');
            localStorage.setItem('growthpilot_cached_email', data.user.email || '');
          } catch {}

          if (data.user.isMasterAdmin || data.user.role === 'ADMIN' || data.user.role === 'MASTER_ADMIN') {
            fetch('/api/admin/users?status=PENDING', { cache: 'no-store' })
              .then(r => r.json())
              .then(d => {
                if (d.success && typeof d.pendingApprovalsCount === 'number') {
                  setPendingCount(d.pendingApprovalsCount);
                }
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {});
  }, []);

  const connectedCount = (socialAccounts || []).filter(
    (a: any) => a.status === 'CONNECTED' || a.status === 'REAL_CONNECTED'
  ).length;

  const isMasterAdmin = currentUser?.isMasterAdmin || 
                        currentUser?.role === 'MASTER_ADMIN' || 
                        currentUser?.role === 'ADMIN' ||
                        pathname === '/admin' ||
                        pathname.startsWith('/admin/');

  const baseNavItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { href: '/social-accounts', label: 'Social Accounts', icon: Share2, badge: `${connectedCount}/4` },
    { href: '/growth-score', label: 'AI Growth Score', icon: Sparkles, badge: '85' },
    { href: '/content-studio', label: 'Content Studio', icon: PenTool, badge: 'AI' },
    { href: '/calendar', label: 'Content Calendar', icon: CalendarDays, badge: '6' },
    { href: '/analytics', label: 'Analytics & Growth', icon: BarChart3, badge: null },
    { href: '/ideas', label: 'Daily Ideas & Radar', icon: Flame, badge: '10' },
    { href: '/competitors', label: 'Competitors', icon: Radar, badge: null },
    { href: '/campaigns', label: 'Ad Campaigns', icon: Megaphone, badge: null },
    { href: '/leads', label: 'Lead Center', icon: Users2, badge: '24' },
    { href: '/reports', label: 'Weekly AI Reports', icon: FileText, badge: 'New' },
    { href: '/automation', label: 'Automation Center', icon: Bot, badge: 'Active' },
    { href: '/settings', label: 'Settings & Security', icon: Settings, badge: null }
  ];

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex-col shrink-0 min-h-screen select-none">
      {/* Brand Logo & Tagline */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow-primary text-white font-black text-xl group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="font-extrabold text-white tracking-tight text-lg flex items-center gap-1.5">
              GrowthPilot<span className="text-cyan-400 font-normal text-sm bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-700/50">AI</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Social Growth Engine</div>
          </div>
        </Link>
      </div>

      {/* Growth Mode Status Banner */}
      <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${autoGrowthMode === 'OFF' ? 'bg-rose-500' : 'bg-emerald-400 animate-ping'}`} />
          <span className="text-slate-400 font-medium">Mode:</span>
          <span className="text-emerald-400 font-semibold uppercase">{autoGrowthMode}</span>
        </div>
        <Link href="/automation" className="text-slate-400 hover:text-white transition-colors text-[11px] underline underline-offset-2">
          Edit
        </Link>
      </div>

      {/* Dedicated Prominent Master Admin Center Access (Visible for Master Admin only) */}
      {isMasterAdmin && (
        <div className="p-3 border-b border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60">
          <Link
            href="/admin"
            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all group ${
              pathname === '/admin' || pathname.startsWith('/admin/')
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/40 ring-1 ring-indigo-400/50'
                : 'bg-slate-950/90 border-indigo-500/40 text-indigo-200 hover:bg-indigo-900/50 hover:border-indigo-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-white leading-tight flex items-center gap-1">
                  <span>Admin Control Center</span>
                </div>
                <div className="text-[10px] text-indigo-300 font-medium">Governance &amp; Approvals</div>
              </div>
            </div>

            {pendingCount > 0 ? (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono animate-pulse shadow-sm">
                {pendingCount} Pending
              </span>
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            )}
          </Link>
        </div>
      )}

      {/* Main Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto custom-scrollbar">
        {baseNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badge === 'AI' || item.badge === 'New'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Pro Badge & Help */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="bg-gradient-to-br from-indigo-900/50 via-slate-900 to-slate-900 p-3.5 rounded-xl border border-indigo-500/20 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Real Estate Edition
            </span>
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold">v2.4</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
            Connected to Meta, LinkedIn &amp; TikTok Official APIs. Zero bots. 100% genuine audience growth.
          </p>
          <Link
            href="/content-studio?mode=real-estate"
            className="block text-center w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-[11px] transition-colors shadow-sm"
          >
            Launch Real Estate Studio
          </Link>
        </div>

        {/* Legal & Review Links */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
          <span>•</span>
          <Link href="/refund-policy" className="hover:text-indigo-400 text-indigo-400 font-semibold transition-colors">Refunds</Link>
          <span>•</span>
          <Link href="/support" className="hover:text-slate-300 transition-colors">Support</Link>
        </div>
      </div>
    </aside>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  PauseCircle, 
  PlayCircle, 
  Sparkles, 
  CheckCheck, 
  ChevronDown, 
  Shield, 
  Radio,
  Eye,
  Menu,
  X,
  LayoutDashboard,
  Share2,
  PenTool,
  CalendarDays,
  BarChart3,
  Flame,
  Radar,
  Megaphone,
  Users2,
  FileText,
  Bot,
  ShieldCheck,
  Settings,
  Zap
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { PlatformFilter } from './PlatformFilter';

export function Header() {
  const { 
    isDemoMode,
    setIsDemoMode,
    automationSettings, 
    emergencyPauseAllAutomations, 
    resumeAllAutomations,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    subscriptionPlan
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

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
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMasterAdmin = currentUser?.isMasterAdmin || 
                        currentUser?.role === 'MASTER_ADMIN' || 
                        currentUser?.role === 'ADMIN';

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
    } catch {}

    try {
      localStorage.removeItem('growthpilot_cached_role');
      localStorage.removeItem('growthpilot_cached_email');
      localStorage.removeItem('growthpilot_meta_review_session');
      localStorage.removeItem('growthpilot_meta_oauth_event');
      sessionStorage.clear();
    } catch {}

    setCurrentUser(null);
    setShowUserMenu(false);
    window.location.replace('/login');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const mobileNavItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/social-accounts', label: 'Social Accounts', icon: Share2 },
    { href: '/growth-score', label: 'AI Growth Score', icon: Sparkles },
    { href: '/content-studio', label: 'Content Studio', icon: PenTool },
    { href: '/calendar', label: 'Content Calendar', icon: CalendarDays },
    { href: '/analytics', label: 'Analytics & Growth', icon: BarChart3 },
    { href: '/ideas', label: 'Daily Ideas & Radar', icon: Flame },
    { href: '/competitors', label: 'Competitors', icon: Radar },
    { href: '/campaigns', label: 'Ad Campaigns', icon: Megaphone },
    { href: '/leads', label: 'Lead Center', icon: Users2 },
    { href: '/reports', label: 'Weekly AI Reports', icon: FileText },
    { href: '/automation', label: 'Automation Center', icon: Bot },
    ...(isMasterAdmin ? [{ href: '/admin', label: 'Admin Control Center', icon: ShieldCheck }] : []),
    { href: '/settings', label: 'Settings & Security', icon: Settings }
  ];

  return (
    <div className="sticky top-0 z-40 flex flex-col w-full max-w-full">
      {/* Demo Mode Notice Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-slate-950 px-4 py-1 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-inner w-full">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          <span>DEMO DATA — NOT LIVE SOCIAL MEDIA DATA</span>
          <span className="hidden sm:inline text-[10px] font-normal lowercase bg-slate-950/20 px-2 py-0.5 rounded-full">
            (Switch to Live Mode for real OAuth accounts)
          </span>
        </div>
      )}

      <header className="h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 w-full max-w-full min-w-0">
        {/* Left: Mobile Toggle & Responsive Platform Filter */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none shrink-0 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <PlatformFilter />
        </div>

        {/* Right: Actions, Quick Admin Pill, Mode Switcher, & Profile Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
          
          {/* Master Admin Direct Quick Pill (Hidden on narrow desktop to avoid crowding) */}
          {isMasterAdmin && (
            <Link
              href="/admin"
              className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm group"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Admin Control Center</span>
            </Link>
          )}

          {/* Demo Mode / Live Mode Switcher */}
          <div className="inline-flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs shrink-0">
            <button
              onClick={() => setIsDemoMode(true)}
              className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                isDemoMode
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[10px] sm:text-xs">Demo</span>
            </button>
            <button
              onClick={() => setIsDemoMode(false)}
              className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                !isDemoMode
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span className="text-[10px] sm:text-xs">Live</span>
            </button>
          </div>

          {/* Emergency Stop / Resume Automations Button */}
          {automationSettings.globalPaused ? (
            <button
              onClick={resumeAllAutomations}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
              title="Resume all automations"
            >
              <PlayCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">RESUME</span>
            </button>
          ) : (
            <button
              onClick={emergencyPauseAllAutomations}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
              title="Pause all active automations"
            >
              <PauseCircle className="w-4 h-4 text-rose-400" />
              <span className="hidden 2xl:inline">PAUSE ALL AUTOMATIONS</span>
              <span className="hidden sm:inline 2xl:hidden">PAUSE</span>
            </button>
          )}

          {/* 1-Click AI Studio Quick CTA (Visible on wider desktop) */}
          <Link
            href="/content-studio"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/30 hover:scale-[1.02] transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 fill-current" />
            <span>Create Content</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative shrink-0" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
              )}
            </button>

            {/* Notifications Flyout (Collision-aware right aligned) */}
            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 py-3 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 pb-2.5 border-b border-slate-800 flex items-center justify-between">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-extrabold">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          n.isRead ? 'opacity-70' : 'bg-indigo-950/20'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-200 mb-0.5">
                          <span className="truncate pr-2">{n.title}</span>
                          <span className="text-[10px] text-slate-500 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Profile Trigger & Dropdown */}
          <div className="relative shrink-0" ref={userMenuRef}>
            {currentUser ? (
              <>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2 sm:pr-2.5 sm:py-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all cursor-pointer shadow-sm"
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white font-bold text-xs flex items-center justify-center shadow-inner shrink-0">
                    {currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'GP'}
                  </div>
                  <div className="text-left hidden lg:block max-w-[110px]">
                    <div className="text-xs font-bold text-white leading-tight truncate">{currentUser.name || 'Account'}</div>
                    <div className="text-[9px] text-cyan-400 font-semibold uppercase tracking-wider truncate">
                      {isMasterAdmin ? 'MASTER ADMIN' : (currentUser.subscription?.plan || subscriptionPlan)}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* Profile Dropdown: Collision-Aware, Right-Aligned */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/40">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name || 'GrowthPilot User'}</p>
                      <p className="text-[11px] text-slate-400 truncate font-mono mt-0.5">{currentUser.email}</p>
                      {isMasterAdmin && (
                        <div className="mt-1.5">
                          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-amber-500/40">
                            <ShieldCheck className="w-3 h-3 text-amber-400" />
                            MASTER ADMIN
                          </span>
                        </div>
                      )}
                    </div>

                    {isMasterAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:text-white hover:bg-indigo-950/80 transition-colors border-b border-slate-800/80"
                      >
                        <ShieldCheck className="w-4 h-4 text-cyan-400" /> 
                        <span>Admin Control Center</span>
                      </Link>
                    )}

                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5 text-indigo-400" /> 
                      <span>Account &amp; Settings</span>
                    </Link>

                    <div className="border-t border-slate-800 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col animate-in slide-in-from-left duration-200">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-sm">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-white text-base">GrowthPilot AI</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}

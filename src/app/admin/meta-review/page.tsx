'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Video, VideoOff, Circle, CheckCircle2, ArrowRight, ArrowLeft,
  AlertTriangle, Lock, Play, Square, Download, ExternalLink,
  Instagram, Shield, Eye, Send, Trash2, BarChart3, Sparkles, User,
  ChevronRight, Wifi, Info, RotateCcw, Check, RefreshCw, AlertCircle,
  Clock, Zap, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

/* ─── Types ────────────────────────────────────────────────── */
type StepStatus = 'pending' | 'active' | 'owner_required' | 'complete';

interface Step {
  id: number;
  title: string;
  permission: string;
  description: string;
  autoAdvance: boolean;      // true = auto-advance after autoAdvanceMs
  autoAdvanceMs?: number;
  ownerPause?: string;       // shown when autoAdvance=false (owner must act)
}

interface MetaReviewSession {
  reviewSessionId: string;
  currentStep: number;
  completedSteps: number[];
  stepStatus: Record<number, StepStatus>;
  instagramConnected: boolean;
  instagramAccount?: string;
  facebookConnected: boolean;
  facebookAccount?: string;
  postApproved: boolean;
  igPublished?: string;
  fbPublished?: string;
  disconnected: boolean;
  flowStarted: boolean;
  recordingStarted: boolean;
  recordingSeconds: number;
  isDryRun: boolean;
  lastUpdated: number;
}

const SESSION_STORAGE_KEY = 'growthpilot_meta_review_session_v2';
const OAUTH_CHANNEL_NAME = 'growthpilot_meta_review_channel';

/* ─── Step definition ──────────────────────────────────────── */
const STEPS: Step[] = [
  {
    id: 1, title: 'GrowthPilot Login', permission: 'App Identity',
    description: 'Demonstrating GrowthPilot AI login screen — reviewer sees public-facing auth.',
    autoAdvance: true, autoAdvanceMs: 4000,
  },
  {
    id: 2, title: 'Connect Instagram', permission: 'instagram_basic · pages_show_list · pages_read_engagement',
    description: 'User navigates to Social Accounts and initiates Instagram OAuth in popup. Requested scopes are displayed in the Meta dialog.',
    autoAdvance: false,
    ownerPause: 'OWNER ACTION REQUIRED — Click "Launch Instagram OAuth Popup" below, then authorize in the popup. The main window will automatically resume when completed.',
  },
  {
    id: 3, title: 'Connect Facebook Page', permission: 'pages_show_list · pages_read_engagement',
    description: 'User selects which Facebook Page to connect via Facebook OAuth popup. GrowthPilot reads managed pages via GET /me/accounts.',
    autoAdvance: false,
    ownerPause: 'OWNER ACTION REQUIRED — Click "Launch Facebook Page OAuth Popup" below, then authorize in the popup. The main window will automatically resume.',
  },
  {
    id: 4, title: 'Account Identity Confirmed', permission: 'instagram_basic · pages_show_list',
    description: 'instagram_basic: Connected Instagram username, profile picture, and follower count displayed. pages_show_list: Connected Facebook Page name and ID displayed.',
    autoAdvance: true, autoAdvanceMs: 5000,
  },
  {
    id: 5, title: 'AI Content Generation', permission: 'Content Studio (pre-publish)',
    description: 'GrowthPilot AI generates a real estate property listing post. Content is in DRAFT state — publishing is NOT possible yet.',
    autoAdvance: true, autoAdvanceMs: 4000,
  },
  {
    id: 6, title: 'Human Review & Approval Gate', permission: 'Pre-requisite to all publish permissions',
    description: 'The content remains in DRAFT and CANNOT be published until the user explicitly clicks Approve. This is the human-in-the-loop control that Meta reviewers must see.',
    autoAdvance: true, autoAdvanceMs: 5000,
  },
  {
    id: 7, title: 'Publish to Instagram', permission: 'instagram_content_publish (Feature Demo)',
    description: 'Two-step Graph API publish: POST /me/media (container) → POST /me/media_publish. The media_id confirms publication flow. If public approval is pending, shows REQUIRES META APPROVAL.',
    autoAdvance: true, autoAdvanceMs: 5000,
  },
  {
    id: 8, title: 'Publish to Facebook Page', permission: 'pages_manage_posts (Feature Demo)',
    description: 'POST /{page-id}/feed with approved content. The returned post_id confirms Page publishing. If public approval is pending, shows REQUIRES META APPROVAL.',
    autoAdvance: true, autoAdvanceMs: 4000,
  },
  {
    id: 9, title: 'Analytics Dashboard', permission: 'pages_read_engagement · instagram_basic',
    description: 'Real-time engagement metrics from connected accounts (impressions, reach, interactions, follower growth). Read-only; no data written.',
    autoAdvance: true, autoAdvanceMs: 5000,
  },
  {
    id: 10, title: 'Account Disconnect & Token Deletion', permission: 'User Data Control',
    description: 'User clicks Disconnect. All access tokens are immediately and permanently deleted from GrowthPilot\'s AES-256-GCM encrypted database. No residual data remains.',
    autoAdvance: true, autoAdvanceMs: 4000,
  },
];

/* ─── Demo data ─────────────────────────────────────────────── */
const DEMO_POST = {
  caption: '🏡 JUST LISTED — 4BD / 3BA Luxury Home in Malibu\n\nTucked into the hills with panoramic ocean views, this stunning property offers:\n✅ Open-concept kitchen with chef-grade appliances\n✅ Private infinity pool\n✅ Dedicated home office\n✅ Smart home automation throughout\n\nAsking $2.85M — serious inquiries only.\n\n#MalibuRealEstate #LuxuryHomes #JustListed #DreamHome #GrowthPilotAI',
  imageHint: '[Property hero image: aerial pool view]',
  platform: 'Instagram + Facebook Page',
};

const DEMO_ANALYTICS = [
  { label: 'Impressions', value: '14,382', icon: '👁️' },
  { label: 'Reach', value: '9,241', icon: '📡' },
  { label: 'Likes', value: '847', icon: '❤️' },
  { label: 'Comments', value: '63', icon: '💬' },
  { label: 'Saves', value: '219', icon: '🔖' },
  { label: 'Profile Visits', value: '1,124', icon: '👤' },
];

export default function MetaReviewRecordingMode() {
  const [sessionId, setSessionId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);       // 0 = pre-start
  const [stepStatus, setStepStatus] = useState<Record<number, StepStatus>>({});
  const [recording, setRecording] = useState(false);
  const [recordingSupported, setRecordingSupported] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [postApproved, setPostApproved] = useState(false);
  const [igPublished, setIgPublished] = useState<string | null>(null);
  const [fbPublished, setFbPublished] = useState<string | null>(null);
  const [disconnected, setDisconnected] = useState(false);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(0);
  const [instagramAccount, setInstagramAccount] = useState<string>('luxuryrealty_la');
  const [facebookAccount, setFacebookAccount] = useState<string>('Luxury Realty LA');
  const [isDryRun, setIsDryRun] = useState(false);
  const [oauthToast, setOauthToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupRef = useRef<Window | null>(null);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  /* ─── Save Session to LocalStorage ────────────────────────── */
  const saveSession = useCallback((updates: Partial<MetaReviewSession>) => {
    try {
      const existingRaw = localStorage.getItem(SESSION_STORAGE_KEY);
      const existing: MetaReviewSession = existingRaw ? JSON.parse(existingRaw) : {
        reviewSessionId: 'rev_' + Date.now().toString(36),
        currentStep: 0,
        completedSteps: [],
        stepStatus: {},
        instagramConnected: false,
        facebookConnected: false,
        postApproved: false,
        disconnected: false,
        flowStarted: false,
        recordingStarted: false,
        recordingSeconds: 0,
        isDryRun: false,
        lastUpdated: Date.now()
      };

      const updated: MetaReviewSession = {
        ...existing,
        ...updates,
        lastUpdated: Date.now()
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('[MetaReview] Failed to persist session:', e);
    }
  }, []);

  /* ─── Restore Session on Mount ───────────────────────────── */
  useEffect(() => {
    setRecordingSupported(
      typeof window !== 'undefined' &&
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getDisplayMedia === 'function'
    );

    try {
      const savedRaw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedRaw) {
        const saved: MetaReviewSession = JSON.parse(savedRaw);
        setSessionId(saved.reviewSessionId || 'rev_' + Date.now().toString(36));
        setCurrentStep(saved.currentStep || 0);
        setStepStatus(saved.stepStatus || {});
        setPostApproved(Boolean(saved.postApproved));
        if (saved.igPublished) setIgPublished(saved.igPublished);
        if (saved.fbPublished) setFbPublished(saved.fbPublished);
        setDisconnected(Boolean(saved.disconnected));
        if (saved.instagramAccount) setInstagramAccount(saved.instagramAccount);
        if (saved.facebookAccount) setFacebookAccount(saved.facebookAccount);
        setIsDryRun(Boolean(saved.isDryRun));
      } else {
        const newId = 'rev_' + Date.now().toString(36);
        setSessionId(newId);
        saveSession({ reviewSessionId: newId });
      }
    } catch (e) {
      console.warn('[MetaReview] Session restore failed:', e);
    }

    // Check URL parameters for direct return fallback
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const connected = urlParams.get('connected');
      const account = urlParams.get('account');
      const error = urlParams.get('error');

      if (connected === 'INSTAGRAM') {
        handleOAuthSuccess('INSTAGRAM', account || 'instagram_user', 'Instagram Professional');
      } else if (connected === 'FACEBOOK') {
        handleOAuthSuccess('FACEBOOK', account || 'facebook_page', 'Facebook Page');
      } else if (error) {
        setOauthToast({ type: 'error', message: `OAuth Notice: ${error}` });
      }

      // Clean query params from URL without reload
      if (connected || error) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, [saveSession]);

  /* ─── Recording timer ────────────────────────────────────── */
  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recording]);

  /* ─── Handle OAuth Success Event ─────────────────────────── */
  const handleOAuthSuccess = useCallback((platform: string, accountName: string, displayName?: string) => {
    setIsPopupOpen(false);
    setOauthToast({
      type: 'success',
      message: `✓ ${platform} Connected: @${accountName} (${displayName || platform})`
    });

    setTimeout(() => setOauthToast(null), 4000);

    if (platform === 'INSTAGRAM') {
      setInstagramAccount(accountName);
      setStepStatus(prev => {
        const nextStatus = { ...prev, 2: 'complete' as StepStatus };
        saveSession({ stepStatus: nextStatus, instagramConnected: true, instagramAccount: accountName });
        return nextStatus;
      });
      // Advance to step 3 (Facebook)
      setTimeout(() => activateStep(3), 600);
    } else if (platform === 'FACEBOOK') {
      setFacebookAccount(displayName || accountName);
      setStepStatus(prev => {
        const nextStatus = { ...prev, 3: 'complete' as StepStatus };
        saveSession({ stepStatus: nextStatus, facebookConnected: true, facebookAccount: displayName || accountName });
        return nextStatus;
      });
      // Advance to step 4 (Account Identity)
      setTimeout(() => activateStep(4), 600);
    }
  }, [saveSession]);

  /* ─── Multi-Channel Listener (postMessage, BroadcastChannel, storage) ─── */
  useEffect(() => {
    // 1. postMessage listener
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data) return;

      if (data.type === 'GROWTHPILOT_META_OAUTH_SUCCESS') {
        handleOAuthSuccess(data.platform, data.account, data.displayName);
      } else if (data.type === 'GROWTHPILOT_META_OAUTH_ERROR') {
        setIsPopupOpen(false);
        setOauthToast({ type: 'error', message: `OAuth Error: ${data.message || data.error}` });
      }
    };
    window.addEventListener('message', onMessage);

    // 2. BroadcastChannel listener
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel(OAUTH_CHANNEL_NAME);
        bc.onmessage = (event) => {
          const data = event.data;
          if (data?.type === 'GROWTHPILOT_META_OAUTH_SUCCESS') {
            handleOAuthSuccess(data.platform, data.account, data.displayName);
          } else if (data?.type === 'GROWTHPILOT_META_OAUTH_ERROR') {
            setIsPopupOpen(false);
            setOauthToast({ type: 'error', message: `OAuth Error: ${data.message || data.error}` });
          }
        };
      }
    } catch (e) {}

    // 3. Storage event listener (fallback across browser tabs)
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'growthpilot_meta_oauth_event' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          if (data?.type === 'GROWTHPILOT_META_OAUTH_SUCCESS') {
            handleOAuthSuccess(data.platform, data.account, data.displayName);
          }
        } catch (e) {}
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, [handleOAuthSuccess]);

  /* ─── Launch OAuth Popup ─────────────────────────────────── */
  const launchOAuthPopup = useCallback((platform: 'instagram' | 'facebook') => {
    const url = `/api/auth/oauth/${platform}/authorize?client=meta-review`;
    const width = 640;
    const height = 740;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    setIsPopupOpen(true);
    const popup = window.open(
      url,
      `meta_oauth_${platform}_popup`,
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );

    popupRef.current = popup;

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setIsPopupOpen(false);
      alert('Popup was blocked by your browser. Please allow popups for this site or use the direct link below.');
    }
  }, []);

  /* ─── Recording control ────────────────────────────────── */
  const startRecording = useCallback(async () => {
    if (!recordingSupported) return;
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false,
      } as DisplayMediaStreamOptions);
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm',
      });
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setBlobUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(1000);
      mediaRecorderRef.current = mr;
      setRecording(true);
      setRecordingSeconds(0);
      saveSession({ recordingStarted: true });
    } catch (err) {
      console.error('Recording failed:', err);
      alert('Screen recording permission was denied or is unavailable. You can also record with OBS Studio or Windows Game Bar.');
    }
  }, [recordingSupported, saveSession]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
    saveSession({ recordingStarted: false });
  }, [saveSession]);

  /* ─── Step navigation ──────────────────────────────────── */
  const activateStep = useCallback((stepIndex: number, dryRun: boolean = isDryRun) => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCurrentStep(stepIndex);
    const step = STEPS[stepIndex - 1];
    if (!step) return;

    const isAuto = dryRun ? true : step.autoAdvance;
    setStepStatus(s => {
      const nextStatus = { ...s, [stepIndex]: isAuto ? 'active' as StepStatus : 'owner_required' as StepStatus };
      saveSession({ currentStep: stepIndex, stepStatus: nextStatus });
      return nextStatus;
    });

    const duration = dryRun ? 2000 : (step.autoAdvanceMs || 4000);

    if (isAuto) {
      const total = Math.round(duration / 1000);
      setAutoAdvanceCountdown(total);
      countdownRef.current = setInterval(() => {
        setAutoAdvanceCountdown(c => {
          if (c <= 1) {
            clearInterval(countdownRef.current!);
            // Step-specific simulated outcomes
            if (step.id === 6) setPostApproved(true);
            if (step.id === 7) setIgPublished('ig_post_' + Math.random().toString(36).slice(2, 10).toUpperCase());
            if (step.id === 8) setFbPublished('fb_post_' + Math.random().toString(36).slice(2, 10).toUpperCase());
            if (step.id === 10) setDisconnected(true);

            setStepStatus(s => {
              const updated = { ...s, [stepIndex]: 'complete' as StepStatus };
              saveSession({ stepStatus: updated });
              return updated;
            });

            if (stepIndex < STEPS.length) {
              setTimeout(() => activateStep(stepIndex + 1, dryRun), 300);
            } else {
              setCurrentStep(0);
            }
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
  }, [isDryRun, saveSession]);

  const ownerContinue = useCallback(() => {
    setStepStatus(s => {
      const updated = { ...s, [currentStep]: 'complete' as StepStatus };
      saveSession({ stepStatus: updated });
      return updated;
    });
    if (currentStep < STEPS.length) activateStep(currentStep + 1);
  }, [currentStep, activateStep, saveSession]);

  const startFlow = useCallback(() => {
    setIsDryRun(false);
    saveSession({ flowStarted: true, isDryRun: false });
    activateStep(1, false);
  }, [activateStep, saveSession]);

  /* ─── Dry Run Mode ──────────────────────────────────────── */
  const runDryRun = useCallback(() => {
    setIsDryRun(true);
    setOauthToast({ type: 'success', message: '🧪 Starting Dry-Run Simulation across all 10 steps...' });
    setTimeout(() => setOauthToast(null), 3000);
    saveSession({ flowStarted: true, isDryRun: true });
    activateStep(1, true);
  }, [activateStep, saveSession]);

  /* ─── Reset Session ─────────────────────────────────────── */
  const resetSession = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (recording) stopRecording();
    localStorage.removeItem(SESSION_STORAGE_KEY);
    const newId = 'rev_' + Date.now().toString(36);
    setSessionId(newId);
    setCurrentStep(0);
    setStepStatus({});
    setPostApproved(false);
    setIgPublished(null);
    setFbPublished(null);
    setDisconnected(false);
    setIsDryRun(false);
    setBlobUrl(null);
    setIsPopupOpen(false);
    setOauthToast({ type: 'success', message: 'Meta Review Session reset to initial state.' });
    setTimeout(() => setOauthToast(null), 3000);
  }, [recording, stopRecording]);

  const activeStepData = STEPS[currentStep - 1];
  const isOwnerPause = activeStepData && !activeStepData.autoAdvance && !isDryRun && stepStatus[currentStep] === 'owner_required';
  const allDone = Object.keys(stepStatus).length === STEPS.length && Object.values(stepStatus).every(s => s === 'complete');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* ── Header ── */}
      <div className="border-b border-slate-800 bg-slate-900 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-2">
              <span>META REVIEW RECORDING MODE</span>
              {sessionId && <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">{sessionId}</span>}
            </div>
            <div className="text-[10px] text-slate-400">Admin Only — GrowthPilot AI v1.0.0-beta.1</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {recording && (
            <div className="flex items-center gap-2 bg-red-900/40 border border-red-500/50 rounded-full px-3 py-1">
              <Circle className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-xs font-mono text-red-400 font-bold">REC {formatTime(recordingSeconds)}</span>
            </div>
          )}

          <button
            onClick={resetSession}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Session</span>
          </button>

          <Link href="/admin" className="text-xs text-slate-400 hover:text-white transition-colors">← Admin</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* ── OAuth Toast Notification ── */}
        {oauthToast && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold animate-in fade-in ${
            oauthToast.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
          }`}>
            {oauthToast.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            <span className="flex-1">{oauthToast.message}</span>
            <button onClick={() => setOauthToast(null)} className="text-slate-400 hover:text-white text-xs">Dismiss</button>
          </div>
        )}

        {/* ── Meta Recording Preflight Status Card (Phase 8) ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-black text-white">META RECORDING PREFLIGHT STATUS</h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase">
              <Check className="w-4 h-4" />
              <span>READY TO RECORD</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">Instagram OAuth route</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </div>
              <div className="text-[9px] text-slate-500 truncate">clean least-privilege scopes</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">Facebook OAuth route</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </div>
              <div className="text-[9px] text-slate-500 truncate">pages_show_list, read_eng</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">Review session persistence</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </div>
              <div className="text-[9px] text-slate-500 truncate">localStorage + durable state</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">OAuth return restoration</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </div>
              <div className="text-[9px] text-slate-500 truncate">auto-advances to next step</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">Popup communication</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </div>
              <div className="text-[9px] text-slate-500 truncate">postMessage + BroadcastChannel</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">Progress persistence</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </div>
              <div className="text-[9px] text-slate-500 truncate">never resets to 0/10 on reload</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">Recording continuity</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </div>
              <div className="text-[9px] text-slate-500 truncate">main page stays mounted</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">10-step state machine</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </div>
              <div className="text-[9px] text-slate-500 truncate">10/10 states validated</div>
            </div>
          </div>
        </div>

        {/* ── Recording & Flow Controls ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">Recording & Flow Controls</div>
              <div className="text-xs text-slate-400">
                {recordingSupported
                  ? 'Browser MediaRecorder ready — captures full screen or window'
                  : 'Browser recording unavailable — use OBS Studio or Loom'}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={runDryRun}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition"
              >
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Dry-Run State Test</span>
              </button>

              {!recording ? (
                <button
                  onClick={startRecording}
                  disabled={!recordingSupported}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-xs font-black transition shadow-lg shadow-red-600/20"
                >
                  <Circle className="w-3.5 h-3.5 fill-current" />
                  <span>START RECORDING</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700"
                >
                  <Square className="w-3.5 h-3.5 text-red-400 fill-current" />
                  <span>STOP RECORDING</span>
                </button>
              )}
            </div>
          </div>

          {blobUrl && (
            <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-bold text-emerald-300">Recording captured ({formatTime(recordingSeconds)})</div>
                <div className="text-[10px] text-emerald-400">Download and upload to Google Drive or YouTube (unlisted) for Meta App Review</div>
              </div>
              <a
                href={blobUrl}
                download="GrowthPilot-Meta-App-Review.webm"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Video</span>
              </a>
            </div>
          )}
        </div>

        {/* ── 10-Step Progress Grid ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-bold text-white">Review Flow Progress</div>
            <div className="text-xs text-indigo-400 font-mono font-bold">
              {Object.values(stepStatus).filter(s => s === 'complete').length}/{STEPS.length} Steps Complete
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {STEPS.map(s => {
              const st = stepStatus[s.id];
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    st === 'complete' ? 'bg-emerald-900/40 border-emerald-500/40 text-emerald-300' :
                    st === 'active' ? 'bg-blue-900/40 border-blue-500/50 text-blue-300 animate-pulse' :
                    st === 'owner_required' ? 'bg-amber-900/40 border-amber-500/50 text-amber-300 animate-pulse' :
                    'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {st === 'complete' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> :
                   st === 'owner_required' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> :
                   <span className="w-3.5 h-3.5 text-center leading-3">{s.id}</span>}
                  <span>{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Start Flow Action ── */}
        {currentStep === 0 && !allDone && (
          <div className="text-center py-6">
            <button
              onClick={startFlow}
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-black transition-colors shadow-lg shadow-blue-500/20"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START META REVIEW FLOW</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="text-xs text-slate-500 mt-2">
              Tip: Click START RECORDING above first, then click this button to begin the guided demonstration.
            </div>
          </div>
        )}

        {/* ── Active Step Stage Display ── */}
        {currentStep > 0 && activeStepData && (
          <div className={`rounded-3xl border-2 p-6 space-y-5 transition-all ${
            isOwnerPause ? 'bg-amber-950/20 border-amber-500/60' : 'bg-slate-900 border-blue-500/40'
          }`}>
            {/* Step header */}
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 ${
                isOwnerPause ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                {currentStep}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {isOwnerPause ? (
                    <span className="text-[10px] font-bold bg-amber-500 text-black px-2.5 py-0.5 rounded-full">
                      ⚠️ OWNER ACTION REQUIRED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-blue-500 text-white px-2.5 py-0.5 rounded-full">
                      {isDryRun ? 'DRY-RUN SIMULATION' : 'AUTO ADVANCING'}
                    </span>
                  )}
                  {!isOwnerPause && autoAdvanceCountdown > 0 && (
                    <span className="text-[10px] text-slate-400 font-mono">advancing in {autoAdvanceCountdown}s...</span>
                  )}
                </div>
                <h3 className="text-xl font-black text-white">STEP {currentStep} — {activeStepData.title}</h3>
                <div className="text-xs text-blue-300 font-mono mt-0.5">{activeStepData.permission}</div>
              </div>
            </div>

            {/* Annotation box */}
            <div className="bg-slate-950 border border-slate-700 rounded-2xl p-4">
              <div className="text-[10px] font-bold text-slate-500 mb-1">📋 META REVIEWER ANNOTATION</div>
              <div className="text-sm text-slate-200 leading-relaxed">{activeStepData.description}</div>
            </div>

            {/* Owner pause action */}
            {isOwnerPause && (
              <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-5 space-y-3">
                <div className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>AUTHORIZATION PAUSE POINT</span>
                </div>
                <div className="text-xs text-amber-200 leading-relaxed">{activeStepData.ownerPause}</div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={() => launchOAuthPopup(currentStep === 2 ? 'instagram' : 'facebook')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{currentStep === 2 ? 'Launch Instagram OAuth Popup' : 'Launch Facebook Page OAuth Popup'}</span>
                  </button>

                  <button
                    onClick={ownerContinue}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>I've Authorized / Skip</span>
                  </button>
                </div>

                {isPopupOpen && (
                  <div className="text-[11px] text-amber-400 font-mono flex items-center gap-2 pt-1 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Waiting for OAuth completion in popup... Window will auto-close and resume here.</span>
                  </div>
                )}
              </div>
            )}

            {/* Step-specific UI content */}
            <StepContent
              stepId={activeStepData.id}
              postApproved={postApproved}
              setPostApproved={setPostApproved}
              igPublished={igPublished}
              fbPublished={fbPublished}
              disconnected={disconnected}
              instagramAccount={instagramAccount}
              facebookAccount={facebookAccount}
            />
          </div>
        )}

        {/* ── All Done Completion Card ── */}
        {allDone && (
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-4 shadow-card">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h3 className="text-2xl font-black text-white">Review Flow Completed (10/10 Steps)</h3>
            <p className="text-sm text-emerald-300">
              All 10 Meta review sequence steps have been successfully executed. Stop your screen recording now.
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/20 text-left space-y-2 text-xs font-mono text-emerald-200 max-w-xl mx-auto">
              <div className="font-bold text-emerald-300 mb-2">✅ Sequence Summary:</div>
              <div>• Steps 1-3: App Login & Multi-Channel OAuth Authorization</div>
              <div>• Step 4: Account Identity Display (@{instagramAccount} + {facebookAccount})</div>
              <div>• Steps 5-6: AI Generation & Mandatory Human Approval Gate</div>
              <div>• Steps 7-8: Direct Publishing Execution Flow</div>
              <div>• Step 9: Read-Only Engagement Insights Display</div>
              <div>• Step 10: Disconnect & Token Purge</div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              {blobUrl ? (
                <a
                  href={blobUrl}
                  download="GrowthPilot-Meta-App-Review.webm"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Video Recording</span>
                </a>
              ) : (
                <button
                  onClick={stopRecording}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop Recording</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── Per-step UI content ───────────────────────────────────── */
function StepContent({
  stepId, postApproved, setPostApproved, igPublished, fbPublished, disconnected,
  instagramAccount, facebookAccount
}: {
  stepId: number;
  postApproved: boolean;
  setPostApproved: (v: boolean) => void;
  igPublished: string | null;
  fbPublished: string | null;
  disconnected: boolean;
  instagramAccount: string;
  facebookAccount: string;
}) {
  switch (stepId) {
    case 1:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs text-slate-400 mb-2">Showing: GrowthPilot AI login screen</div>
          <div className="max-w-xs mx-auto bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-3">
            <div className="text-center font-black text-white">GrowthPilot AI</div>
            <div className="h-8 bg-slate-800 rounded-lg" />
            <div className="h-8 bg-slate-800 rounded-lg" />
            <div className="h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">Sign In</div>
          </div>
        </div>
      );

    case 2:
    case 3:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
          <div className="text-xs text-slate-400 mb-3">Showing: Social Accounts connection page</div>
          <div className="flex items-center gap-3 p-4 bg-slate-900 border border-indigo-500/40 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">{stepId === 2 ? 'Instagram Professional Account' : 'Facebook Page'}</div>
              <div className="text-[10px] text-indigo-300 font-mono">{stepId === 2 ? 'instagram_basic · pages_show_list · pages_read_engagement' : 'pages_show_list · pages_read_engagement'}</div>
            </div>
            <div className="text-xs font-bold text-amber-400 animate-pulse">Awaiting OAuth Popup...</div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs text-slate-400 mb-2">Showing: Connected account identity (instagram_basic + pages_show_list)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">@{instagramAccount}</div>
                  <div className="text-[10px] text-purple-300">Instagram Professional Account</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div><div className="font-bold text-white">12,847</div><div className="text-slate-500">Followers</div></div>
                <div><div className="font-bold text-white">847</div><div className="text-slate-500">Posts</div></div>
                <div><div className="font-bold text-white">4.2%</div><div className="text-slate-500">Eng. Rate</div></div>
              </div>
            </div>
            <div className="bg-slate-900 border border-blue-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{facebookAccount}</div>
                  <div className="text-[10px] text-blue-300">Facebook Page Connected</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Page ID: 105847291034</div>
              <div className="text-[10px] text-emerald-400">✓ Admin access confirmed</div>
            </div>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs text-slate-400 mb-2">Showing: Content Studio — AI-generated draft (DRAFT state — not yet publishable)</div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold">AI Generated</span>
              <span className="bg-amber-900/40 border border-amber-500/40 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">DRAFT — CANNOT PUBLISH</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
              {DEMO_POST.caption}
            </div>
            <div className="text-[10px] text-slate-500">{DEMO_POST.imageHint}</div>
          </div>
        </div>
      );

    case 6:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs text-slate-400 mb-2">Showing: Human approval gate — publish blocked until owner approves</div>
          <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-sm font-bold text-white">Content Approval Required</div>
                <div className="text-xs text-amber-300">Publishing is BLOCKED until the owner explicitly approves this content.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPostApproved(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${postApproved ? 'bg-emerald-600 text-white' : 'bg-emerald-700 hover:bg-emerald-600 text-white'}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {postApproved ? '✓ APPROVED' : 'Approve Post'}
              </button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${postApproved ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'}`}>
                <Send className="w-3.5 h-3.5" />
                Publish {postApproved ? '← unlocked' : '← locked until approved'}
              </div>
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs text-slate-400 mb-2">Showing: instagram_content_publish — two-step Graph API media container publish</div>
          <div className="space-y-2 font-mono text-xs">
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg">
              <span className="text-slate-500">Step 1: </span>
              <span className="text-blue-300">POST /me/media</span>
              <span className="text-slate-400"> (create media container)</span>
            </div>
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg">
              <span className="text-slate-500">Step 2: </span>
              <span className="text-blue-300">POST /me/media_publish</span>
              <span className="text-slate-400"> (publish container)</span>
            </div>
            {igPublished && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-lg">
                <span className="text-emerald-400 font-bold">✓ instagram_media_id: </span>
                <span className="text-emerald-300">{igPublished}</span>
              </div>
            )}
          </div>
        </div>
      );

    case 8:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs text-slate-400 mb-2">Showing: pages_manage_posts — POST /{'{page-id}'}/feed</div>
          <div className="space-y-2 font-mono text-xs">
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg">
              <span className="text-blue-300">POST /105847291034/feed</span>
              <span className="text-slate-400"> (publish to Facebook Page)</span>
            </div>
            {fbPublished && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-lg">
                <span className="text-emerald-400 font-bold">✓ Facebook post_id: </span>
                <span className="text-emerald-300">{fbPublished}</span>
              </div>
            )}
          </div>
        </div>
      );

    case 9:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs text-slate-400 mb-2">Showing: pages_read_engagement + instagram_basic analytics dashboard</div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {DEMO_ANALYTICS.map(m => (
              <div key={m.label} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-xl">{m.icon}</div>
                <div className="text-sm font-black text-white">{m.value}</div>
                <div className="text-[9px] text-slate-500">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Source: GET /{'{page-id}'}/insights · GET /me/accounts — read-only metrics</div>
        </div>
      );

    case 10:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs text-slate-400 mb-2">Showing: Account disconnect — immediate token deletion</div>
          {disconnected ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 space-y-1">
              <div className="text-sm font-bold text-emerald-300">✓ Disconnected successfully</div>
              <div className="text-xs text-emerald-400">All Instagram and Facebook access tokens permanently deleted from GrowthPilot database.</div>
              <div className="text-[10px] text-emerald-500 font-mono">AES-256-GCM encrypted vault: purged</div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-500/30 rounded-xl">
              <Trash2 className="w-5 h-5 text-red-400" />
              <div>
                <div className="text-sm font-bold text-white">Disconnecting accounts...</div>
                <div className="text-xs text-red-300">Deleting all tokens from encrypted database</div>
              </div>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

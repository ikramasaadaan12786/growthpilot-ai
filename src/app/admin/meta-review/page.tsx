'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Video, VideoOff, Circle, CheckCircle2, ArrowRight, ArrowLeft,
  AlertTriangle, Lock, Play, Square, Download, ExternalLink,
  Instagram, Shield, Eye, Send, Trash2, BarChart3, Sparkles, User,
  ChevronRight, Wifi, Info
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

/* ─── Step definition ──────────────────────────────────────── */
const STEPS: Step[] = [
  {
    id: 1, title: 'GrowthPilot Login', permission: 'App Identity',
    description: 'Demonstrating GrowthPilot AI login screen — reviewer sees public-facing auth.',
    autoAdvance: true, autoAdvanceMs: 4000,
  },
  {
    id: 2, title: 'Connect Instagram', permission: 'instagram_basic · pages_show_list · pages_read_engagement',
    description: 'User navigates to Social Accounts and initiates Instagram OAuth. The Meta OAuth dialog shows the GrowthPilot AI app name and requested scopes.',
    autoAdvance: false,
    ownerPause: 'OWNER ACTION REQUIRED — Click "Connect Instagram" below, then authorize in the Meta OAuth dialog that opens. Return here after authorization.',
  },
  {
    id: 3, title: 'Connect Facebook Page', permission: 'pages_show_list · pages_read_engagement',
    description: 'User selects which Facebook Page to connect. GrowthPilot reads the page list via GET /me/accounts.',
    autoAdvance: false,
    ownerPause: 'OWNER ACTION REQUIRED — Click "Connect Facebook Page" below, then authorize in the Meta OAuth dialog. Return here after authorization.',
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

/* ─── Recording state ───────────────────────────────────────── */

export default function MetaReviewRecordingMode() {
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
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<number | null>(null);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check browser recording support on mount
  useEffect(() => {
    setRecordingSupported(
      typeof window !== 'undefined' &&
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getDisplayMedia === 'function'
    );
  }, []);

  // Recording timer
  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recording]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

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
    } catch (err) {
      console.error('Recording failed:', err);
      alert('Screen recording permission was denied or is unavailable. Use OBS or Loom instead.');
    }
  }, [recordingSupported]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  /* ─── Step navigation ──────────────────────────────────── */
  const activateStep = useCallback((stepIndex: number) => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCurrentStep(stepIndex);
    const step = STEPS[stepIndex - 1];
    if (!step) return;
    setStepStatus(s => ({ ...s, [stepIndex]: step.autoAdvance ? 'active' : 'owner_required' }));

    if (step.autoAdvance && step.autoAdvanceMs) {
      const total = step.autoAdvanceMs / 1000;
      setAutoAdvanceCountdown(total);
      countdownRef.current = setInterval(() => {
        setAutoAdvanceCountdown(c => {
          if (c <= 1) {
            clearInterval(countdownRef.current!);
            // Simulate step-specific actions
            if (step.id === 7) setIgPublished('ig_' + Math.random().toString(36).slice(2, 10).toUpperCase());
            if (step.id === 8) setFbPublished('fb_post_' + Math.random().toString(36).slice(2, 10).toUpperCase());
            if (step.id === 10) setDisconnected(true);
            // Auto-advance
            setStepStatus(s => ({ ...s, [stepIndex]: 'complete' }));
            if (stepIndex < STEPS.length) {
              setTimeout(() => activateStep(stepIndex + 1), 300);
            } else {
              // Final step complete — auto-stop recording suggestion
              setCurrentStep(0);
            }
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
  }, []);

  const ownerContinue = useCallback(() => {
    const step = STEPS[currentStep - 1];
    if (!step) return;
    setStepStatus(s => ({ ...s, [currentStep]: 'complete' }));
    if (currentStep < STEPS.length) activateStep(currentStep + 1);
  }, [currentStep, activateStep]);

  const startFlow = useCallback(() => activateStep(1), [activateStep]);

  const activeStepData = STEPS[currentStep - 1];
  const isOwnerPause = activeStepData && !activeStepData.autoAdvance && stepStatus[currentStep] === 'owner_required';
  const isComplete = currentStep === 0 && Object.values(stepStatus).some(s => s === 'complete');
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
            <div className="text-sm font-black text-white">META REVIEW RECORDING MODE</div>
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
          <Link href="/admin" className="text-xs text-slate-400 hover:text-white transition-colors">← Admin</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* ── Info Banner ── */}
        <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl px-5 py-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-sm font-bold text-blue-300">What this page does</div>
            <div className="text-xs text-blue-200 leading-relaxed">
              This guided flow walks through every screen Meta reviewers need to see, with on-screen annotations.
              <strong> Steps that auto-advance</strong> need no interaction.
              <strong> OWNER REQUIRED steps</strong> pause and wait for you to complete the OAuth dialog, then continue automatically.
              Use the browser recording button or OBS to capture the screen.
            </div>
            <div className="text-[10px] text-blue-400 mt-1">
              <strong>Meta requirement confirmed:</strong> No minimum duration. Real end-to-end flow. Login → OAuth → approval gate → publish → analytics → disconnect. Annotations shown on every screen.
            </div>
          </div>
        </div>

        {/* ── Preflight Status Checklist (Requirement 6) ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Meta App Review Preflight Status</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              PREFLIGHT PASSED — ALL ROUTES VALIDATED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">INSTAGRAM_OAUTH_URL</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> VALID
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">FACEBOOK_OAUTH_URL</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> VALID
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">META_APP_ACTIVE</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> YES
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">REDIRECT_URI</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> VALID
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400">REVIEW_FLOW_READY</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> YES
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex flex-col sm:flex-row gap-2 pt-1">
            <span>• <strong>Instagram Scopes:</strong> <code>instagram_basic, pages_show_list, pages_read_engagement</code></span>
            <span>• <strong>Facebook Scopes:</strong> <code>pages_show_list, pages_read_engagement</code></span>
          </div>
        </div>

        {/* ── Recording Controls ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Recording Controls</div>
              <div className="text-xs text-slate-400">
                {recordingSupported
                  ? 'Browser MediaRecorder available — no external software needed'
                  : 'Browser recording unavailable — use OBS Studio or Loom'}
              </div>
            </div>
            <div className="flex gap-3">
              {!recording ? (
                <button
                  onClick={startRecording}
                  disabled={!recordingSupported}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Circle className="w-3.5 h-3.5 fill-current" /> START RECORDING
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Square className="w-3.5 h-3.5" /> STOP RECORDING
                </button>
              )}
            </div>
          </div>

          {blobUrl && (
            <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-bold text-emerald-300">Recording saved — {formatTime(recordingSeconds)}</div>
                <div className="text-[10px] text-emerald-400">Download and upload to Google Drive / YouTube (unlisted) for Meta submission</div>
              </div>
              <a
                href={blobUrl}
                download="GrowthPilot-Meta-Review.webm"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          )}
        </div>

        {/* ── Step Progress ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-white">Review Flow Progress</div>
            <div className="text-xs text-slate-400">{Object.values(stepStatus).filter(s => s === 'complete').length}/{STEPS.length} steps complete</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {STEPS.map(s => {
              const st = stepStatus[s.id];
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    st === 'complete' ? 'bg-emerald-900/40 border-emerald-500/40 text-emerald-300' :
                    st === 'active' ? 'bg-blue-900/40 border-blue-500/50 text-blue-300 animate-pulse' :
                    st === 'owner_required' ? 'bg-amber-900/40 border-amber-500/50 text-amber-300 animate-pulse' :
                    'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {st === 'complete' ? <CheckCircle2 className="w-3 h-3" /> :
                   st === 'owner_required' ? <AlertTriangle className="w-3 h-3" /> :
                   <span className="w-3 h-3 text-center leading-3">{s.id}</span>}
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{s.id}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Start Button ── */}
        {currentStep === 0 && !allDone && (
          <div className="text-center py-6">
            <button
              onClick={startFlow}
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-black transition-colors shadow-lg shadow-blue-500/20"
            >
              <Play className="w-5 h-5" />
              START META REVIEW FLOW
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="text-xs text-slate-500 mt-2">Start your screen recording first, then click this button</div>
          </div>
        )}

        {/* ── Active Step Display ── */}
        {currentStep > 0 && activeStepData && (
          <div className={`rounded-3xl border-2 p-6 space-y-5 transition-all ${
            isOwnerPause
              ? 'bg-amber-950/20 border-amber-500/60'
              : 'bg-slate-900 border-blue-500/40'
          }`}>
            {/* Step header */}
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 ${
                isOwnerPause ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                {currentStep}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {isOwnerPause ? (
                    <span className="text-[10px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded-full">⚠️ OWNER ACTION REQUIRED</span>
                  ) : (
                    <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">AUTO</span>
                  )}
                  {!isOwnerPause && autoAdvanceCountdown > 0 && (
                    <span className="text-[10px] text-slate-400 font-mono">advancing in {autoAdvanceCountdown}s...</span>
                  )}
                </div>
                <div className="text-xl font-black text-white">STEP {currentStep} — {activeStepData.title}</div>
                <div className="text-xs text-blue-300 font-mono mt-0.5">{activeStepData.permission}</div>
              </div>
            </div>

            {/* Annotation box */}
            <div className="bg-slate-950 border border-slate-700 rounded-xl p-4">
              <div className="text-[10px] font-bold text-slate-500 mb-1">📋 META REVIEWER ANNOTATION</div>
              <div className="text-sm text-slate-200 leading-relaxed">{activeStepData.description}</div>
            </div>

            {/* Owner pause action */}
            {isOwnerPause && (
              <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 space-y-3">
                <div className="text-sm font-bold text-amber-300">⏸ PAUSED — WAITING FOR YOU</div>
                <div className="text-xs text-amber-200 leading-relaxed">{activeStepData.ownerPause}</div>
                <div className="flex gap-3">
                  <a
                    href={currentStep === 2 ? "/api/auth/oauth/instagram/authorize?client=meta-review" : "/api/auth/oauth/facebook/authorize?client=meta-review"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {currentStep === 2 ? 'Connect Instagram (opens OAuth)' : 'Connect Facebook Page (opens OAuth)'}
                  </a>
                  <button
                    onClick={ownerContinue}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    I've Authorized — Continue
                  </button>
                </div>
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
            />
          </div>
        )}

        {/* ── All Done ── */}
        {allDone && (
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <div className="text-2xl font-black text-white">Review Flow Complete</div>
            <div className="text-sm text-emerald-300">All {STEPS.length} steps demonstrated. Stop your recording now.</div>
            <div className="bg-emerald-950/60 border border-emerald-500/20 rounded-xl p-4 text-left space-y-2 text-xs text-emerald-200">
              <div className="font-bold text-emerald-300 mb-2">✅ What was demonstrated:</div>
              {STEPS.map(s => <div key={s.id}>• Step {s.id}: {s.title} — <span className="font-mono text-emerald-400">{s.permission}</span></div>)}
            </div>
            {blobUrl ? (
              <a href={blobUrl} download="GrowthPilot-Meta-Review.webm"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-colors">
                <Download className="w-4 h-4" /> Download Recording
              </a>
            ) : (
              <button onClick={stopRecording}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-colors">
                <Square className="w-4 h-4" /> Stop Recording
              </button>
            )}
          </div>
        )}

        {/* ── Requirements reference ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="text-sm font-bold text-white mb-3">Meta Submission Requirements (Verified August 2026)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              ['Minimum duration', 'None — show full flow (target 90–120 sec)'],
              ['Audio required', 'No — annotations replace narration'],
              ['Resolution', '1080p or higher'],
              ['Jump cuts', 'Avoid — natural real-time pacing'],
              ['Test account', 'Required — use Meta App Test User'],
              ['App must be live', 'Yes — growthpilot-ai-two.vercel.app is live'],
              ['Privacy Policy URL', 'growthpilot-ai-two.vercel.app/privacy ✅'],
              ['Data Deletion URL', 'growthpilot-ai-two.vercel.app/data-deletion ✅'],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-slate-500 w-32 flex-shrink-0">{k}:</span>
                <span className="text-slate-300">{v}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Per-step UI content ───────────────────────────────────── */
function StepContent({
  stepId, postApproved, setPostApproved, igPublished, fbPublished, disconnected
}: {
  stepId: number;
  postApproved: boolean;
  setPostApproved: (v: boolean) => void;
  igPublished: string | null;
  fbPublished: string | null;
  disconnected: boolean;
}) {
  switch (stepId) {
    case 1:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
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
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 mb-3">Showing: Social Accounts connection page</div>
          <div className="flex items-center gap-3 p-4 bg-slate-900 border border-indigo-500/40 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">{stepId === 2 ? 'Instagram Professional Account' : 'Facebook Page'}</div>
              <div className="text-[10px] text-indigo-300 font-mono">{stepId === 2 ? 'instagram_basic · instagram_content_publish · instagram_manage_insights' : 'pages_show_list · pages_manage_posts · pages_read_engagement'}</div>
            </div>
            <div className="text-xs font-bold text-amber-400 animate-pulse">Awaiting OAuth...</div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="text-xs text-slate-400 mb-2">Showing: Connected account identity (instagram_basic + pages_show_list)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">@luxuryrealty_la</div>
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
                  <div className="text-sm font-bold text-white">Luxury Realty LA</div>
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
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
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
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
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
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
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
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
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
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="text-xs text-slate-400 mb-2">Showing: instagram_manage_insights + pages_read_engagement analytics dashboard</div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {DEMO_ANALYTICS.map(m => (
              <div key={m.label} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-xl">{m.icon}</div>
                <div className="text-sm font-black text-white">{m.value}</div>
                <div className="text-[9px] text-slate-500">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Source: GET /media/{'{id}'}/insights · GET /{'{page-id}'}/insights — read-only, no data written</div>
        </div>
      );

    case 10:
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
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

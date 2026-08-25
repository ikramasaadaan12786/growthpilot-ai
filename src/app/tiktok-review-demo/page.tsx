'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Video, 
  UserCheck, 
  ArrowRight, 
  ExternalLink, 
  Lock, 
  Sparkles, 
  Play, 
  RotateCcw,
  UploadCloud,
  Check,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Film,
  FileCheck,
  Globe,
  AlertCircle,
  KeyRound,
  CheckCircle
} from 'lucide-react';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { SocialAccountData } from '@/types';

interface DemoVideoOption {
  id: string;
  title: string;
  category: string;
  duration: string;
  url: string;
  thumbnail: string;
  caption: string;
}

const DEMO_VIDEOS: DemoVideoOption[] = [
  {
    id: 'vid-1',
    title: 'Luxury Villa Tour — Dubai Hills Estate',
    category: 'Real Estate Reel (H.264 MP4)',
    duration: '0:28',
    url: '/sample-video.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80',
    caption: '✨ Luxury 5-Bedroom Villa Tour in Dubai Hills Estate. 6,800 SqFt | Private Infinity Pool | 40/60 Payment Plan. #RealEstate #Dubai #LuxuryLiving'
  },
  {
    id: 'vid-2',
    title: 'Passive Income Real Estate Breakdown',
    category: 'Educational Breakdown (H.264 MP4)',
    duration: '0:34',
    url: '/assets/sample-reel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&auto=format&fit=crop&q=80',
    caption: '📈 How to generate $4,200/month in passive rental yield with off-plan properties. Full numbers breakdown! #Investing #PassiveIncome #Finance'
  },
  {
    id: 'vid-3',
    title: 'Downtown Penthouse Sunset View',
    category: 'Short Form Showcase (H.264 MP4)',
    duration: '0:18',
    url: '/sample-video.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80',
    caption: '🌅 Sunset from the 54th floor penthouse in Downtown. 360 panoramic views. #DubaiSkyline #Penthouse #Architecture'
  }
];

function TikTokReviewDemoContent() {
  const searchParams = useSearchParams();
  const [account, setAccount] = useState<SocialAccountData | null>(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<DemoVideoOption>(DEMO_VIDEOS[0]);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [customCaption, setCustomCaption] = useState(DEMO_VIDEOS[0].caption);
  const [uploadMode, setUploadMode] = useState<'DRAFT' | 'DIRECT'>('DRAFT');

  // URL notification banners
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [callbackError, setCallbackError] = useState<{ code: string; message: string } | null>(null);

  // Upload progress states
  const [uploadState, setUploadState] = useState<'IDLE' | 'INITIALIZING' | 'UPLOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  };

  const fetchTikTokAccount = async () => {
    setIsLoadingAccount(true);
    try {
      // 1. Check dedicated real-time Sandbox status endpoint first (bypasses all caches)
      const sandboxRes = await fetch(`/api/tiktok-sandbox-status?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });
      const sandboxData = await sandboxRes.json();

      if (sandboxData.success && sandboxData.sandbox_account_connected && sandboxData.account) {
        setAccount(sandboxData.account);
        addLog(`✓ Verified active TikTok Sandbox account: ${sandboxData.account.username} (${sandboxData.account.accountName})`);
        setIsLoadingAccount(false);
        return;
      }

      // 2. Check general social accounts endpoint as fallback
      const res = await fetch(`/api/social/accounts?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.accounts)) {
        const ttAccount = data.accounts.find((a: SocialAccountData) => a.platform === 'TIKTOK');
        if (ttAccount && (ttAccount.status === 'REAL_CONNECTED' || ttAccount.status === 'CONNECTED')) {
          setAccount(ttAccount);
          addLog(`✓ Verified active TikTok account: ${ttAccount.username} (${ttAccount.accountName})`);
        } else {
          setAccount(null);
        }
      }
    } catch (err: any) {
      addLog(`✗ Error fetching account status: ${err.message}`);
    } finally {
      setIsLoadingAccount(false);
    }
  };

  useEffect(() => {
    // Process search parameters from OAuth callback redirect
    const isConnectedParam = searchParams.get('connected');
    const isSuccessParam = searchParams.get('success');
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message') || searchParams.get('details');

    if (isConnectedParam === 'TIKTOK' && isSuccessParam === 'true') {
      setCallbackSuccess(true);
      addLog('✓ Official TikTok Sandbox OAuth 2.0 PKCE Handshake Completed Successfully!');
    }

    if (errorParam) {
      setCallbackError({
        code: errorParam,
        message: messageParam || 'OAuth authorization was not completed. Please try again.'
      });
      addLog(`✗ OAuth Callback Notice: [${errorParam}] ${messageParam || ''}`);
    }

    fetchTikTokAccount();
    addLog('TikTok Review Demo Portal initialized.');
  }, [searchParams]);

  const handleConnectTikTok = () => {
    addLog('Initiating official TikTok Developer Sandbox OAuth 2.0 PKCE flow (TIKTOK_SANDBOX_CLIENT_KEY)...');
    addLog('Scopes requested: user.info.basic, video.upload');
    window.location.href = '/api/auth/oauth/tiktok/authorize?client=tiktok-demo';
  };

  const handleDisconnect = async () => {
    if (!account) return;
    setIsDisconnecting(true);
    addLog('Revoking TikTok OAuth tokens and purging AES-256-GCM vault...');
    try {
      const res = await fetch('/api/social/tiktok/disconnect', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        addLog('✓ TikTok account disconnected and token revoked successfully.');
        setAccount(null);
        setCallbackSuccess(false);
        await fetchTikTokAccount();
        setUploadState('IDLE');
        setUploadResult(null);
      } else {
        addLog(`✗ Disconnect error: ${data.error}`);
      }
    } catch (err: any) {
      addLog(`✗ Failed to disconnect: ${err.message}`);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleInitiateUpload = async () => {
    setUploadState('INITIALIZING');
    setUploadResult(null);
    const videoUrlToUse = customVideoUrl.trim() || selectedVideo.url;

    addLog(`1/4 Checking Creator Posting Eligibility via Content Posting API v2...`);
    addLog(`Target: TikTok Creator Inbox (Draft Mode: ${uploadMode}) | Pipeline: FILE_UPLOAD`);
    addLog(`Video Payload: ${selectedVideo.title} (${selectedVideo.duration})`);

    try {
      await new Promise(r => setTimeout(r, 400));
      setUploadState('UPLOADING');
      addLog('2/4 Initializing Creator Inbox upload session (/v2/post/publish/inbox/video/init/)...');
      addLog('3/4 Streaming binary video buffer to TikTok upload URL...');

      const payload = {
        title: selectedVideo.title,
        caption: customCaption,
        mediaUrl: videoUrlToUse,
        contentType: 'VIDEO',
        mode: uploadMode
      };

      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'TIKTOK',
          payload,
          isDemoMode: false
        })
      });

      const data = await res.json();

      if (data.success && data.result) {
        setUploadState('SUCCESS');
        setUploadResult(data.result);
        addLog(`4/4 ✓ TikTok Content Posting API responded HTTP 200 OK!`);
        addLog(`Publish ID: ${data.result.platformPostId}`);
        addLog(`Status: ${data.result.status} | Video successfully staged in Creator Inbox Draft.`);
      } else {
        const errorMsg = data.error || data.result?.errorMessage || 'Upload initialization rejected by TikTok API';
        setUploadState('ERROR');
        setUploadResult({
          error: errorMsg,
          errorMessage: errorMsg,
          httpStatus: res.status,
          result: data.result
        });
        addLog(`4/4 ✗ TikTok upload failed: ${errorMsg}`);
      }
    } catch (err: any) {
      setUploadState('ERROR');
      setUploadResult({ errorMessage: err.message, error: err.message });
      addLog(`✗ Network/API error: ${err.message}`);
    }
  };

  const isConnected = Boolean(account && (account.status === 'REAL_CONNECTED' || account.status === 'CONNECTED'));

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 sm:py-8 text-slate-300">
      
      {/* Dynamic Success Banner */}
      {callbackSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/80 rounded-2xl p-4 sm:p-5 shadow-2xl flex items-start justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Official TikTok Sandbox OAuth 2.0 PKCE Connected!</h4>
              <p className="text-xs text-emerald-300 mt-0.5">
                Your TikTok Sandbox Target User has been authenticated, verified via <code className="font-mono text-white">user.info.basic</code>, and encrypted with AES-256-GCM.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setCallbackSuccess(false)}
            className="text-xs text-emerald-400 hover:text-emerald-200 font-semibold shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dynamic Error Banner */}
      {callbackError && (
        <div className="bg-rose-950/80 border border-rose-500/80 rounded-2xl p-4 sm:p-5 shadow-2xl flex items-start justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">TikTok Sandbox OAuth Notice [{callbackError.code}]</h4>
              <p className="text-xs text-rose-300 mt-0.5 font-mono">
                {callbackError.message}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setCallbackError(null)}
            className="text-xs text-rose-400 hover:text-rose-200 font-semibold shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Review Hub Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <PlatformIcon platform="TIKTOK" size={20} />
            <span>TikTok Developer App Review Live Demo Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/tiktok-review" 
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Review Guidelines Doc</span>
            </Link>
            <Link 
              href="/privacy" 
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Login Kit &amp; Content Posting API Interactive Demo
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          This portal allows TikTok reviewers and creators to test the end-to-end OAuth 2.0 PKCE authentication flow (<code className="text-cyan-400 font-mono">user.info.basic</code>) and initiate short-form video uploads (<code className="text-rose-400 font-mono">video.upload</code>) directly to the TikTok creator inbox.
        </p>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">OAuth Environment</div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sandbox Active
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">TIKTOK_SANDBOX_CLIENT_KEY</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Verified Scopes</div>
            <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Login + Posting
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">user.info.basic, video.upload</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Token Vault</div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
              <Lock className="w-3.5 h-3.5" /> AES-256-GCM
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">PBKDF2 100k rounds</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Connection State</div>
            <div className={`text-xs font-bold flex items-center gap-1.5 mt-1 ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isConnected ? 'AUTHENTICATED' : 'WAITING OAUTH'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">{isConnected ? account?.username : 'Not Connected'}</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Demo Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Steps (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* STEP 1 & 2: Login Kit & Profile Retrieval */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="text-lg font-bold text-white">Login Kit — User Authentication</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono">
                user.info.basic
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Authenticates the creator via official TikTok OAuth 2.0 PKCE. Upon approval, retrieves the creator&apos;s verified handle, display name, and avatar without requesting unnecessary administrative permissions.
            </p>

            {isLoadingAccount ? (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Checking TikTok connection status...</span>
              </div>
            ) : isConnected && account ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={account.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                      alt="TikTok Creator Avatar" 
                      className="w-12 h-12 rounded-full border-2 border-emerald-500 object-cover"
                    />
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        {account.accountName}
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-xs text-emerald-300 font-mono">{account.username}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchTikTokAccount}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                      title="Refresh status"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleDisconnect}
                      disabled={isDisconnecting}
                      className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      {isDisconnecting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-800/40 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Identity Scope:</span>
                    <span className="font-bold text-emerald-400 font-mono">user.info.basic ✓</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Token Security:</span>
                    <span className="font-bold text-emerald-400">Encrypted AES-GCM</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Sync Status:</span>
                    <span className="font-bold text-emerald-400">Live Active</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  <span>No TikTok Sandbox account currently connected.</span>
                </div>
                <button
                  onClick={handleConnectTikTok}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <PlatformIcon platform="TIKTOK" size={18} />
                  <span>Connect TikTok via Official OAuth 2.0 PKCE</span>
                </button>
                <div className="text-[10px] text-slate-400">
                  Redirects to official authorization dialog: <code className="text-slate-400 font-mono">https://www.tiktok.com/v2/auth/authorize/</code>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Content Posting API Video Upload */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="text-lg font-bold text-white">Content Posting API — Video Upload</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-rose-950 border border-rose-800 text-rose-400 font-mono">
                video.upload
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Demonstrates sending a video to TikTok via <code className="text-rose-300 font-mono">/v2/post/publish/inbox/video/init/</code>. The video is uploaded as a creator draft, allowing the creator to add native music, filters, and captions inside the official TikTok app before public release.
            </p>

            {/* Video Selector Gallery */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Select Demo Video:</span>
                <span className="text-[11px] text-slate-400 font-normal">Click a sample to test</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {DEMO_VIDEOS.map((vid) => {
                  const isSelected = selectedVideo.id === vid.id;
                  return (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => {
                        setSelectedVideo(vid);
                        setCustomCaption(vid.caption);
                        setCustomVideoUrl('');
                      }}
                      className={`text-left p-2.5 rounded-xl border transition-all relative overflow-hidden ${
                        isSelected 
                          ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-500/10' 
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-slate-900">
                        <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1.5 py-0.5 rounded text-white font-mono">
                          {vid.duration}
                        </span>
                        {isSelected && (
                          <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-rose-400 drop-shadow" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white truncate">{vid.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{vid.category}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Video URL (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Or Custom Direct MP4 Video URL (Optional):
              </label>
              <input
                type="url"
                value={customVideoUrl}
                onChange={(e) => setCustomVideoUrl(e.target.value)}
                placeholder="https://your-domain.com/sample-video.mp4"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 transition-colors font-mono"
              />
            </div>

            {/* Caption Editor */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                TikTok Post Caption &amp; Hashtags:
              </label>
              <textarea
                rows={2}
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Upload Mode Selector */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-300">Upload Target:</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUploadMode('DRAFT')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                    uploadMode === 'DRAFT'
                      ? 'bg-rose-950 border-rose-500 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Creator Inbox (Draft)
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('DIRECT')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                    uploadMode === 'DIRECT'
                      ? 'bg-rose-950 border-rose-500 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Direct Post
                </button>
              </div>
            </div>

            {/* Upload Action Trigger */}
            <button
              onClick={handleInitiateUpload}
              disabled={!isConnected || uploadState === 'INITIALIZING' || uploadState === 'UPLOADING'}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
                !isConnected 
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700' 
                  : uploadState === 'UPLOADING' || uploadState === 'INITIALIZING'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              {uploadState === 'UPLOADING' || uploadState === 'INITIALIZING' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Video to TikTok Content Posting API...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Initiate Video Upload to TikTok ({uploadMode === 'DRAFT' ? 'Creator Inbox Draft' : 'Direct Post'})</span>
                </>
              )}
            </button>

            {/* Upload Result Confirmation Banner */}
            {uploadState === 'SUCCESS' && uploadResult && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-700 rounded-xl space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>TikTok Content Posting API Upload Successful!</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  TikTok has accepted the video payload and assigned Publish ID: <code className="text-emerald-300 font-mono font-bold">{uploadResult.platformPostId}</code>.
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span>Status:</span> <strong className="text-emerald-300">{uploadResult.status}</strong>
                  <span>• Target:</span> <span className="text-slate-300">Creator Inbox Draft</span>
                </div>
              </div>
            )}

            {uploadState === 'ERROR' && (
              <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-xl space-y-2 text-xs text-rose-300">
                <div className="font-bold flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>TikTok API Response / Error Details</span>
                </div>
                <div className="p-3 bg-black/60 rounded-lg border border-rose-900/50 font-mono text-[11px] text-rose-200 leading-relaxed break-words">
                  {uploadResult?.error || uploadResult?.errorMessage || 'TikTok Content Posting API rejected upload initialization.'}
                </div>
                <div className="text-[10px] text-slate-400">
                  <span>Note: TikTok Sandbox requires Creator Inbox Draft uploads via </span>
                  <code className="text-rose-300 font-mono">video.upload</code> scope.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Real-time API Logs & Reviewer Checkpoints (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Reviewer Verification Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Reviewer Verification Checklist</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${isConnected ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${isConnected ? 'text-emerald-400' : 'text-slate-600'}`} />
                <div>
                  <div className="font-bold">1. Login Kit OAuth 2.0 PKCE</div>
                  <div className="text-[11px] text-slate-400">Authenticates test creator via official TikTok dialog with anti-CSRF state.</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${isConnected ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${isConnected ? 'text-emerald-400' : 'text-slate-600'}`} />
                <div>
                  <div className="font-bold">2. Profile Extraction (user.info.basic)</div>
                  <div className="text-[11px] text-slate-400">Retrieves creator handle, display name, and avatar from /v2/user/info/.</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${uploadState === 'SUCCESS' ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${uploadState === 'SUCCESS' ? 'text-emerald-400' : 'text-slate-600'}`} />
                <div>
                  <div className="font-bold">3. Video Upload (video.upload)</div>
                  <div className="text-[11px] text-slate-400">Transmits PULL_FROM_URL video draft to TikTok Content Posting API.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl border bg-slate-950 border-slate-800 text-slate-400 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-slate-600" />
                <div>
                  <div className="font-bold">4. Token Vault &amp; Disconnect</div>
                  <div className="text-[11px] text-slate-400">Tokens are AES-256-GCM encrypted; 1-click disconnect purges token from DB.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Diagnostic API Terminal */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
                <Terminal className="w-4 h-4" />
                <span>LIVE API CONSOLE</span>
              </div>
              <button 
                onClick={() => setApiLogs([])}
                className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                Clear Log
              </button>
            </div>

            <div className="bg-black/60 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1.5 max-h-64 overflow-y-auto border border-slate-900">
              {apiLogs.length === 0 ? (
                <div className="text-slate-400 italic">No events logged yet.</div>
              ) : (
                apiLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={
                      log.includes('✓') ? 'text-emerald-400' :
                      log.includes('✗') ? 'text-rose-400' :
                      log.includes('Initiating') || log.includes('Transmitting') ? 'text-cyan-300' :
                      'text-slate-300'
                    }
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Security & Compliance Callout */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Production Compliance Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              GrowthPilot AI strictly follows official TikTok Developer terms. Initial OAuth requests only <code className="text-cyan-300 font-mono">user.info.basic</code> and <code className="text-rose-300 font-mono">video.upload</code>. Client secrets are strictly isolated on server endpoints.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function TikTokReviewDemoPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto py-12 text-center text-slate-400 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-rose-500" />
        <span>Loading TikTok Review Demo Hub...</span>
      </div>
    }>
      <TikTokReviewDemoContent />
    </Suspense>
  );
}

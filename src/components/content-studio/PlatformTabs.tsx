'use client';

import React, { useState } from 'react';
import { MultiPlatformContentResult, SocialPlatform } from '@/types';
import { PlatformIcon } from '../common/PlatformIcon';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Calendar, 
  Send, 
  Clock, 
  Flame, 
  HelpCircle, 
  Sliders,
  CheckCircle2,
  Wand2
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { AIService } from '@/lib/ai/ai-service';

interface PlatformTabsProps {
  content: MultiPlatformContentResult;
  onContentUpdated?: (updated: MultiPlatformContentResult) => void;
}

export function PlatformTabs({ content, onContentUpdated }: PlatformTabsProps) {
  const { addCalendarPost, triggerNotification } = useApp();
  const [activeTab, setActiveTab] = useState<SocialPlatform>('INSTAGRAM');
  const [copied, setCopied] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSchedulePost = (platform: SocialPlatform) => {
    let title = `${platform} Post - ${content.topic.slice(0, 30)}`;
    let caption = '';
    let contentType: any = 'POST';
    let bestReason = '';

    if (platform === 'INSTAGRAM') {
      caption = content.instagram.caption;
      contentType = content.instagram.contentType;
      bestReason = content.instagram.bestTimeToPost;
    } else if (platform === 'FACEBOOK') {
      caption = content.facebook.caption;
      contentType = content.facebook.contentType;
      bestReason = content.facebook.bestTimeToPost;
    } else if (platform === 'LINKEDIN') {
      caption = content.linkedin.caption;
      contentType = content.linkedin.contentType;
      bestReason = content.linkedin.bestTimeToPost;
    } else {
      caption = content.tiktok.caption;
      contentType = content.tiktok.contentType;
      bestReason = content.tiktok.bestTimeToPost;
    }

    addCalendarPost({
      platform,
      contentType,
      title,
      caption,
      scheduledTime: new Date(Date.now() + 86400000).toISOString(),
      status: 'SCHEDULED',
      approvalStatus: 'USER_REVIEW',
      autoMode: 'SEMI_AUTOMATIC',
      aiScore: platform === 'INSTAGRAM' ? content.instagram.score : platform === 'FACEBOOK' ? content.facebook.score : platform === 'LINKEDIN' ? content.linkedin.score : content.tiktok.score,
      bestTimeReason: bestReason
    });
  };

  const handleOptimizeCurrent = () => {
    setOptimizing(true);
    setTimeout(() => {
      let targetPayload: any = {};
      if (activeTab === 'INSTAGRAM') targetPayload = content.instagram;
      else if (activeTab === 'FACEBOOK') targetPayload = content.facebook;
      else if (activeTab === 'LINKEDIN') targetPayload = content.linkedin;
      else targetPayload = content.tiktok;

      const optimized = AIService.optimizeContent(activeTab, {
        hook: targetPayload.hook,
        caption: targetPayload.caption,
        cta: targetPayload.cta,
        script: targetPayload.reelScript || targetPayload.videoScript
      });

      const updated = { ...content };
      if (activeTab === 'INSTAGRAM') {
        updated.instagram = {
          ...updated.instagram,
          hook: optimized.optimizedHook,
          caption: optimized.optimizedCaption,
          cta: optimized.optimizedCta,
          score: optimized.newScore
        };
      } else if (activeTab === 'FACEBOOK') {
        updated.facebook = {
          ...updated.facebook,
          hook: optimized.optimizedHook,
          caption: optimized.optimizedCaption,
          cta: optimized.optimizedCta,
          score: optimized.newScore
        };
      } else if (activeTab === 'LINKEDIN') {
        updated.linkedin = {
          ...updated.linkedin,
          hook: optimized.optimizedHook,
          caption: optimized.optimizedCaption,
          cta: optimized.optimizedCta,
          score: optimized.newScore
        };
      } else {
        updated.tiktok = {
          ...updated.tiktok,
          hook: optimized.optimizedHook,
          caption: optimized.optimizedCaption,
          cta: optimized.optimizedCta,
          score: optimized.newScore
        };
      }

      if (onContentUpdated) onContentUpdated(updated);
      setOptimizing(false);
      triggerNotification('CONTENT_READY', 'AI Optimization Complete', `${activeTab} content boosted to score ${optimized.newScore}/100 with algorithmic enhancements.`);
    }, 600);
  };

  const renderActivePlatform = () => {
    switch (activeTab) {
      case 'INSTAGRAM':
        return (
          <div className="space-y-5 animate-in fade-in">
            {/* Score & Quick Optimize Bar */}
            <div className="bg-pink-950/30 border border-pink-500/30 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-black text-pink-400 font-mono">
                  {content.instagram.score}
                  <span className="text-xs text-pink-300/70">/100</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Instagram AI Score</span>
                    <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.2 rounded font-semibold">
                      {content.instagram.contentType}
                    </span>
                  </div>
                  <div className="text-[11px] text-pink-200/80">
                    Optimal Post Time: {content.instagram.bestTimeToPost}
                  </div>
                </div>
              </div>

              <button
                onClick={handleOptimizeCurrent}
                disabled={optimizing}
                className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-pink-600/30"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{optimizing ? 'Optimizing...' : '1-Click Optimize'}</span>
              </button>
            </div>

            {/* Hook */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block mb-1.5">
                🔥 3-Second Hook
              </span>
              <p className="text-sm font-semibold text-white leading-relaxed">{content.instagram.hook}</p>
            </div>

            {/* Reel Script if available */}
            {content.instagram.reelScript && (
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1.5">
                  🎬 30s Reel Video Script & Visual Directions
                </span>
                <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                  {content.instagram.reelScript}
                </pre>
              </div>
            )}

            {/* Caption */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                📝 Instagram Caption & Saves Driver
              </span>
              <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {content.instagram.caption}
              </p>
            </div>

            {/* CTA & Hashtags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Call To Action
                </span>
                <p className="text-xs text-slate-300">{content.instagram.cta}</p>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider block mb-1">
                  Targeted Hashtag Cluster
                </span>
                <div className="flex flex-wrap gap-1">
                  {content.instagram.hashtags.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-pink-500/10 text-pink-300 px-2 py-0.5 rounded font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'FACEBOOK':
        return (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-black text-blue-400 font-mono">
                  {content.facebook.score}
                  <span className="text-xs text-blue-300/70">/100</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Facebook Community Score</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-semibold">
                      {content.facebook.contentType}
                    </span>
                  </div>
                  <div className="text-[11px] text-blue-200/80">
                    Optimal Post Time: {content.facebook.bestTimeToPost}
                  </div>
                </div>
              </div>

              <button
                onClick={handleOptimizeCurrent}
                disabled={optimizing}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{optimizing ? 'Optimizing...' : '1-Click Optimize'}</span>
              </button>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1.5">
                💬 Facebook Discussion Hook
              </span>
              <p className="text-sm font-semibold text-white">{content.facebook.hook}</p>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                📄 Full Conversational Post
              </span>
              <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {content.facebook.caption}
              </p>
            </div>

            {content.facebook.linkCopy && (
              <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  🔗 Link Preview Headline & Copy
                </span>
                <p className="text-xs text-slate-300">{content.facebook.linkCopy}</p>
              </div>
            )}
          </div>
        );

      case 'LINKEDIN':
        return (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-sky-950/30 border border-sky-500/30 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-black text-sky-400 font-mono">
                  {content.linkedin.score}
                  <span className="text-xs text-sky-300/70">/100</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>LinkedIn Executive & B2B Score</span>
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded font-semibold">
                      {content.linkedin.contentType}
                    </span>
                  </div>
                  <div className="text-[11px] text-sky-200/80">
                    Optimal Post Time: {content.linkedin.bestTimeToPost}
                  </div>
                </div>
              </div>

              <button
                onClick={handleOptimizeCurrent}
                disabled={optimizing}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{optimizing ? 'Optimizing...' : '1-Click Optimize'}</span>
              </button>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-1.5">
                📊 Thought Leadership / Institutional Hook
              </span>
              <p className="text-sm font-semibold text-white">{content.linkedin.hook}</p>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                📑 Structured Post & Dwell Time Optimization
              </span>
              <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {content.linkedin.caption}
              </p>
            </div>

            {content.linkedin.investmentAnalysis && (
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                  💼 Financial & ROI Underwriting Breakdown
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {content.linkedin.investmentAnalysis}
                </p>
              </div>
            )}
          </div>
        );

      case 'TIKTOK':
        return (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {content.tiktok.score}
                  <span className="text-xs text-cyan-300/70">/100</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>TikTok Viral Completion Score</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-semibold">
                      Short Video
                    </span>
                  </div>
                  <div className="text-[11px] text-cyan-200/80">
                    Optimal Post Time: {content.tiktok.bestTimeToPost}
                  </div>
                </div>
              </div>

              <button
                onClick={handleOptimizeCurrent}
                disabled={optimizing}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-600/30"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{optimizing ? 'Optimizing...' : '1-Click Optimize'}</span>
              </button>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1.5">
                ⚡ First 3-Second Visual & Verbal Hook
              </span>
              <p className="text-sm font-semibold text-white">{content.tiktok.hook}</p>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1.5">
                🎬 Complete Video Script (30-45 Seconds)
              </span>
              <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                {content.tiktok.videoScript}
              </pre>
            </div>

            {content.tiktok.onScreenText && content.tiktok.onScreenText.length > 0 && (
              <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                  📱 On-Screen Text Overlay Schedule
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {content.tiktok.onScreenText.map((t, idx) => (
                    <div key={idx} className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-amber-200 font-mono">
                      {idx + 1}. {t}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-card">
      {/* 4 Platform Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {(['INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'TIKTOK'] as SocialPlatform[]).map((p) => {
            const isSel = activeTab === p;
            const score = p === 'INSTAGRAM' ? content.instagram.score : p === 'FACEBOOK' ? content.facebook.score : p === 'LINKEDIN' ? content.linkedin.score : content.tiktok.score;

            return (
              <button
                key={p}
                onClick={() => setActiveTab(p)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSel
                    ? 'bg-slate-800 text-white shadow-inner border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <PlatformIcon platform={p} size={15} />
                <span>{p.charAt(0) + p.slice(1).toLowerCase()}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${score >= 90 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {score}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={() => {
              let textToCopy = '';
              if (activeTab === 'INSTAGRAM') textToCopy = `${content.instagram.caption}\n\n${content.instagram.hashtags.join(' ')}`;
              else if (activeTab === 'FACEBOOK') textToCopy = content.facebook.caption;
              else if (activeTab === 'LINKEDIN') textToCopy = `${content.linkedin.caption}\n\n${content.linkedin.investmentAnalysis || ''}`;
              else textToCopy = `${content.tiktok.videoScript}\n\n${content.tiktok.caption}`;
              handleCopy(textToCopy);
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={() => handleSchedulePost(activeTab)}
            className="px-3.5 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Add to Calendar</span>
          </button>
        </div>
      </div>

      {/* Render Active Platform Details */}
      {renderActivePlatform()}
    </div>
  );
}

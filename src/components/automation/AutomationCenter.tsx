'use client';

import React from 'react';
import { 
  Bot, 
  PauseCircle, 
  PlayCircle, 
  Sparkles, 
  Calendar, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ShieldAlert,
  Radio,
  Share2
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { AutoGrowthMode, SocialPlatform } from '@/types';
import { PlatformIcon } from '../common/PlatformIcon';

export function AutomationCenter() {
  const { 
    autoGrowthMode, 
    setAutoGrowthMode, 
    automationSettings, 
    updateAutomationSetting,
    togglePlatformAutomation,
    emergencyPauseAllAutomations,
    resumeAllAutomations,
    automationLogs
  } = useApp();

  const isPaused = automationSettings.globalPaused;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4" /> Autonomous Social Operations Hub
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Automation & Autonomous Mode Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Configure automated content generation, algorithmic schedule publishing, continuous KPI monitoring, and emergency controls.
          </p>
        </div>

        {/* Master Emergency Stop Switch */}
        <div>
          {isPaused ? (
            <button
              onClick={resumeAllAutomations}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <PlayCircle className="w-4 h-4 animate-pulse" />
              <span>RESUME AUTOMATIONS</span>
            </button>
          ) : (
            <button
              onClick={emergencyPauseAllAutomations}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
            >
              <PauseCircle className="w-4 h-4" />
              <span>PAUSE ALL AUTOMATIONS</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Paused Alert Banner */}
      {isPaused && (
        <div className="bg-rose-950/60 border border-rose-500/50 p-4 rounded-2xl flex items-center gap-3 text-xs text-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <div className="font-bold text-white">Emergency Stop Is Active</div>
            <div>All AI workers, automated content creation, calendar publishing, and background sync jobs are currently suspended.</div>
          </div>
        </div>
      )}

      {/* Auto Growth Mode Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>System Operation Mode</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['OFF', 'MANUAL', 'SEMI_AUTOMATIC', 'AUTOMATIC'] as AutoGrowthMode[]).map((mode) => {
            const isSelected = autoGrowthMode === mode;
            return (
              <div
                key={mode}
                onClick={() => setAutoGrowthMode(mode)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-glow-primary ring-1 ring-indigo-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-indigo-400' : 'text-slate-300'}`}>
                    {mode.replace('_', ' ')}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {mode === 'OFF' && 'Completely disabled. No automated background actions or alerts.'}
                  {mode === 'MANUAL' && 'AI generates ideas and content only when you click "Generate".'}
                  {mode === 'SEMI_AUTOMATIC' && 'AI prepares, drafts, and scores content; User approves before publish.'}
                  {mode === 'AUTOMATIC' && 'AI drafts, optimizes, and publishes directly at verified peak windows.'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform-Level Automation Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Share2 className="w-4 h-4 text-indigo-400" />
          <span>Platform-Level Automation Channels</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['instagram', 'facebook', 'linkedin', 'tiktok'] as const).map((platformKey) => {
            const pUpper = platformKey.toUpperCase() as SocialPlatform;
            const isEnabled = automationSettings.platformControls[platformKey] && !isPaused;

            return (
              <div key={platformKey} className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform={pUpper} size={20} />
                  <div>
                    <div className="text-xs font-bold text-white capitalize">{platformKey} Automation</div>
                    <div className="text-[10px] text-slate-400">{isEnabled ? 'Active & Queued' : 'Disabled'}</div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    disabled={isPaused}
                    onChange={(e) => togglePlatformAutomation(platformKey, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8 Granular AI Worker Toggles */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="font-bold text-white text-base">Granular Autonomous Workers</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            { key: 'autoAnalyze', label: 'Continuous Profile & Growth Diagnostics', desc: 'Recalculates AI Growth Score and detects audience changes every 6 hours.' },
            { key: 'autoGenerateContent', label: '10 Daily Viral Ideas & Content Generator', desc: 'Produces fresh platform-adapted drafts every morning at 06:00 AM.' },
            { key: 'autoOptimize', label: 'AI Content Score Booster (95+ Target)', desc: 'Applies algorithm retention hooks, save drivers, and format optimizations.' },
            { key: 'autoCreateCalendar', label: 'Predictive Best-Time Slotting', desc: 'Schedules drafts into validated high-traffic algorithmic activity windows.' },
            { key: 'autoSchedule', label: 'Official API Publishing Worker', desc: 'Submits authorized publishing payloads to Meta, LinkedIn, and TikTok.' },
            { key: 'autoGenerateReports', label: 'Weekly Executive AI Reports', desc: 'Summarizes follower gain, top format attribution, and next week strategy.' },
            { key: 'autoMonitorPerformance', label: 'Live Engagement Velocity Tracker', desc: 'Scans initial 2-hour post performance to discover winning hooks.' },
            { key: 'autoRecommendCampaigns', label: 'Paid Budget Allocation Recommender', desc: 'Identifies viral organic posts ready for legitimate ad amplification.' },
          ].map(({ key, label, desc }) => {
            const isChecked = automationSettings[key as keyof typeof automationSettings] as boolean;

            return (
              <div
                key={key}
                className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex items-start justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-white text-xs">{label}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{desc}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={isChecked && !isPaused}
                    disabled={isPaused}
                    onChange={(e) => updateAutomationSetting(key as any, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Automation Activity Log (Step 14 Requirement) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Live Automation Activity Log</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Real-time persistent audit trace</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {automationLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{log.time}</td>
                  <td className="py-2.5 px-3 font-sans font-bold text-white">
                    {log.platform === 'ALL' ? (
                      <span className="text-slate-300">All Platforms</span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <PlatformIcon platform={log.platform as SocialPlatform} size={14} />
                        <span>{log.platform}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[10px] text-indigo-300 font-bold">
                      {log.actionType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans">{log.message}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      log.status === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : log.status === 'FAILED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

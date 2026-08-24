'use client';

import React, { useState } from 'react';
import { 
  ContentGoal, 
  ContentTone, 
  ContentLanguage, 
  MultiPlatformContentResult 
} from '@/types';
import { AIService } from '@/lib/ai/ai-service';
import { 
  PenTool, 
  Building2, 
  Sparkles, 
  Languages, 
  Target, 
  Sliders, 
  Wand2, 
  Layers,
  ArrowRight,
  Flame
} from 'lucide-react';
import { PlatformTabs } from './PlatformTabs';
import { RealEstateStudio } from './RealEstateStudio';

const PRESET_TOPICS = [
  'Luxury apartment investment opportunity in Dubai Marina',
  'Why 92% of first-time real estate investors fail to calculate net yield',
  'B2B SaaS customer acquisition channels that scale in 2026',
  'How to secure a 10-Year UAE Golden Visa through real estate',
  '5 Passive income streams with zero income tax in Dubai'
];

export function ContentStudio() {
  const [activeMode, setActiveMode] = useState<'UNIVERSAL' | 'REAL_ESTATE'>('UNIVERSAL');
  
  // Universal Form State
  const [topic, setTopic] = useState('Luxury apartment investment opportunity in Dubai');
  const [goal, setGoal] = useState<ContentGoal>('LEADS');
  const [tone, setTone] = useState<ContentTone>('Professional & Authoritative');
  const [language, setLanguage] = useState<ContentLanguage>('English');
  const [audience, setAudience] = useState('High-net-worth professionals, international property buyers & entrepreneurs');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<MultiPlatformContentResult | null>(null);

  const handleGenerateUniversal = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const result = await AIService.generateForAllWindows({
        topic,
        goal,
        tone,
        language,
        audience
      });
      setGeneratedResult(result);
    } catch (err) {
      console.error('Universal content generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Mode Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-slate-900 border border-slate-800 p-1.5 sm:p-2 rounded-2xl gap-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
          <button
            onClick={() => setActiveMode('UNIVERSAL')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all text-center ${
              activeMode === 'UNIVERSAL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4 shrink-0" />
            <span>Universal AI Content Studio</span>
          </button>

          <button
            onClick={() => setActiveMode('REAL_ESTATE')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all text-center ${
              activeMode === 'REAL_ESTATE'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>Real Estate Growth Mode</span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono hidden md:inline">Specialized</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 pr-3 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multilingual: EN, AR, UR, HI</span>
        </div>
      </div>

      {activeMode === 'REAL_ESTATE' ? (
        <RealEstateStudio />
      ) : (
        <div className="space-y-8">
          {/* Universal Studio Input Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Create Content Everywhere</h2>
                <p className="text-xs text-slate-400">
                  Enter 1 idea → AI adapts hook, script, format, hashtags, and CTA specifically for IG, FB, LI & TikTok
                </p>
              </div>
            </div>

            {/* Main Topic Input */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Topic, Product, Service or Campaign Idea:
              </label>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
                placeholder="e.g. Luxury apartment investment opportunity in Dubai Marina with 8.5% net rental yield..."
              />
            </div>

            {/* Quick Preset Ideas */}
            <div className="mb-6">
              <span className="text-[11px] text-slate-400 font-semibold block mb-2">
                💡 Or try a high-converting preset topic:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_TOPICS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTopic(preset)}
                    className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors text-left truncate max-w-md"
                  >
                    &quot;{preset}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Configuration Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-400" /> Primary Goal
                </label>
                <select
                  value={goal}
                  onChange={e => setGoal(e.target.value as ContentGoal)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="LEADS">Capture High-Ticket Leads</option>
                  <option value="AWARENESS">Maximum Viral Reach & Awareness</option>
                  <option value="ENGAGEMENT">Boost Community Engagement & Comments</option>
                  <option value="THOUGHT_LEADERSHIP">B2B Authority & Thought Leadership</option>
                  <option value="SALES">Direct Sales & Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-pink-400" /> Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value as ContentTone)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Professional & Authoritative">Professional & Authoritative</option>
                  <option value="Conversational & Engaging">Conversational & Engaging</option>
                  <option value="Inspiring & Visionary">Inspiring & Visionary</option>
                  <option value="Energetic & Punchy">Energetic & Punchy (Viral)</option>
                  <option value="Luxury & Exclusive">Luxury & Exclusive</option>
                  <option value="Educational & Actionable">Educational & Actionable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-cyan-400" /> Language
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value as ContentLanguage)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="English">English (Global)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                  <option value="Urdu">Urdu (اردو)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Audience</label>
                <input
                  type="text"
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Investors, founders, executives"
                />
              </div>
            </div>

            {/* Big Action Button */}
            <button
              onClick={handleGenerateUniversal}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Platform Algorithms & Tailoring Outputs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200 fill-current" />
                  <span>GENERATE FOR ALL PLATFORMS</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Result Output */}
          {generatedResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 fill-current" />
                  <span>Multi-Platform Generated Content Suite</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Topic: &quot;{generatedResult.topic.slice(0, 45)}...&quot;
                </span>
              </div>

              <PlatformTabs
                content={generatedResult}
                onContentUpdated={setGeneratedResult}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

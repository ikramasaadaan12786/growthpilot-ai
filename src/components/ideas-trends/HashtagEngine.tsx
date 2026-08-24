'use client';

import React, { useState } from 'react';
import { Hash, Sparkles, Copy, Check, Search } from 'lucide-react';
import { PlatformIcon } from '../common/PlatformIcon';
import { SocialPlatform } from '@/types';

export function HashtagEngine() {
  const [keyword, setKeyword] = useState('Dubai Real Estate Investment');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const igTags = ['#DubaiRealEstate', '#LuxuryProperties', '#PropertyInvestment', '#DubaiMarinaLiving', '#GoldenVisaUAE', '#DowntownDubai', '#HighYieldInvestments'];
  const ttKeywords = ['#dubaiproperty', '#realestatetips', '#wealthbuilding', 'how to buy apartment in dubai', '1 percent payment plan', 'dubai marina roi'];
  const liKeywords = ['Real Estate Investment', 'Sovereign Wealth', 'UAE Golden Visa', 'Alternative Assets', 'Portfolio Diversification', 'Private Equity Real Estate'];
  const fbKeywords = ['Dubai expat property guide', 'community living Dubai Hills', 'freehold vs leasehold UAE', '#DubaiProperties', '#InvestmentOpportunity'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Hash className="w-5 h-5 text-indigo-400" />
            <span>Platform-Specific Hashtag & Keyword Engine</span>
          </h3>
          <p className="text-xs text-slate-400">
            Algorithmic SEO tagging designed for relevance and algorithmic categorization rather than spam
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-72">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="w-full px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            placeholder="Enter niche topic..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Instagram */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
                <PlatformIcon platform="INSTAGRAM" size={15} />
                <span>Instagram: Curated Tiered Hashtags</span>
              </div>
              <button
                onClick={() => handleCopy(igTags.join(' '), 'ig')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'ig' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'ig' ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Prioritizes high-intent search tags & community niches.</p>
            <div className="flex flex-wrap gap-1.5">
              {igTags.map((tag, idx) => (
                <span key={idx} className="text-xs font-mono bg-pink-500/10 text-pink-300 px-2.5 py-1 rounded-lg border border-pink-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TikTok */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <PlatformIcon platform="TIKTOK" size={15} />
                <span>TikTok: Viral Tags + Search Keywords</span>
              </div>
              <button
                onClick={() => handleCopy(ttKeywords.join(', '), 'tt')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'tt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'tt' ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Matches TikTok Search SEO & Suggested Search query algorithms.</p>
            <div className="flex flex-wrap gap-1.5">
              {ttKeywords.map((tag, idx) => (
                <span key={idx} className="text-xs font-mono bg-cyan-500/10 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                <PlatformIcon platform="LINKEDIN" size={15} />
                <span>LinkedIn: B2B Topics & Knowledge Keywords</span>
              </div>
              <button
                onClick={() => handleCopy(liKeywords.join(', '), 'li')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'li' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'li' ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Targets corporate interest categories and executive feeds.</p>
            <div className="flex flex-wrap gap-1.5">
              {liKeywords.map((tag, idx) => (
                <span key={idx} className="text-xs font-mono bg-sky-500/10 text-sky-300 px-2.5 py-1 rounded-lg border border-sky-500/20">
                  #{tag.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Facebook */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <PlatformIcon platform="FACEBOOK" size={15} />
                <span>Facebook: Contextual Keywords</span>
              </div>
              <button
                onClick={() => handleCopy(fbKeywords.join(', '), 'fb')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'fb' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'fb' ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Semantic search match for Facebook local and expat group recommendations.</p>
            <div className="flex flex-wrap gap-1.5">
              {fbKeywords.map((tag, idx) => (
                <span key={idx} className="text-xs font-mono bg-blue-500/10 text-blue-300 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

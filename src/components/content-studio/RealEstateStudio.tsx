'use client';

import React, { useState } from 'react';
import { RealEstateListingInput, MultiPlatformContentResult, ContentLanguage } from '@/types';
import { AIService } from '@/lib/ai/ai-service';
import { 
  Building2, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Award, 
  CheckSquare, 
  Layers,
  Wand2
} from 'lucide-react';
import { PlatformTabs } from './PlatformTabs';

const AMENITY_OPTIONS = [
  'Private Infinity Pool',
  'Direct Beach & Marina Access',
  'Panoramic Skyline Views',
  'Valet & 24/7 Concierge',
  'Smart Home Automation',
  'State-of-the-art Gym & Spa',
  'Children Play Area',
  'Private Yacht Berth'
];

const BENEFIT_OPTIONS = [
  'Guaranteed 8.5%+ Net Tax-Free Rental Yield',
  'Qualifies for 10-Year Renewable UAE Golden Visa',
  '100% Freehold Foreign Ownership',
  'Zero Capital Gains & Zero Income Tax',
  'High Capital Appreciation Forecast (+12% by Handover)'
];

export function RealEstateStudio() {
  const [form, setForm] = useState<RealEstateListingInput>({
    developer: 'Emaar Properties',
    project: 'Marina Cove Residences',
    location: 'Dubai Marina, UAE',
    propertyType: 'Luxury Waterfront Apartment',
    bedrooms: '2-Bedroom',
    price: 'AED 2,450,000 ($667,000 USD)',
    paymentPlan: '60/40 (1% Monthly Installments)',
    handover: 'Q4 2026',
    amenities: ['Private Infinity Pool', 'Direct Beach & Marina Access', 'Panoramic Skyline Views', 'Valet & 24/7 Concierge'],
    investmentBenefits: [
      'Guaranteed 8.5%+ Net Tax-Free Rental Yield',
      'Qualifies for 10-Year Renewable UAE Golden Visa',
      '100% Freehold Foreign Ownership',
      'Zero Capital Gains & Zero Income Tax'
    ],
    targetAudience: 'HNWIs, international expat investors, and luxury holiday homeowners'
  });

  const [language, setLanguage] = useState<ContentLanguage>('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<MultiPlatformContentResult | null>(null);

  const toggleAmenity = (amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const toggleBenefit = (benefit: string) => {
    setForm(prev => ({
      ...prev,
      investmentBenefits: prev.investmentBenefits.includes(benefit)
        ? prev.investmentBenefits.filter(b => b !== benefit)
        : [...prev.investmentBenefits, benefit]
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await AIService.generateRealEstateCampaign(form, language);
      setGeneratedResult(result);
    } catch (err) {
      console.error('Real estate generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Configuration Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Real Estate Growth Engine</h2>
            <p className="text-xs text-slate-400">
              Input property specs once → AI creates Instagram Reel, FB Post, LinkedIn ROI Underwriting & TikTok 30s Script
            </p>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Developer Name</label>
            <input
              type="text"
              value={form.developer}
              onChange={e => setForm({ ...form, developer: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Emaar, DAMAC, Sobha"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Name</label>
            <input
              type="text"
              value={form.project}
              onChange={e => setForm({ ...form, project: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Marina Cove"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Dubai Marina, Downtown"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Property Typology & Bedrooms</label>
            <input
              type="text"
              value={form.bedrooms}
              onChange={e => setForm({ ...form, bedrooms: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 2-Bedroom Luxury Apartment"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Starting Price</label>
            <input
              type="text"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. AED 2,450,000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Payment Plan</label>
            <input
              type="text"
              value={form.paymentPlan}
              onChange={e => setForm({ ...form, paymentPlan: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 60/40 (1% monthly)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Handover Date</label>
            <input
              type="text"
              value={form.handover}
              onChange={e => setForm({ ...form, handover: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Q4 2026"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Language</label>
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
              value={form.targetAudience}
              onChange={e => setForm({ ...form, targetAudience: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. High-net-worth foreign investors"
            />
          </div>
        </div>

        {/* Amenities Checkboxes */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            Key Amenities (Included in Reel & Video Scripts):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AMENITY_OPTIONS.map((amenity) => {
              const isSelected = form.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-200'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                  }`}
                >
                  <span className="truncate pr-1">{amenity}</span>
                  {isSelected && <CheckSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Investment Benefits Checkboxes */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            Investment Drivers (Featured in LinkedIn ROI & TikTok Hooks):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BENEFIT_OPTIONS.map((benefit) => {
              const isSelected = form.investmentBenefits.includes(benefit);
              return (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => toggleBenefit(benefit)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                  }`}
                >
                  <span>{benefit}</span>
                  {isSelected && <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Tailored Real Estate Multi-Platform Strategy...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-cyan-200" />
              <span>GENERATE 4-PLATFORM REAL ESTATE CAMPAIGN</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Content Output Section */}
      {generatedResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 fill-current" />
              <span>Generated Cross-Platform Real Estate Assets</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Ready for Instant Scheduling & Ad Launch
            </span>
          </div>

          <PlatformTabs
            content={generatedResult}
            onContentUpdated={setGeneratedResult}
          />
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Users2, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Filter, 
  Download,
  Search,
  Building,
  X,
  UserPlus
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { LeadItem, LeadStatus, SocialPlatform } from '@/types';
import { PlatformIcon } from '../common/PlatformIcon';
import { PlatformBadge } from '../common/PlatformBadge';

const STATUS_COLUMNS: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'NEW', label: 'New Inquiries', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
  { id: 'CONTACTED', label: 'Contacted', color: 'border-sky-500/40 text-sky-400 bg-sky-500/10' },
  { id: 'QUALIFIED', label: 'Qualified Buyer', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
  { id: 'MEETING', label: 'Private Meeting', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { id: 'NEGOTIATION', label: 'SPA Negotiation', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
  { id: 'CONVERTED', label: 'Closed / Converted 🎉', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' }
];

export function LeadCenter() {
  const { leads, updateLeadStatus, addLead, platformFilter } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Lead Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('LINKEDIN');
  const [campaign, setCampaign] = useState('Organic Inbound');
  const [value, setValue] = useState('500000');
  const [notes, setNotes] = useState('');

  const filteredLeads = leads.filter(l => {
    const matchesPlatform = platformFilter === 'ALL' || l.platform === platformFilter;
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.campaign.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === 'QUALIFIED' || l.status === 'MEETING' || l.status === 'NEGOTIATION' || l.status === 'CONVERTED').length;
  const convertedLeads = leads.filter(l => l.status === 'CONVERTED').length;
  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
  const conversionRate = ((convertedLeads / (totalLeads || 1)) * 100).toFixed(1);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addLead({
      name,
      email,
      phone,
      platform,
      campaign,
      source: `${platform} Direct Ad Form`,
      status: 'NEW',
      value: parseFloat(value) || 0,
      notes
    });

    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setIsAddOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Platform', 'Campaign', 'Status', 'Value', 'Date'];
    const rows = leads.map(l => [l.name, l.email, l.phone, l.platform, l.campaign, l.status, `$${l.value}`, l.date]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `growthpilot_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-card">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Leads</div>
          <div className="text-2xl font-black text-white font-mono">{totalLeads}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-card">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Qualified Leads</div>
          <div className="text-2xl font-black text-indigo-400 font-mono">{qualifiedLeads}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-card">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Closed Deals</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{convertedLeads}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-card">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Conversion Rate</div>
          <div className="text-2xl font-black text-cyan-400 font-mono">{conversionRate}%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-card col-span-2 sm:col-span-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Pipeline Value</div>
          <div className="text-2xl font-black text-white font-mono">${(totalPipelineValue / 1000000).toFixed(2)}M</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, campaign..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Leads Table / Pipeline List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Users2 className="w-5 h-5 text-indigo-400" />
            <span>Social Lead Acquisition Pipeline</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{filteredLeads.length} active leads</span>
        </div>

        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 rounded-2xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 max-w-xl">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <PlatformIcon platform={lead.platform as any} size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                    <PlatformBadge platform={lead.platform as any} size="sm" />
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded font-mono">
                      ${lead.value.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-500" /> {lead.email}</span>
                    {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-500" /> {lead.phone}</span>}
                    <span className="text-[10px] text-slate-500 font-medium">Captured: {lead.date}</span>
                  </div>

                  {lead.notes && (
                    <p className="text-[11px] text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800/60 mt-1">
                      {lead.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Selector Dropdown */}
              <div className="shrink-0 self-end md:self-center">
                <select
                  value={lead.status}
                  onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="NEW">New Lead</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified Buyer</option>
                  <option value="MEETING">Meeting Scheduled</option>
                  <option value="NEGOTIATION">SPA Negotiation</option>
                  <option value="CONVERTED">Closed / Converted 🎉</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop Layer with tap-to-dismiss */}
          <div 
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsAddOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Content Dialog Card */}
          <div 
            className="relative z-10 bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl my-auto max-h-[92vh] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-lead-title"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 id="add-lead-title" className="font-bold text-white text-base">Add Lead to CRM</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="py-4 space-y-3.5 overflow-y-auto custom-scrollbar flex-1 pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. sarah.j@investments.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +971 50 123 4567"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Channel Source</label>
                  <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value as SocialPlatform)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="FACEBOOK">Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Deal Value ($)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="500000"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Requirement</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="e.g. Inquired about 2-Bedroom penthouse in Dubai Marina"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

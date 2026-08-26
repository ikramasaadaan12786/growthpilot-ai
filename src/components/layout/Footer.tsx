import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HelpCircle, FileText, Lock, RefreshCw, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-12 py-8 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Paddle MOR statement */}
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-white text-sm">
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              GrowthPilot AI
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              v1.0.0-beta.1
            </span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-md">
            Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.
          </p>
        </div>

        {/* Legal & Compliance Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium">
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="hover:text-cyan-400 text-indigo-400 font-semibold transition-colors">
            Refund Policy
          </Link>
          <Link href="/data-deletion" className="hover:text-cyan-400 transition-colors">
            Data Deletion
          </Link>
          <Link href="/support" className="hover:text-cyan-400 transition-colors">
            Contact & Support
          </Link>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
        <div>
          © {new Date().getFullYear()} GrowthPilot AI. All rights reserved. Connected to official Meta, LinkedIn & TikTok APIs.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/meta-review-demo" className="hover:text-slate-400 transition-colors">
            Meta Review Hub
          </Link>
          <span>•</span>
          <Link href="/tiktok-review-demo" className="hover:text-slate-400 transition-colors">
            TikTok Review Hub
          </Link>
        </div>
      </div>
    </footer>
  );
}

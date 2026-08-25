import React from 'react';
import Link from 'next/link';
import { FileText, ShieldAlert, CheckCircle2, Lock, Scale, AlertTriangle, Mail } from 'lucide-react';
import { PlatformIcon } from '@/components/common/PlatformIcon';

export const metadata = {
  title: 'Terms of Service | GrowthPilot AI',
  description: 'Official Terms of Service for GrowthPilot AI, governing multi-platform social media growth, TikTok Content Posting API, user responsibilities, and service commitments.',
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-8 text-slate-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-3">
          <FileText className="w-5 h-5" />
          <span>Legal Agreement &amp; Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Effective Date: August 25, 2026 • Last Updated: August 25, 2026
        </p>
        <p className="text-xs text-slate-400 mt-4 leading-relaxed">
          Welcome to GrowthPilot AI. These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and GrowthPilot Technologies LLC (&quot;GrowthPilot AI&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), governing your access to and use of the GrowthPilot AI platform, AI content tools, and official social media integrations.
        </p>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">100% Content Ownership</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You own all intellectual property rights to your videos, captions, listings, and marketing assets created or uploaded on GrowthPilot AI.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Official API Compliance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We exclusively interface with official TikTok, Meta, and LinkedIn APIs. No scrapers, unofficial tokens, or simulated bots are used.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Community Guidelines</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All content published through TikTok Content Posting API must comply strictly with TikTok Community Guidelines and Terms of Service.
          </p>
        </div>
      </div>

      {/* Main Terms Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 leading-relaxed text-sm">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">1.</span> Acceptance of Terms
          </h2>
          <p>
            By accessing or using GrowthPilot AI at <a href="https://growthpilot-ai-two.vercel.app" className="text-cyan-400 hover:underline">https://growthpilot-ai-two.vercel.app</a>, you confirm that you are at least 18 years of age, legally capable of entering into binding contracts, and agree to abide by these Terms, our Privacy Policy, and the terms of any connected social platforms.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">2.</span> Service Description &amp; Social Platform Integrations
          </h2>
          <p>
            GrowthPilot AI provides an enterprise AI growth, analytics orchestration, and content management dashboard for creators and businesses across Instagram, Facebook, LinkedIn, and TikTok:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-2">
            <li><strong className="text-white">Unified Analytics &amp; Growth Scoring:</strong> Aggregating verified audience metrics into comprehensive growth health metrics.</li>
            <li><strong className="text-white">AI Content Studio:</strong> Generating platform-optimized captions, short-form reel scripts, and structured B2B thought leadership articles.</li>
            <li><strong className="text-white">Content Calendar &amp; Scheduling:</strong> Organizing marketing campaigns and publishing workflows.</li>
            <li><strong className="text-white">TikTok Content Posting API:</strong> Facilitating user-approved direct video uploads and scheduled video publishing to your connected TikTok account.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">3.</span> TikTok Integration &amp; API Terms
          </h2>
          <p>
            When you connect your TikTok account via TikTok Login Kit and Content Posting API:
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-white">
              <PlatformIcon platform="TIKTOK" size={16} />
              <span>TikTok Specific Compliance Terms</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              You authorize GrowthPilot AI to query your public profile information (<code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">user.info.basic</code>) and upload videos (<code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">video.upload</code>) solely upon your explicit instruction. You agree not to upload any media containing unauthorized copyrighted music, trademarked intellectual property, or content violating TikTok Developer Terms or TikTok Community Guidelines.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">4.</span> User Content Ownership &amp; Licensing
          </h2>
          <p>
            You retain 100% ownership and intellectual property rights in all content, videos, graphics, audio, and text submitted to GrowthPilot AI. By utilizing our publishing tools, you grant GrowthPilot AI a non-exclusive, temporary license strictly for the purpose of processing, reformatting, and transmitting your media to the designated third-party APIs upon your command.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">5.</span> Prohibited Uses &amp; Misuse
          </h2>
          <p>You agree NOT to use GrowthPilot AI to:</p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-2">
            <li>Transmit unsolicited spam, repetitive bulk messages, or deceptive content.</li>
            <li>Publish hateful, defamatory, violent, sexually explicit, or illegal material.</li>
            <li>Attempt to bypass API rate limits, reverse engineer platform algorithms, or intercept other users&apos; OAuth tokens.</li>
            <li>Use automated bot farms, click-fraud tools, or fake engagement software.</li>
            <li>Infringe upon the copyright, patent, trademark, or privacy rights of any third party.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">6.</span> Platform Dependencies &amp; Rate Limits
          </h2>
          <p>
            GrowthPilot AI relies on official third-party APIs provided by TikTok, Meta, and LinkedIn. We are not liable for service interruptions, API deprecations, rate limit throttling, or policy modifications imposed by third-party social media platforms beyond our reasonable control.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">7.</span> Disconnection, Termination &amp; Token Purging
          </h2>
          <p>
            You may terminate your account or disconnect any connected social platform at any time from the <Link href="/social-accounts" className="text-cyan-400 underline">Social Accounts Hub</Link>. Upon disconnection:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-2">
            <li>Stored OAuth tokens and refresh tokens are permanently purged from the database.</li>
            <li>Background synchronization workers and scheduled queue jobs for the disconnected channel are immediately cancelled.</li>
            <li>We reserve the right to suspend accounts that violate these Terms or platform policies.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">8.</span> Disclaimers &amp; Limitation of Liability
          </h2>
          <p className="text-xs text-slate-400">
            GROWTHPILOT AI IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. IN NO EVENT SHALL GROWTHPILOT TECHNOLOGIES LLC BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM THE USE OF OR INABILITY TO USE THE SERVICE OR THIRD-PARTY APIS.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3 border-t border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            9. Contact &amp; Legal Notices
          </h2>
          <p>For questions or legal notices regarding these Terms of Service, please reach out to:</p>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1.5 font-medium">
            <p><strong className="text-white">GrowthPilot Technologies LLC:</strong> Legal Department</p>
            <p><strong className="text-white">Legal Email:</strong> <a href="mailto:legal@growthpilot.ai" className="text-cyan-400 underline">legal@growthpilot.ai</a></p>
            <p><strong className="text-white">Support:</strong> <a href="mailto:support@growthpilot.ai" className="text-cyan-400 underline">support@growthpilot.ai</a></p>
          </div>
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-4 border-t border-slate-800">
        <div>
          &copy; {new Date().getFullYear()} GrowthPilot AI. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/tiktok-review" className="hover:text-slate-300 transition-colors">TikTok Review Guide</Link>
          <span>•</span>
          <Link href="/social-accounts" className="hover:text-slate-300 transition-colors">Social Accounts Hub</Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Trash2, Mail, ExternalLink, Key, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PlatformIcon } from '@/components/common/PlatformIcon';

export const metadata = {
  title: 'Privacy Policy | GrowthPilot AI',
  description: 'Official Privacy Policy for GrowthPilot AI, covering TikTok OAuth, Meta Graph API, LinkedIn OIDC, AES-256-GCM encryption, data retention, and user privacy rights.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-8 text-slate-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
          <ShieldCheck className="w-5 h-5" />
          <span>Official Trust & Privacy Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Effective Date: August 25, 2026 • Last Updated: August 25, 2026
        </p>
        <p className="text-xs text-slate-400 mt-4 leading-relaxed">
          GrowthPilot AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the GrowthPilot AI platform accessible at{' '}
          <a href="https://growthpilot-ai-two.vercel.app" className="text-cyan-400 hover:underline">
            https://growthpilot-ai-two.vercel.app
          </a>
          . We are committed to protecting your personal data, respecting creator intellectual property, and adhering to strict privacy and API guidelines established by TikTok, Meta, LinkedIn, and international data protection laws (GDPR &amp; CCPA).
        </p>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">AES-256-GCM Vault</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All OAuth tokens are encrypted at rest with PBKDF2 key derivation (100,000 iterations), 16-byte random IVs, and authentication tags.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Zero Data Selling</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We never sell, broker, or rent your social media credentials, follower information, or private analytics to third-party advertisers.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">1-Click Instant Revocation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Disconnecting any account permanently removes stored access tokens and halts all automated background queue workers immediately.
          </p>
        </div>
      </div>

      {/* Main Privacy Policy Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 leading-relaxed text-sm">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">1.</span> Information We Collect &amp; Receive
          </h2>
          <p>
            GrowthPilot AI collects information directly provided by you, as well as data received through official platform OAuth 2.0 APIs when you connect your accounts:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
            <li>
              <strong className="text-white">Account Registration Information:</strong> Your name, email address, password hash, and subscription plan selection.
            </li>
            <li>
              <strong className="text-white">TikTok Data (via TikTok Login Kit &amp; Content Posting API):</strong> When you authenticate via official TikTok OAuth 2.0 (scopes: <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded text-xs font-mono">user.info.basic</code>, <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded text-xs font-mono">video.upload</code>), we receive your TikTok OpenID, display name, profile avatar URL, and verified upload IDs. We do not receive or store your personal TikTok password.
            </li>
            <li>
              <strong className="text-white">Meta Data (Instagram &amp; Facebook):</strong> When connected via Meta OAuth 2.0, we receive your Page IDs, Instagram Professional account identifiers, public handle, follower counts, and organic reach metrics.
            </li>
            <li>
              <strong className="text-white">LinkedIn Data (via OpenID Connect):</strong> When authorized via LinkedIn OIDC, we receive your Member OpenID identifier, name, email address, and verified profile picture.
            </li>
            <li>
              <strong className="text-white">User-Generated Content &amp; Media:</strong> Draft captions, scheduled video files, real estate listings, and prompt instructions entered into the Content Studio.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">2.</span> Purpose of Data Processing
          </h2>
          <p>We process collected data exclusively to deliver and optimize GrowthPilot AI features:</p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-2">
            <li>Authenticate your identity and manage multi-platform channel connectivity.</li>
            <li>Display unified audience health, growth metrics, and aggregate campaign statistics.</li>
            <li>Enable AI-assisted caption creation, reel script formatting, and multi-format content adaptation.</li>
            <li>Execute authorized direct video uploads and scheduled publishing via TikTok Content Posting API.</li>
            <li>Detect anomalies, monitor rate limits, and ensure compliance with platform API policies.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">3.</span> TikTok Content Posting API &amp; OAuth Token Vault
          </h2>
          <p>
            GrowthPilot AI strictly follows the official TikTok Developer Terms of Service and API Guidelines:
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-white">
              <PlatformIcon platform="TIKTOK" size={16} />
              <span>TikTok OAuth 2.0 with PKCE Protection</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              We implement RFC 7636 Proof Key for Code Exchange (PKCE) with S256 challenge generation for all TikTok authorization requests. Access tokens are encrypted using military-grade AES-256-GCM before database insertion. Tokens are stored in a dedicated secure credential vault and are decrypted strictly in memory at the moment of authorized API transmission.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            TikTok video uploads initiated through GrowthPilot AI require explicit user consent and approval before submission to the TikTok Content Posting API.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">4.</span> Data Retention &amp; Automatic Worker Halting
          </h2>
          <p>
            We retain your personal data and social metrics only for as long as your GrowthPilot AI account remains active and connected.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-2">
            <li>
              <strong className="text-white">Active Connections:</strong> Account metrics and cached insights are retained to generate weekly analytics reports and track growth score progression.
            </li>
            <li>
              <strong className="text-white">Disconnected Accounts:</strong> When you disconnect a channel (e.g., clicking &quot;Disconnect&quot; on TikTok), the corresponding OAuth access token and refresh token are immediately purged from the database, and all scheduled background queue workers for that platform are halted instantly.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">5.</span> User Data Deletion &amp; Revocation Requests
          </h2>
          <p>
            You have the absolute right to request the complete deletion of your account and all associated social media data at any time:
          </p>
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              How to Request Full Data Erasure:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
              <li>Navigate to <strong>Settings &gt; Security &gt; Connected Accounts</strong> and click <em>Disconnect</em> on all connected channels.</li>
              <li>Email our data protection officer at <a href="mailto:privacy@growthpilot.ai" className="text-cyan-400 underline">privacy@growthpilot.ai</a> with the subject line <strong>&quot;Data Deletion Request&quot;</strong>.</li>
              <li>All database records, profile metadata, stored tokens, and audit logs will be permanently scrubbed within 48 business hours.</li>
            </ol>
          </div>
          <p className="text-xs text-slate-400">
            You can also revoke GrowthPilot AI access directly inside your TikTok mobile application by navigating to <strong>Profile &gt; Settings and Privacy &gt; Security &gt; Manage App Permissions &gt; GrowthPilot AI &gt; Remove Access</strong>.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">6.</span> Third-Party Service Providers &amp; Platform APIs
          </h2>
          <p>GrowthPilot AI integrates with verified official enterprise APIs:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <PlatformIcon platform="TIKTOK" size={18} />
              <div>
                <strong className="text-white block">TikTok Login Kit &amp; Content Posting API</strong>
                <span className="text-slate-400">Subject to TikTok Developer Terms of Service and Privacy Policy.</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <PlatformIcon platform="INSTAGRAM" size={18} />
              <div>
                <strong className="text-white block">Meta Graph API v20.0</strong>
                <span className="text-slate-400">Subject to Meta Platform Terms and Developer Policies.</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <PlatformIcon platform="LINKEDIN" size={18} />
              <div>
                <strong className="text-white block">LinkedIn OpenID Connect &amp; UGC API</strong>
                <span className="text-slate-400">Subject to Microsoft / LinkedIn Developer API Terms.</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Neon Serverless PostgreSQL Vault</strong>
                <span className="text-slate-400">SOC 2 Type II certified encrypted cloud database infrastructure.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">7.</span> User Rights (GDPR &amp; CCPA Compliance)
          </h2>
          <p>
            Depending on your jurisdiction, you possess the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
            <li><strong>Right of Access:</strong> Request a full copy of all data stored about your account.</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete profile information.</li>
            <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request permanent deletion of all account records.</li>
            <li><strong>Right to Restrict Processing:</strong> Pause automated AI optimization and background analytics sync.</li>
            <li><strong>Right to Data Portability:</strong> Export your lead CRM pipeline and performance logs in CSV/JSON format.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3 border-t border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            8. Contact &amp; Privacy Inquiries
          </h2>
          <p>
            If you have questions, concerns, or data requests regarding this Privacy Policy or our TikTok integration, please contact our dedicated Privacy &amp; Security Team:
          </p>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1.5 font-medium">
            <p><strong className="text-white">GrowthPilot AI Privacy Office:</strong> GrowthPilot Technologies LLC</p>
            <p><strong className="text-white">Email:</strong> <a href="mailto:privacy@growthpilot.ai" className="text-cyan-400 underline">privacy@growthpilot.ai</a></p>
            <p><strong className="text-white">Support Desk:</strong> <a href="mailto:support@growthpilot.ai" className="text-cyan-400 underline">support@growthpilot.ai</a></p>
            <p><strong className="text-white">Live Platform:</strong> <a href="https://growthpilot-ai-two.vercel.app" className="text-cyan-400 underline">https://growthpilot-ai-two.vercel.app</a></p>
          </div>
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-4 border-t border-slate-800">
        <div>
          &copy; {new Date().getFullYear()} GrowthPilot AI. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/tiktok-review" className="hover:text-slate-300 transition-colors">TikTok Review Guide</Link>
          <span>•</span>
          <Link href="/social-accounts" className="hover:text-slate-300 transition-colors">Social Accounts Hub</Link>
        </div>
      </div>
    </div>
  );
}

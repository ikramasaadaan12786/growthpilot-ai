import React from 'react';
import Link from 'next/link';
import { 
  RotateCcw, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Mail, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Zap
} from 'lucide-react';

export const metadata = {
  title: 'Refund Policy | GrowthPilot AI',
  description: 'Official Refund & Cancellation Policy for GrowthPilot AI SaaS subscriptions processed by Paddle.com Merchant of Record.',
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-8 text-slate-300">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
          <RotateCcw className="w-5 h-5" />
          <span>Billing & Customer Assurance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Refund Policy
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Effective Date: August 26, 2026 • Last Updated: August 26, 2026
        </p>
        <p className="text-xs text-slate-400 mt-4 leading-relaxed">
          At GrowthPilot AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we want you to be completely satisfied with our multi-platform social media growth platform. This Refund Policy explains how subscription payments, cancellations, and refund requests are processed for all purchases made through our official platform accessible at{' '}
          <a href="https://growthpilot-ai-two.vercel.app" className="text-cyan-400 hover:underline">
            https://growthpilot-ai-two.vercel.app
          </a>.
        </p>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">14-Day Guarantee</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            First-time subscribers are eligible for a full refund within 14 days of initial plan upgrade if unsatisfied.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Cancel Anytime</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You can cancel your subscription at any time with one click. Retain full access through the end of your billing cycle.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Paddle MoR Protection</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All payments and returns are securely processed by Paddle.com, our official Merchant of Record.
          </p>
        </div>
      </div>

      {/* Merchant of Record Disclosure */}
      <div className="bg-slate-900/90 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Merchant of Record Disclosure</h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pl-11">
          <p>
            Our order process is conducted by our online reseller and Merchant of Record, <strong>Paddle.com Market Ltd</strong> (&quot;Paddle&quot;), Judd House, 18-29 Mora Street, London, EC1V 8BT, United Kingdom.
          </p>
          <p>
            Paddle is responsible for all order processing, billing inquiries, tax calculation, currency conversion, and refund disbursement. When you purchase a subscription to GrowthPilot AI, your transaction receipt and credit card statement will indicate Paddle as the billing entity.
          </p>
        </div>
      </div>

      {/* Subscription Billing & Renewals */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Subscription Billing & Automatic Renewals</h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pl-11">
          <p>
            GrowthPilot AI offers monthly recurring subscription tiers (Starter $19/mo, Pro $49/mo, Agency $99/mo, and Business $199/mo).
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400">
            <li>
              <strong className="text-slate-200">Billing Cycle:</strong> Subscriptions are billed in advance on a recurring monthly cycle on the same calendar day your paid plan commenced.
            </li>
            <li>
              <strong className="text-slate-200">Automatic Renewal:</strong> To ensure uninterrupted access to AI content generation, automated analytics, and social publishing features, subscriptions renew automatically until cancelled.
            </li>
            <li>
              <strong className="text-slate-200">Payment Methods:</strong> We accept major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay via Paddle checkout.
            </li>
          </ul>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Cancellation Policy</h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pl-11">
          <p>
            You can cancel your GrowthPilot AI subscription at any time without fees or penalties:
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
            <div>1. Log in to your account at https://growthpilot-ai-two.vercel.app/settings</div>
            <div>2. Navigate to the &quot;Subscription &amp; Billing&quot; section</div>
            <div>3. Click &quot;Manage Subscription&quot; or &quot;Cancel Subscription&quot;</div>
            <div>4. Alternatively, manage your active subscription via Paddle&apos;s customer portal at https://paddle.net</div>
          </div>
          <p>
            Upon cancellation:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400">
            <li>You will not be billed for any subsequent billing periods.</li>
            <li>You maintain full access to your plan entitlements (connected social accounts, AI studio, and analytics) until the end of your current paid billing period.</li>
            <li>After your billing period expires, your account reverts to the Free tier without loss of previously created draft content.</li>
          </ul>
        </div>
      </div>

      {/* 14-Day Money-Back Guarantee & Eligibility */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            4
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Refund Eligibility & Guidelines</h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 pl-11">
          <div>
            <h3 className="font-bold text-white text-sm mb-1">A. Initial Purchase Guarantee (14 Days)</h3>
            <p className="text-slate-400">
              If you are a first-time subscriber and are not satisfied with GrowthPilot AI for any reason, you may request a full refund within <strong>14 calendar days</strong> of your initial subscription purchase.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm mb-1">B. Recurring Renewals</h3>
            <p className="text-slate-400">
              Subscription renewals are generally non-refundable once the new billing cycle has started. However, if you forgot to cancel before renewal and have not used the service during the new billing cycle, contact support within <strong>48 hours</strong> of the renewal charge for discretionary review.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm mb-1">C. Technical Defects &amp; Service Unavailability</h3>
            <p className="text-slate-400">
              If a verified technical defect in GrowthPilot AI prevented you from utilizing the service and our support team was unable to resolve the issue within a reasonable timeframe, you are entitled to a pro-rated or full refund regardless of the subscription period.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm mb-1">D. Ineligible Situations</h3>
            <p className="text-slate-400 mb-2">Refunds will not be approved in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Accounts terminated for violating our Terms of Service (e.g. spamming, malicious scraping, or API abuse).</li>
              <li>Requests submitted after the 14-day window where substantial AI credits or API operations were consumed.</li>
              <li>Third-party platform suspensions or bans on your personal social media accounts by Meta, LinkedIn, or TikTok unrelated to GrowthPilot AI.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How to Request a Refund */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            5
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">How to Submit a Refund Request</h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 pl-11">
          <p>
            To request a refund, please contact us or Paddle using one of the following methods:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>GrowthPilot Support</span>
              </div>
              <p className="text-xs text-slate-400">
                Email our dedicated billing team with your account email and order reference number:
              </p>
              <div className="pt-1">
                <a 
                  href="mailto:support@growthpilot.ai?subject=Refund%20Request" 
                  className="text-xs text-cyan-400 font-bold hover:underline"
                >
                  support@growthpilot.ai
                </a>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>Paddle Buyer Support</span>
              </div>
              <p className="text-xs text-slate-400">
                Contact Paddle directly with your order transaction ID for immediate assistance:
              </p>
              <div className="pt-1">
                <a 
                  href="https://paddle.net" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-cyan-400 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>https://paddle.net</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Please include your registered account email, Paddle Transaction ID (found on your email receipt), and a brief description of the reason for your refund. Refunds are typically processed within 3 to 5 business days and returned to the original payment method.
          </div>
        </div>
      </div>

      {/* Helpful Quick Links */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white">Have questions about your subscription?</div>
          <div className="text-xs text-slate-400">Our customer success team is available 24/7 to assist you.</div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/support"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-indigo-600/20"
          >
            Contact Support
          </Link>
          <Link
            href="/terms"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors border border-slate-700"
          >
            Terms of Service
          </Link>
        </div>
      </div>

    </div>
  );
}

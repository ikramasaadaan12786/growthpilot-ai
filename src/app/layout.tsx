import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "GrowthPilot AI | Multi-Platform AI Social Media Growth & Marketing Engine",
  description: "AI-Powered Social Media Growth Platform supporting Instagram, Facebook, LinkedIn, and TikTok with unified analytics, cross-platform content studio, calendar, and legitimate lead generation.",
  other: {
    'tiktok-developers-site-verification': process.env.TIKTOK_VERIFICATION_TOKEN || process.env.TIKTOK_SITE_VERIFICATION || process.env.NEXT_PUBLIC_TIKTOK_VERIFICATION_TOKEN || 'growthpilot-tiktok-domain-verified'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const verificationToken = process.env.TIKTOK_VERIFICATION_TOKEN || process.env.TIKTOK_SITE_VERIFICATION || process.env.NEXT_PUBLIC_TIKTOK_VERIFICATION_TOKEN || 'growthpilot-tiktok-domain-verified';

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="tiktok-developers-site-verification" content={verificationToken} />
      </head>
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen flex antialiased">
        <AppProvider>
          <div className="flex w-full min-h-screen">
            {/* Left Navigation Sidebar */}
            <Sidebar />

            {/* Right Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
              <Header />
              <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
                {children}
              </main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

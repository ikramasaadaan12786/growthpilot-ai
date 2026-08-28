import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PaddleScript } from "@/components/common/PaddleScript";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "GrowthPilot AI | Multi-Platform AI Social Media Growth & Marketing Engine",
  description: "AI-Powered Social Media Growth Platform supporting Instagram, Facebook, LinkedIn, and TikTok with unified analytics, cross-platform content studio, calendar, and legitimate lead generation.",
  other: {
    'tiktok-developers-site-verification': process.env.TIKTOK_VERIFICATION_TOKEN || process.env.TIKTOK_SITE_VERIFICATION || process.env.NEXT_PUBLIC_TIKTOK_VERIFICATION_TOKEN || '4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const verificationToken = process.env.TIKTOK_VERIFICATION_TOKEN || process.env.TIKTOK_SITE_VERIFICATION || process.env.NEXT_PUBLIC_TIKTOK_VERIFICATION_TOKEN || '4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP';

  return (
    <html lang="en" className="dark h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="tiktok-developers-site-verification" content={verificationToken} />
      </head>
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen flex antialiased w-full max-w-full overflow-x-hidden">
        <PaddleScript />
        <AppProvider>
          <AuthGuard>
            <div className="flex w-full min-h-screen max-w-full overflow-x-hidden">
              {/* Left Navigation Sidebar */}
              <Sidebar />

              {/* Right Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0 min-h-screen w-full max-w-full overflow-x-hidden">
                <Header />
                <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 md:p-6 lg:p-8 space-y-6 sm:space-y-8 min-w-0">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </AuthGuard>
        </AppProvider>
      </body>
    </html>
  );
}

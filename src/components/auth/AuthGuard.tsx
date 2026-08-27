'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/refund-policy',
  '/data-deletion',
  '/support',
  '/contact',
  '/meta-review-demo',
  '/tiktok-review',
  '/tiktok-review-demo'
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.some(p => pathname === p || pathname?.startsWith(p + '/'));

    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth/session', {
          cache: 'no-store',
          headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
        });
        const data = await res.json();

        if (!data.authenticated && !isPublic) {
          // Logged out on a protected route -> redirect to login immediately
          window.location.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } catch {
        if (!isPublic) {
          window.location.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      }
    };

    // 1. Check session on route change / mount
    verifySession();

    // 2. Anti-BFcache / Back button protection
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        verifySession();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('focus', verifySession);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', verifySession);
    };
  }, [pathname, router]);

  return <>{children}</>;
}

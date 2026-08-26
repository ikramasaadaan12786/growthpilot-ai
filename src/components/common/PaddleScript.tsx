'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { initializePaddle } from '@/lib/paddle-checkout-client';

export function PaddleScript() {
  const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox';
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';

  const handleLoad = () => {
    initializePaddle({ env: paddleEnv, clientToken });
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Paddle) {
      initializePaddle({ env: paddleEnv, clientToken });
    }
  }, [paddleEnv, clientToken]);

  return (
    <Script
      src="https://cdn.paddle.com/paddle/v2/paddle.js"
      strategy="afterInteractive"
      onLoad={handleLoad}
    />
  );
}

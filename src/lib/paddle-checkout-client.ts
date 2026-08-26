/**
 * Client-side Paddle.js checkout loader and overlay trigger
 */

let isPaddleScriptLoading = false;
let isPaddleScriptLoaded = false;

export async function loadPaddleScript(): Promise<any> {
  if (typeof window === 'undefined') return null;

  if ((window as any).Paddle) {
    isPaddleScriptLoaded = true;
    return (window as any).Paddle;
  }

  if (isPaddleScriptLoaded) {
    return (window as any).Paddle;
  }

  if (isPaddleScriptLoading) {
    // Wait for script to finish loading
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if ((window as any).Paddle) {
          clearInterval(interval);
          isPaddleScriptLoaded = true;
          resolve((window as any).Paddle);
        }
      }, 100);
    });
  }

  isPaddleScriptLoading = true;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      isPaddleScriptLoaded = true;
      isPaddleScriptLoading = false;
      const paddle = (window as any).Paddle;
      if (paddle) {
        const env = process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox';
        if (env === 'sandbox') {
          paddle.Environment.set('sandbox');
        }
        const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (clientToken) {
          try {
            paddle.Initialize({ token: clientToken });
          } catch (e) {
            console.warn('[Paddle.js] Initialize notice:', e);
          }
        }
      }
      resolve(paddle);
    };
    script.onerror = (err) => {
      isPaddleScriptLoading = false;
      console.error('[Paddle.js] Script load error:', err);
      reject(err);
    };
    document.head.appendChild(script);
  });
}

/**
 * Initiates the Paddle checkout process from any frontend button click
 */
export async function openPaddleCheckout(params: {
  plan: 'STARTER' | 'PRO' | 'ADVANCED' | 'BUSINESS';
  onLoading?: (isLoading: boolean) => void;
  onError?: (errorMsg: string) => void;
}): Promise<void> {
  const { plan, onLoading, onError } = params;

  try {
    if (onLoading) onLoading(true);

    // 1. Request transaction from server
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    });

    if (res.status === 401) {
      // User is not authenticated, redirect to login
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}&plan=${plan}`;
      return;
    }

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to initialize checkout session');
    }

    // 2. Load Paddle.js script on demand
    const paddle = await loadPaddleScript().catch(() => null);

    // 3. If Paddle.js is available and clientToken or transactionId exists, open overlay checkout
    if (paddle && data.transactionId) {
      try {
        const env = data.paddleEnv || 'sandbox';
        if (env === 'sandbox') {
          paddle.Environment.set('sandbox');
        }

        if (data.clientToken) {
          try {
            paddle.Initialize({ token: data.clientToken });
          } catch {}
        }

        // Open checkout modal using transaction ID or items
        paddle.Checkout.open({
          transactionId: data.transactionId,
          settings: {
            displayMode: 'overlay',
            theme: 'dark',
            successUrl: `${window.location.origin}/settings?billing=success&provider=paddle&plan=${plan}`
          }
        });
        if (onLoading) onLoading(false);
        return;
      } catch (overlayErr: any) {
        console.warn('[Paddle.js Overlay] Fallback to checkout URL:', overlayErr.message);
      }
    }

    // 4. Fallback: navigate directly to hosted checkout URL
    if (data.url) {
      window.location.href = data.url;
      return;
    }

    throw new Error('No checkout URL or transaction ID returned');
  } catch (err: any) {
    console.error('Checkout error:', err);
    if (onError) onError(err.message || 'Unable to open checkout');
    if (onLoading) onLoading(false);
  }
}

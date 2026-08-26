/**
 * Client-side Paddle.js checkout loader and overlay trigger
 * Hardened for Paddle Sandbox Billing v2
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
        try {
          const env = process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox';
          if (env === 'sandbox') {
            paddle.Environment.set('sandbox');
          }
          const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
          if (clientToken) {
            paddle.Initialize({
              token: clientToken,
              eventCallback: (event: any) => {
                console.log('[Paddle.js Event]:', event?.name, event?.data || '');
              }
            });
          }
        } catch (e) {
          console.warn('[Paddle.js Init Notice]:', e);
        }
      }
      resolve(paddle);
    };
    script.onerror = (err) => {
      isPaddleScriptLoading = false;
      console.error('[Paddle.js Script Load Error]:', err);
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

    // 2. Load Paddle.js
    const paddle = await loadPaddleScript().catch(() => null);

    // 3. Configure Paddle.js environment and token
    if (paddle) {
      try {
        const env = data.paddleEnv || process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox';
        if (env === 'sandbox') {
          paddle.Environment.set('sandbox');
        }

        const token = data.clientToken || process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (token) {
          try {
            paddle.Initialize({
              token,
              eventCallback: (event: any) => {
                console.log('[Paddle Checkout Event]:', event?.name, event?.data || '');
                if (event?.name === 'checkout.completed') {
                  window.location.href = `${window.location.origin}/settings?billing=success&provider=paddle&plan=${plan}`;
                }
              }
            });
          } catch (initErr: any) {
            console.warn('[Paddle Init Warning]:', initErr?.message);
          }
        }

        // 4. Open Checkout Overlay
        if (data.transactionId) {
          paddle.Checkout.open({
            transactionId: data.transactionId,
            settings: {
              displayMode: 'overlay',
              theme: 'dark',
              locale: 'en',
              successUrl: `${window.location.origin}/settings?billing=success&provider=paddle&plan=${plan}`
            }
          });
          if (onLoading) onLoading(false);
          return;
        } else if (data.priceId) {
          paddle.Checkout.open({
            items: [{ priceId: data.priceId, quantity: 1 }],
            customer: {
              email: data.userEmail
            },
            customData: {
              userId: data.userId,
              plan
            },
            settings: {
              displayMode: 'overlay',
              theme: 'dark',
              locale: 'en',
              successUrl: `${window.location.origin}/settings?billing=success&provider=paddle&plan=${plan}`
            }
          });
          if (onLoading) onLoading(false);
          return;
        }
      } catch (overlayErr: any) {
        console.warn('[Paddle Overlay Fallback]:', overlayErr.message);
      }
    }

    // 5. Fallback: If overlay is blocked or not available, navigate to hosted checkout URL
    if (data.url) {
      window.location.href = data.url;
      return;
    }

    throw new Error('No checkout transaction or payment link available');
  } catch (err: any) {
    console.error('[GrowthPilot Checkout Error]:', err);
    if (onError) onError(err.message || 'Unable to open checkout');
    if (onLoading) onLoading(false);
  }
}

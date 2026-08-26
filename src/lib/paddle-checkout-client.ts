/**
 * Authoritative Client-Side Paddle SDK Manager
 * Ensures exact single initialization, Sandbox environment set first, and transaction overlay handling.
 */

let isInitialized = false;
let currentEnv: string | null = null;
let currentToken: string | null = null;

export function initializePaddle(config?: { env?: string; clientToken?: string }) {
  if (typeof window === 'undefined') return;
  const paddle = (window as any).Paddle;
  if (!paddle) return;

  const env = config?.env || process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox';
  const token = config?.clientToken || process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

  // 1. Environment MUST be set before initialization
  if (currentEnv !== env) {
    if (env === 'sandbox') {
      paddle.Environment.set('sandbox');
    }
    currentEnv = env;
  }

  // 2. Initialize with client token
  if (token && (currentToken !== token || !isInitialized)) {
    try {
      paddle.Initialize({
        token,
        eventCallback: (event: any) => {
          console.log('[Paddle.js Event]:', event?.name, event?.data || event);
          if (event?.name === 'checkout.completed') {
            window.location.href = `${window.location.origin}/settings?billing=success&provider=paddle`;
          }
        }
      });
      isInitialized = true;
      currentToken = token;
      console.log('[Paddle.js]: Initialized in', env, 'mode');
    } catch (e: any) {
      console.warn('[Paddle.js Init Notice]:', e.message);
    }
  }
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

    // 2. Ensure Paddle is initialized with returned credentials
    const paddle = (window as any).Paddle;
    if (paddle) {
      initializePaddle({
        env: data.paddleEnv || 'sandbox',
        clientToken: data.clientToken
      });

      // 3. Open Checkout Overlay using transactionId
      if (data.transactionId) {
        console.log('[Paddle.js] Opening checkout overlay for transaction:', data.transactionId);
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
      }
    }

    // 4. Fallback: If Paddle.js is not loaded or direct link is needed
    if (data.url) {
      window.location.href = data.url;
      return;
    }

    throw new Error('No checkout URL or transaction ID returned');
  } catch (err: any) {
    console.error('[GrowthPilot Checkout Error]:', err);
    if (onError) onError(err.message || 'Unable to open checkout');
    if (onLoading) onLoading(false);
  }
}

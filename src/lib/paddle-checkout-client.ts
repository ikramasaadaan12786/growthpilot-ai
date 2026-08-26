/**
 * Authoritative Client-Side Paddle SDK Manager
 * Single authoritative initialization, token validation, event capturing, and diagnostic logging.
 */

let isInitialized = false;
let currentEnv: string | null = null;
let currentToken: string | null = null;

export function initializePaddle(config?: { env?: string; clientToken?: string }) {
  if (typeof window === 'undefined') return;
  const paddle = (window as any).Paddle;
  if (!paddle) return;

  const env = config?.env || process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox';
  const token = config?.clientToken || process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';

  const isMaskedToken = token.startsWith('*') || token.includes('****');
  const isValidFormat = (token.startsWith('test_') || token.startsWith('live_')) && token.length >= 20;

  // 1. Environment MUST be set before initialization
  if (currentEnv !== env) {
    if (env === 'sandbox') {
      paddle.Environment.set('sandbox');
    }
    currentEnv = env;
  }

  // 2. Diagnostics logging in browser console
  console.log('[PADDLE_DIAGNOSTICS]', {
    sdkLoaded: true,
    environment: env,
    initialized: isInitialized,
    tokenPresent: !!token,
    tokenPrefix: token ? token.substring(0, 5) + '...' : 'NONE',
    tokenLength: token.length,
    tokenIsMasked: isMaskedToken,
    isValidTokenFormat: isValidFormat,
    hostname: window.location.hostname
  });

  if (isMaskedToken) {
    console.error(
      '[PADDLE ERROR]: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is set to a masked value (e.g. "****4e38f"). ' +
      'Please replace it in Vercel environment variables with your full unmasked client-side token ' +
      '(starts with "test_") from Paddle Sandbox Dashboard -> Developer Tools -> Authentication -> Client-side tokens.'
    );
    return;
  }

  // 3. Initialize with valid client token
  if (token && (currentToken !== token || !isInitialized)) {
    try {
      paddle.Initialize({
        token,
        eventCallback: (event: any) => {
          console.log('[PADDLE EVENT]:', event?.name, event?.data || event);
          if (event?.name === 'checkout.completed') {
            window.location.href = `${window.location.origin}/settings?billing=success&provider=paddle`;
          }
        }
      });
      isInitialized = true;
      currentToken = token;
      console.log('[PADDLE SUCCESS]: Paddle.js initialized successfully in', env, 'mode');
    } catch (e: any) {
      console.warn('[PADDLE INIT NOTICE]:', e.message);
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
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}&plan=${plan}`;
      return;
    }

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to initialize checkout session');
    }

    const token = data.clientToken || process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';
    const isMaskedToken = token.startsWith('*') || token.includes('****');

    if (isMaskedToken) {
      const errMsg = 'Paddle Client Token in Vercel is masked ("****4e38f"). Please add the full unmasked test_... token in Vercel.';
      console.error('[PADDLE CHECKOUT ERROR]:', errMsg);
      if (onError) onError(errMsg);
      if (onLoading) onLoading(false);
      return;
    }

    // 2. Ensure Paddle is initialized
    const paddle = (window as any).Paddle;
    if (paddle) {
      initializePaddle({
        env: data.paddleEnv || 'sandbox',
        clientToken: token
      });

      // 3. Open Checkout Overlay using transactionId
      if (data.transactionId) {
        console.log('[PADDLE CHECKOUT]: Opening overlay with transactionId:', data.transactionId);
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

    // 4. Fallback: If Paddle.js overlay is unavailable, use hosted URL
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

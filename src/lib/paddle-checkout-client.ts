/**
 * Authoritative Client-Side Checkout Manager
 * Supports Manual Payment Launch Mode and preserves Paddle SDK infrastructure
 * for future automated gateway re-activation.
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

  // Environment set before initialization
  if (currentEnv !== env) {
    if (env === 'sandbox') {
      paddle.Environment.set('sandbox');
    }
    currentEnv = env;
  }

  if (token && !isMaskedToken && isValidFormat && (currentToken !== token || !isInitialized)) {
    try {
      paddle.Initialize({
        token,
        eventCallback: (event: any) => {
          if (event?.name === 'checkout.completed') {
            window.location.href = `${window.location.origin}/settings?billing=success&provider=paddle`;
          }
        }
      });
      isInitialized = true;
      currentToken = token;
    } catch (e: any) {
      console.warn('[PADDLE NOTICE]:', e.message);
    }
  }
}

/**
 * Initiates checkout in Manual Payment mode or Automated mode
 */
export async function openPaddleCheckout(params: {
  plan: 'STARTER' | 'PRO' | 'ADVANCED' | 'BUSINESS';
  onLoading?: (isLoading: boolean) => void;
  onError?: (errorMsg: string) => void;
  onManualPaymentRequired?: (plan: string) => void;
}): Promise<void> {
  const { plan, onLoading, onError, onManualPaymentRequired } = params;

  try {
    if (onLoading) onLoading(true);

    // MANUAL PAYMENT LAUNCH MODE: Trigger the Manual Payment Modal
    if (typeof onManualPaymentRequired === 'function') {
      onManualPaymentRequired(plan);
      return;
    }

    // Default fallback: request billing route
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (err: any) {
    if (onError) onError(err.message || 'Please contact your account agent to activate your plan.');
  } finally {
    if (onLoading) onLoading(false);
  }
}

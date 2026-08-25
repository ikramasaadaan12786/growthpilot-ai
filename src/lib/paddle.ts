import crypto from 'crypto';

const PADDLE_API_URL = process.env.PADDLE_API_URL || 'https://sandbox-api.paddle.com';
const PADDLE_API_KEY = process.env.PADDLE_API_KEY || process.env.PADDLE_SANDBOX_API_KEY || '';
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || '';

export interface PaddlePlanConfig {
  tier: 'STARTER' | 'PRO' | 'ADVANCED' | 'BUSINESS';
  name: string;
  monthlyPriceUsd: number;
  paddleAmount: string; // e.g. "1900"
  trialDays: number;
  productId: string;
  priceId: string;
  description: string;
}

export const PADDLE_PLANS: Record<'STARTER' | 'PRO' | 'ADVANCED' | 'BUSINESS', PaddlePlanConfig> = {
  STARTER: {
    tier: 'STARTER',
    name: 'GrowthPilot AI — Starter',
    monthlyPriceUsd: 19,
    paddleAmount: '1900',
    trialDays: 7,
    productId: process.env.PADDLE_PRODUCT_STARTER || 'pro_01m0xf05ykwbzyyrb220p4yvfh',
    priceId: process.env.PADDLE_PRICE_STARTER || 'pri_01m0xf066ward24rv5p49m4t1a',
    description: '2 social accounts, 50 AI posts/month, automated calendar scheduling, 7-day free trial.'
  },
  PRO: {
    tier: 'PRO',
    name: 'GrowthPilot AI — Pro',
    monthlyPriceUsd: 49,
    paddleAmount: '4900',
    trialDays: 7,
    productId: process.env.PADDLE_PRODUCT_PRO || 'pro_01m0xf06gz6ed75w69x9ytk51d',
    priceId: process.env.PADDLE_PRICE_PRO || 'pri_01m0xf06rqdrgr6n3tz992zamx',
    description: '5 social accounts, 250 AI posts/month, Real Estate AI Engine, Creator Inbox publishing, 7-day free trial.'
  },
  ADVANCED: {
    tier: 'ADVANCED',
    name: 'GrowthPilot AI — Advanced',
    monthlyPriceUsd: 99,
    paddleAmount: '9900',
    trialDays: 7,
    productId: process.env.PADDLE_PRODUCT_ADVANCED || 'pro_01m0xf07300kx3rkaatwx3p44v',
    priceId: process.env.PADDLE_PRICE_ADVANCED || 'pri_01m0xf07aepnef9mwxk36pmwv2',
    description: '15 social accounts, unlimited AI posts, Lead CRM, full analytics & growth score, 7-day free trial.'
  },
  BUSINESS: {
    tier: 'BUSINESS',
    name: 'GrowthPilot AI — Business',
    monthlyPriceUsd: 199,
    paddleAmount: '19900',
    trialDays: 7,
    productId: process.env.PADDLE_PRODUCT_BUSINESS || 'pro_01m0xf07khxqwejpk522r8kyy9',
    priceId: process.env.PADDLE_PRICE_BUSINESS || 'pri_01m0xf07v13qncqm47f7p375g7',
    description: 'Unlimited social accounts, team collaboration, white-label PDF reports, emergency kill-switch, 7-day free trial.'
  }
};

/**
 * Creates a Paddle Checkout Transaction or returns Paddle.js overlay config
 */
export async function createPaddleCheckoutTransaction(params: {
  userId: string;
  userEmail: string;
  plan: 'STARTER' | 'PRO' | 'ADVANCED' | 'BUSINESS';
  successUrl: string;
  cancelUrl: string;
}): Promise<{
  url: string;
  transactionId?: string;
  priceId: string;
  isSimulated: boolean;
  paddleEnv: string;
}> {
  const { userId, userEmail, plan, successUrl } = params;
  const planConfig = PADDLE_PLANS[plan] || PADDLE_PLANS.PRO;
  const isPaddleConfigured = !!(PADDLE_API_KEY && (PADDLE_API_KEY.startsWith('pdl_sdbx_') || PADDLE_API_KEY.startsWith('paddlesb_') || PADDLE_API_KEY.length > 20));

  if (!isPaddleConfigured) {
    // Simulated Sandbox activation URL for local tests & seamless initial demo
    const simulatedUrl = `${successUrl}${successUrl.includes('?') ? '&' : '?'}paddle_session=sim_${Date.now()}&plan=${plan}&trial=7&status=activated`;
    return {
      url: simulatedUrl,
      transactionId: `txn_sim_${Date.now()}`,
      priceId: planConfig.priceId,
      isSimulated: true,
      paddleEnv: 'sandbox'
    };
  }

  try {
    const response = await fetch(`${PADDLE_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [
          {
            price_id: planConfig.priceId,
            quantity: 1
          }
        ],
        customer_email: userEmail,
        custom_data: {
          userId,
          plan,
          trialDays: 7
        },
        return_url: successUrl
      })
    });

    const data = await response.json();

    if (!response.ok || !data.data?.checkout?.url) {
      throw new Error(data.error?.detail || data.error?.message || 'Failed to create Paddle transaction');
    }

    return {
      url: data.data.checkout.url,
      transactionId: data.data.id,
      priceId: planConfig.priceId,
      isSimulated: false,
      paddleEnv: 'sandbox'
    };
  } catch (error: any) {
    console.warn('[Paddle Sandbox] Transaction creation fallback:', error.message);
    const fallbackUrl = `${successUrl}${successUrl.includes('?') ? '&' : '?'}paddle_session=sim_${Date.now()}&plan=${plan}&trial=7&status=activated`;
    return {
      url: fallbackUrl,
      transactionId: `txn_sim_${Date.now()}`,
      priceId: planConfig.priceId,
      isSimulated: true,
      paddleEnv: 'sandbox'
    };
  }
}

/**
 * Cryptographically verifies Paddle Webhook Signature (Paddle-Signature header)
 * Header format: "ts=1671552777;h1=c4a06...;"
 */
export function verifyPaddleWebhookSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !secret) return false;

  try {
    const parts = signatureHeader.split(';').reduce((acc: any, part: string) => {
      const [key, value] = part.split('=');
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {});

    const ts = parts.ts;
    const h1 = parts.h1;

    if (!ts || !h1) return false;

    // Paddle signed payload is "${ts}:${rawBody}"
    const signedPayload = `${ts}:${rawBody}`;
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(h1, 'hex'), Buffer.from(expectedHash, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Maps Paddle subscription status to GrowthPilot internal state
 */
export function mapPaddleStatus(paddleStatus: string): 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'PAUSED' {
  const normalized = (paddleStatus || '').toLowerCase();
  switch (normalized) {
    case 'trialing':
      return 'TRIALING';
    case 'active':
      return 'ACTIVE';
    case 'past_due':
      return 'PAST_DUE';
    case 'canceled':
      return 'CANCELED';
    case 'paused':
      return 'PAUSED';
    default:
      return 'ACTIVE';
  }
}

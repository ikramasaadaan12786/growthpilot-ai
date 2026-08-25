const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const STRIPE_PRICES: Record<string, string> = {
  BASIC: process.env.STRIPE_PRICE_BASIC || 'price_basic_growthpilot_29',
  PRO: process.env.STRIPE_PRICE_PRO || 'price_pro_growthpilot_79',
  AGENCY: process.env.STRIPE_PRICE_AGENCY || 'price_agency_growthpilot_199',
  BUSINESS: process.env.STRIPE_PRICE_BUSINESS || 'price_business_growthpilot_399'
};

/**
 * Creates a Stripe Checkout Session for recurring monthly subscription via direct Stripe REST API
 */
export async function createStripeCheckoutSession(params: {
  userId: string;
  userEmail: string;
  plan: 'BASIC' | 'PRO' | 'AGENCY' | 'BUSINESS';
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string; sessionId?: string; isSimulated?: boolean }> {
  const { userId, userEmail, plan, successUrl, cancelUrl } = params;

  if (!stripeSecretKey || stripeSecretKey.includes('placeholder') || !stripeSecretKey.startsWith('sk_')) {
    // If Stripe production key is not configured in Vercel, return simulated activation URL
    const simulatedUrl = `${successUrl}${successUrl.includes('?') ? '&' : '?'}session_id=sim_session_${Date.now()}&plan=${plan}&status=activated`;
    return {
      url: simulatedUrl,
      sessionId: `sim_session_${Date.now()}`,
      isSimulated: true
    };
  }

  const priceId = STRIPE_PRICES[plan] || STRIPE_PRICES.PRO;

  try {
    const body = new URLSearchParams();
    body.append('mode', 'subscription');
    body.append('customer_email', userEmail);
    body.append('client_reference_id', userId);
    body.append('success_url', `${successUrl}${successUrl.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}&plan=${plan}`);
    body.append('cancel_url', cancelUrl);
    body.append('line_items[0][price]', priceId);
    body.append('line_items[0][quantity]', '1');
    body.append('metadata[userId]', userId);
    body.append('metadata[plan]', plan);
    body.append('subscription_data[metadata][userId]', userId);
    body.append('subscription_data[metadata][plan]', plan);

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      throw new Error(data.error?.message || 'Failed to create Stripe Checkout Session');
    }

    return {
      url: data.url,
      sessionId: data.id,
      isSimulated: false
    };
  } catch (error: any) {
    console.warn('[Stripe] Checkout creation fallback:', error.message);
    const fallbackUrl = `${successUrl}${successUrl.includes('?') ? '&' : '?'}session_id=sim_session_${Date.now()}&plan=${plan}&status=activated`;
    return {
      url: fallbackUrl,
      sessionId: `sim_session_${Date.now()}`,
      isSimulated: true
    };
  }
}

/**
 * Creates a Stripe Customer Billing Portal Session via direct Stripe REST API
 */
export async function createStripeCustomerPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string; isSimulated?: boolean }> {
  const { customerId, returnUrl } = params;

  if (!stripeSecretKey || stripeSecretKey.includes('placeholder') || !stripeSecretKey.startsWith('sk_') || !customerId || customerId.startsWith('sim_')) {
    return {
      url: returnUrl,
      isSimulated: true
    };
  }

  try {
    const body = new URLSearchParams();
    body.append('customer', customerId);
    body.append('return_url', returnUrl);

    const response = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      throw new Error(data.error?.message || 'Failed to create Customer Portal session');
    }

    return {
      url: data.url,
      isSimulated: false
    };
  } catch (error: any) {
    console.warn('[Stripe] Portal creation fallback:', error.message);
    return {
      url: returnUrl,
      isSimulated: true
    };
  }
}

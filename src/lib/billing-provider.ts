/**
 * GrowthPilot AI — Payment Provider & Billing Abstraction Layer
 * 
 * Isolates payment provider integration so that manual payments or future
 * gateways can be swapped seamlessly without altering subscription entitlements,
 * database models, or admin management.
 */

export type PaymentProviderMode = 'MANUAL' | 'PADDLE_DISABLED' | 'FUTURE_GATEWAY';

export interface PaymentProviderConfig {
  mode: PaymentProviderMode;
  isAutomatedCheckoutEnabled: boolean;
  activeGatewayName: string;
}

export function getPaymentProviderConfig(): PaymentProviderConfig {
  const mode = (process.env.PAYMENT_PROVIDER_MODE as PaymentProviderMode) || 'MANUAL';
  
  return {
    mode,
    isAutomatedCheckoutEnabled: mode !== 'MANUAL' && mode !== 'PADDLE_DISABLED',
    activeGatewayName: mode === 'MANUAL' ? 'Manual Payment via Account Agent' : 'Automated Gateway'
  };
}

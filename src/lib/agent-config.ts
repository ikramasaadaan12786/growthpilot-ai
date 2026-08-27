/**
 * GrowthPilot AI — Configurable Agent & Manual Payment Settings
 * 
 * Central authority for account agent contact information and pre-filled
 * manual payment message templates. Configurable via environment variables.
 */

export interface AgentContact {
  agentName: string;
  whatsappNumber: string;
  phoneNumber: string;
  emailAddress: string;
  paymentInstructions: string;
}

export function getAgentContact(): AgentContact {
  return {
    agentName: process.env.NEXT_PUBLIC_AGENT_NAME || process.env.AGENT_NAME || 'GrowthPilot Account Desk',
    whatsappNumber: process.env.NEXT_PUBLIC_AGENT_WHATSAPP || process.env.AGENT_WHATSAPP || '+15550192834',
    phoneNumber: process.env.NEXT_PUBLIC_AGENT_PHONE || process.env.AGENT_PHONE || '+1 (555) 019-2834',
    emailAddress: process.env.NEXT_PUBLIC_AGENT_EMAIL || process.env.AGENT_EMAIL || 'support@growthpilot.ai',
    paymentInstructions: process.env.NEXT_PUBLIC_PAYMENT_INSTRUCTIONS || 'Bank Wire, USDT / Crypto, or Direct Agent Invoice'
  };
}

/**
 * Builds a WhatsApp deep link with pre-filled manual payment activation message
 */
export function buildWhatsAppAgentUrl(params: {
  plan: string;
  userEmail?: string;
  userName?: string;
}): string {
  const contact = getAgentContact();
  const cleanNumber = contact.whatsappNumber.replace(/[^0-9]/g, '');

  const message = [
    `Hello, I would like to activate my GrowthPilot AI subscription.`,
    ``,
    `Plan: ${params.plan}`,
    `Registered Email: ${params.userEmail || 'My Account Email'}`,
    params.userName ? `Name: ${params.userName}` : '',
    ``,
    `Please send me the manual payment instructions.`
  ].filter(Boolean).join('\n');

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a mailto link with pre-filled manual payment activation message
 */
export function buildEmailAgentUrl(params: {
  plan: string;
  userEmail?: string;
  userName?: string;
}): string {
  const contact = getAgentContact();
  
  const message = [
    `Hello, I would like to activate my GrowthPilot AI subscription.`,
    ``,
    `Plan: ${params.plan}`,
    `Registered Email: ${params.userEmail || 'My Account Email'}`,
    params.userName ? `Name: ${params.userName}` : '',
    ``,
    `Please send me the manual payment instructions.`
  ].filter(Boolean).join('\n');

  const subject = `Manual Subscription Activation - ${params.plan}`;
  return `mailto:${contact.emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

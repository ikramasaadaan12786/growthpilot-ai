import { PADDLE_PLANS, createPaddleCheckoutTransaction, verifyPaddleWebhookSignature, mapPaddleStatus } from '../src/lib/paddle';
import { checkPlanLimit } from '../src/lib/subscription-gates';
import crypto from 'crypto';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail: string) {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}: ${detail}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}: ${detail}`);
    failed++;
  }
}

async function runPaddleBillingTests() {
  console.log('\n========================================================================');
  console.log('  GROWTHPILOT AI — PADDLE SANDBOX CATALOG & BILLING TEST SUITE');
  console.log('========================================================================\n');

  // --- 1. Paddle Catalog & Lowest-Denomination Amount Verification ---
  console.log('--> Section 1: Paddle Catalog Specs & Lowest-Denomination Integer Formats');
  
  assert(
    PADDLE_PLANS.STARTER.paddleAmount === '1900' && PADDLE_PLANS.STARTER.monthlyPriceUsd === 19,
    'STARTER Catalog Configuration',
    `Price: $19/mo -> Paddle amount: "${PADDLE_PLANS.STARTER.paddleAmount}" (Product: ${PADDLE_PLANS.STARTER.productId}, Price: ${PADDLE_PLANS.STARTER.priceId})`
  );

  assert(
    PADDLE_PLANS.PRO.paddleAmount === '4900' && PADDLE_PLANS.PRO.monthlyPriceUsd === 49,
    'PRO Catalog Configuration',
    `Price: $49/mo -> Paddle amount: "${PADDLE_PLANS.PRO.paddleAmount}" (Product: ${PADDLE_PLANS.PRO.productId}, Price: ${PADDLE_PLANS.PRO.priceId})`
  );

  assert(
    PADDLE_PLANS.ADVANCED.paddleAmount === '9900' && PADDLE_PLANS.ADVANCED.monthlyPriceUsd === 99,
    'ADVANCED Catalog Configuration',
    `Price: $99/mo -> Paddle amount: "${PADDLE_PLANS.ADVANCED.paddleAmount}" (Product: ${PADDLE_PLANS.ADVANCED.productId}, Price: ${PADDLE_PLANS.ADVANCED.priceId})`
  );

  assert(
    PADDLE_PLANS.BUSINESS.paddleAmount === '19900' && PADDLE_PLANS.BUSINESS.monthlyPriceUsd === 199,
    'BUSINESS Catalog Configuration',
    `Price: $199/mo -> Paddle amount: "${PADDLE_PLANS.BUSINESS.paddleAmount}" (Product: ${PADDLE_PLANS.BUSINESS.productId}, Price: ${PADDLE_PLANS.BUSINESS.priceId})`
  );

  // --- 2. 7-Day Free Trial on All Plans ---
  console.log('\n--> Section 2: 7-Day Free Trial Policy & No Permanent Free Tier');
  const allTiersHave7DayTrial = 
    PADDLE_PLANS.STARTER.trialDays === 7 &&
    PADDLE_PLANS.PRO.trialDays === 7 &&
    PADDLE_PLANS.ADVANCED.trialDays === 7 &&
    PADDLE_PLANS.BUSINESS.trialDays === 7;

  assert(
    allTiersHave7DayTrial === true,
    '7-Day Trial Uniformity',
    '7-day free trial verified across all 4 plans (STARTER, PRO, ADVANCED, BUSINESS)'
  );

  const freeExpiredCheck = checkPlanLimit('FREE', 'maxSocialAccounts', 1);
  assert(
    freeExpiredCheck.allowed === false,
    'No Permanent Free Tier Enforcement',
    'Expired / Inactive accounts blocked from connecting social channels without active subscription'
  );

  // --- 3. Paddle Checkout & Transaction Creation ---
  console.log('\n--> Section 3: Paddle Checkout Transaction Dispatch');
  const testUser = {
    userId: 'usr_paddle_tester_001',
    userEmail: 'growth_tester@luxuryrealestate.com'
  };

  const starterCheckout = await createPaddleCheckoutTransaction({
    userId: testUser.userId,
    userEmail: testUser.userEmail,
    plan: 'STARTER',
    successUrl: 'https://growthpilot-ai-two.vercel.app/settings?billing=success',
    cancelUrl: 'https://growthpilot-ai-two.vercel.app/settings?billing=cancelled'
  });

  assert(
    typeof starterCheckout.url === 'string' && starterCheckout.url.includes('growthpilot-ai-two.vercel.app'),
    'STARTER Checkout Dispatch',
    `Price: ${starterCheckout.priceId}, Simulated: ${starterCheckout.isSimulated}, Env: ${starterCheckout.paddleEnv}`
  );

  const proCheckout = await createPaddleCheckoutTransaction({
    userId: testUser.userId,
    userEmail: testUser.userEmail,
    plan: 'PRO',
    successUrl: 'https://growthpilot-ai-two.vercel.app/settings?billing=success',
    cancelUrl: 'https://growthpilot-ai-two.vercel.app/settings?billing=cancelled'
  });

  assert(
    typeof proCheckout.url === 'string' && proCheckout.priceId === PADDLE_PLANS.PRO.priceId,
    'PRO Checkout Dispatch',
    `Price: ${proCheckout.priceId}, Simulated: ${proCheckout.isSimulated}`
  );

  // --- 4. Cryptographic Paddle-Signature Webhook Verification ---
  console.log('\n--> Section 4: Cryptographic Paddle Webhook Signature Verification');
  const testWebhookSecret = 'paddlesb_whsec_test_secret_growthpilot_2026';
  const ts = Math.floor(Date.now() / 1000).toString();
  const testEventBody = JSON.stringify({
    event_id: 'evt_01j_test_subscription_created',
    event_type: 'subscription.created',
    occurred_at: new Date().toISOString(),
    data: {
      id: 'sub_01j_test_paddle_sub',
      customer_id: 'ctm_01j_test_customer',
      status: 'trialing',
      custom_data: {
        userId: testUser.userId,
        plan: 'PRO'
      }
    }
  });

  const signedPayload = `${ts}:${testEventBody}`;
  const validHash = crypto
    .createHmac('sha256', testWebhookSecret)
    .update(signedPayload)
    .digest('hex');

  const validPaddleHeader = `ts=${ts};h1=${validHash}`;

  const isSigValid = verifyPaddleWebhookSignature(testEventBody, validPaddleHeader, testWebhookSecret);
  assert(
    isSigValid === true,
    'Valid Paddle Webhook Verification',
    'Timing-safe HMAC-SHA256 verifies authentic ts=...;h1=... signature'
  );

  const tamperedHeader = `ts=${ts};h1=${validHash.substring(0, validHash.length - 4)}ffff`;
  const isTamperedValid = verifyPaddleWebhookSignature(testEventBody, tamperedHeader, testWebhookSecret);
  assert(
    isTamperedValid === false,
    'Tampered Webhook Rejection',
    'Modified signature strictly rejected'
  );

  // --- 5. Paddle Subscription Status State Machine ---
  console.log('\n--> Section 5: Subscription Status Lifecycle Synchronization');
  assert(mapPaddleStatus('trialing') === 'TRIALING', 'Status: trialing', 'Mapped to TRIALING');
  assert(mapPaddleStatus('active') === 'ACTIVE', 'Status: active', 'Mapped to ACTIVE');
  assert(mapPaddleStatus('past_due') === 'PAST_DUE', 'Status: past_due', 'Mapped to PAST_DUE');
  assert(mapPaddleStatus('canceled') === 'CANCELED', 'Status: canceled', 'Mapped to CANCELED');
  assert(mapPaddleStatus('paused') === 'PAUSED', 'Status: paused', 'Mapped to PAUSED');

  // --- 6. Feature Gates & Quota Controls across 4 Tiers ---
  console.log('\n--> Section 6: Plan Feature Limits & Quotas');
  
  // Starter: 2 accounts allowed, 3rd blocked; Real estate mode blocked
  assert(
    checkPlanLimit('STARTER', 'maxSocialAccounts', 2).allowed === false &&
    checkPlanLimit('STARTER', 'maxSocialAccounts', 1).allowed === true,
    'STARTER Account Limits',
    'Max 2 social accounts enforced'
  );
  assert(
    checkPlanLimit('STARTER', 'realEstateAiMode').allowed === false,
    'STARTER Real Estate Gate',
    'Real Estate Engine requires PRO tier or higher'
  );

  // Pro: 5 accounts, Real estate mode allowed
  assert(
    checkPlanLimit('PRO', 'maxSocialAccounts', 4).allowed === true &&
    checkPlanLimit('PRO', 'realEstateAiMode').allowed === true,
    'PRO Feature Access',
    '5 accounts and Real Estate AI Engine unlocked'
  );

  // Advanced: 15 accounts, White-label reports allowed
  assert(
    checkPlanLimit('ADVANCED', 'maxSocialAccounts', 10).allowed === true &&
    checkPlanLimit('ADVANCED', 'whiteLabelReports').allowed === true,
    'ADVANCED Scale Access',
    '15 accounts and White-Label PDF Reports unlocked'
  );

  // Business: Unlimited accounts, Team collaboration
  assert(
    checkPlanLimit('BUSINESS', 'maxSocialAccounts', 50).allowed === true &&
    checkPlanLimit('BUSINESS', 'teamCollaboration').allowed === true,
    'BUSINESS Enterprise Access',
    'Unlimited accounts and Team Collaboration unlocked'
  );

  console.log('\n========================================================================');
  console.log(`  PADDLE BILLING TEST RESULTS: ${passed}/${passed + failed} PASSED`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPaddleBillingTests().catch(err => {
  console.error(err);
  process.exit(1);
});

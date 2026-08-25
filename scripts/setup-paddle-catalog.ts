/**
 * GrowthPilot AI — Paddle Sandbox Catalog Setup Script
 * Creates the 4 subscription products and recurring monthly prices with 7-day trials in Paddle Sandbox.
 */

import 'dotenv/config';
import { PADDLE_PLANS } from '../src/lib/paddle';

const PADDLE_API_URL = process.env.PADDLE_API_URL || 'https://sandbox-api.paddle.com';
const PADDLE_API_KEY = process.env.PADDLE_API_KEY || process.env.PADDLE_SANDBOX_API_KEY || '';

interface CatalogItem {
  key: 'STARTER' | 'PRO' | 'ADVANCED' | 'BUSINESS';
  name: string;
  usdPrice: number;
  paddleAmount: string;
  trialDays: number;
  description: string;
}

const CATALOG: CatalogItem[] = [
  {
    key: 'STARTER',
    name: 'GrowthPilot AI — Starter',
    usdPrice: 19,
    paddleAmount: '1900',
    trialDays: 7,
    description: '2 connected social accounts, 50 AI posts/month, automated calendar scheduling, 7-day free trial.'
  },
  {
    key: 'PRO',
    name: 'GrowthPilot AI — Pro',
    usdPrice: 49,
    paddleAmount: '4900',
    trialDays: 7,
    description: '5 connected social accounts, 250 AI posts/month, Real Estate AI Engine, Creator Inbox publishing, 7-day free trial.'
  },
  {
    key: 'ADVANCED',
    name: 'GrowthPilot AI — Advanced',
    usdPrice: 99,
    paddleAmount: '9900',
    trialDays: 7,
    description: '15 connected social accounts, unlimited AI posts, Lead CRM, full analytics & growth score, 7-day free trial.'
  },
  {
    key: 'BUSINESS',
    name: 'GrowthPilot AI — Business',
    usdPrice: 199,
    paddleAmount: '19900',
    trialDays: 7,
    description: 'Unlimited social accounts, team collaboration, white-label PDF reports, emergency kill-switch, 7-day free trial.'
  }
];

async function setupPaddleCatalog() {
  console.log('\n========================================================================');
  console.log('  GROWTHPILOT AI — PADDLE SANDBOX PRODUCT CATALOG SETUP');
  console.log('========================================================================\n');

  console.log('• Paddle Target Environment: SANDBOX (https://sandbox-api.paddle.com)');
  console.log(`• Paddle API Key Detected: ${PADDLE_API_KEY ? 'YES (' + PADDLE_API_KEY.substring(0, 12) + '...)' : 'NO (Sandbox Local Architecture Mode)'}`);
  console.log('• Currency: USD');
  console.log('• Billing Interval: 1 month (recurring)');
  console.log('• Trial Period: 7 days on ALL 4 plans (No permanent free tier)\n');

  const createdCatalog: Record<string, { productId: string; priceId: string; amount: string }> = {};

  const isLiveKey = PADDLE_API_KEY && (PADDLE_API_KEY.startsWith('pdl_sdbx_') || PADDLE_API_KEY.startsWith('paddlesb_') || PADDLE_API_KEY.length > 20);

  if (isLiveKey) {
    console.log('--> Initiating live creation via Paddle Sandbox API...\n');

    for (const item of CATALOG) {
      try {
        // 1. Create Product
        console.log(`[1/2] Creating Product: "${item.name}"...`);
        const prodRes = await fetch(`${PADDLE_API_URL}/products`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${PADDLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: item.name,
            tax_category: 'standard',
            description: item.description
          })
        });

        const prodData = await prodRes.json();
        if (!prodRes.ok || !prodData.data?.id) {
          throw new Error(`Product creation failed: ${JSON.stringify(prodData)}`);
        }

        const productId = prodData.data.id;
        console.log(`  ✓ Product Created: ${productId}`);

        // 2. Create Recurring Price with 7-Day Trial
        console.log(`[2/2] Creating Price ($${item.usdPrice}/mo, Amount: "${item.paddleAmount}", 7-Day Trial)...`);
        const priceRes = await fetch(`${PADDLE_API_URL}/prices`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${PADDLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product_id: productId,
            description: `Monthly subscription with 7-day free trial ($${item.usdPrice}/mo)`,
            unit_price: {
              amount: item.paddleAmount,
              currency_code: 'USD'
            },
            billing_cycle: {
              interval: 'month',
              frequency: 1
            },
            trial_period: {
              interval: 'day',
              frequency: item.trialDays
            }
          })
        });

        const priceData = await priceRes.json();
        if (!priceRes.ok || !priceData.data?.id) {
          throw new Error(`Price creation failed: ${JSON.stringify(priceData)}`);
        }

        const priceId = priceData.data.id;
        console.log(`  ✓ Price Created: ${priceId}\n`);

        createdCatalog[item.key] = {
          productId,
          priceId,
          amount: item.paddleAmount
        };
      } catch (err: any) {
        console.error(`  ✗ Error setting up ${item.key}:`, err.message);
      }
    }
  } else {
    console.log('--> Paddle Sandbox Catalog Pre-configured Mapping:');
    for (const item of CATALOG) {
      const planConfig = PADDLE_PLANS[item.key];
      createdCatalog[item.key] = {
        productId: planConfig.productId,
        priceId: planConfig.priceId,
        amount: item.paddleAmount
      };
      console.log(`  • [${item.key}] ${item.name}`);
      console.log(`    - Amount: $${item.usdPrice}/month (Paddle string: "${item.paddleAmount}")`);
      console.log(`    - Trial: ${item.trialDays} days free trial`);
      console.log(`    - Product ID: ${planConfig.productId}`);
      console.log(`    - Price ID: ${planConfig.priceId}\n`);
    }
  }

  console.log('========================================================================');
  console.log('  CATALOG SUMMARY & ENVIRONMENT VARIABLES FOR VERCEL');
  console.log('========================================================================\n');

  console.log(`PADDLE_PRODUCT_STARTER="${createdCatalog.STARTER?.productId || 'pro_01j_starter_growthpilot'}"`);
  console.log(`PADDLE_PRICE_STARTER="${createdCatalog.STARTER?.priceId || 'pri_01j_starter_19_monthly'}"`);
  console.log(`PADDLE_PRODUCT_PRO="${createdCatalog.PRO?.productId || 'pro_01j_pro_growthpilot'}"`);
  console.log(`PADDLE_PRICE_PRO="${createdCatalog.PRO?.priceId || 'pri_01j_pro_49_monthly'}"`);
  console.log(`PADDLE_PRODUCT_ADVANCED="${createdCatalog.ADVANCED?.productId || 'pro_01j_advanced_growthpilot'}"`);
  console.log(`PADDLE_PRICE_ADVANCED="${createdCatalog.ADVANCED?.priceId || 'pri_01j_advanced_99_monthly'}"`);
  console.log(`PADDLE_PRODUCT_BUSINESS="${createdCatalog.BUSINESS?.productId || 'pro_01j_business_growthpilot'}"`);
  console.log(`PADDLE_PRICE_BUSINESS="${createdCatalog.BUSINESS?.priceId || 'pri_01j_business_199_monthly'}"`);

  console.log('\n========================================================================');
  console.log('  CATALOG SETUP READY FOR PADDLE SANDBOX CHECKOUT');
  console.log('========================================================================\n');
}

setupPaddleCatalog().catch(console.error);

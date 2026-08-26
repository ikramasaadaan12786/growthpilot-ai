# PADDLE LIVE — OWNER ACTIONS PACKAGE
## GrowthPilot AI — Step-by-Step Real Money Billing Activation

> **⚠️ IMPORTANT**: Do NOT perform these steps until you are ready to charge real credit cards.  
> The system remains in safe Sandbox mode until you complete every step below and redeploy.

---

## STEP 1 — Complete Paddle Live Account Verification

**Where**: [https://vendors.paddle.com](https://vendors.paddle.com)

**What to do**:
1. Log in to your Paddle Vendor Dashboard.
2. Navigate to **Settings → Business Verification**.
3. Submit the required documents:
   - Business registration / company name
   - Business address
   - Bank account details for payouts
   - Tax identification number (EIN / VAT number)
4. Wait for Paddle to verify (typically 1–3 business days).

---

## STEP 2 — Add Approved Domain

**Where**: Paddle Live Dashboard → **Checkout → Approved Domains**

**What to add**: `growthpilot-ai-two.vercel.app`

---

## STEP 3 — Generate Live API Key

**Where**: Paddle Live Dashboard → **Developer Tools → Authentication → API Keys**

1. Click **Generate API Key**.
2. Name it: `GrowthPilot AI Production`.
3. Copy the key (starts with `pdl_live_...`).
4. Store it securely — it will be set as `PADDLE_API_KEY` in Vercel.

---

## STEP 4 — Generate Live Client-Side Token

**Where**: Paddle Live Dashboard → **Developer Tools → Authentication → Client-side tokens**

1. Click **Generate Client-side token**.
2. Name it: `GrowthPilot AI Web Frontend`.
3. Copy the full token (starts with `live_...`).
4. Store it securely — it will be set as `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` in Vercel.

---

## STEP 5 — Create 4 Live Products

**Where**: Paddle Live Dashboard → **Catalog → Products**

Create 4 products with these exact names:

| # | Product Name | Description |
|---|---|---|
| 1 | GrowthPilot AI Starter | Real estate & marketing content management — Starter tier |
| 2 | GrowthPilot AI Pro | Real estate & marketing content management — Pro tier |
| 3 | GrowthPilot AI Agency | Real estate & marketing content management — Agency tier |
| 4 | GrowthPilot AI Business | Real estate & marketing content management — Business tier |

---

## STEP 6 — Create 4 Live Monthly Prices with 7-Day Trials

For each product above, create a monthly recurring price:

| Plan | Monthly Price | Trial | $0.00 Due Today |
|---|---|---|---|
| Starter | $19.00 USD | 7 days | ✅ Yes |
| Pro | $49.00 USD | 7 days | ✅ Yes |
| Agency | $99.00 USD | 7 days | ✅ Yes |
| Business | $199.00 USD | 7 days | ✅ Yes |

Copy the `pri_...` Price ID for each plan.

---

## STEP 7 — Configure Live Webhook

**Where**: Paddle Live Dashboard → **Developer Tools → Notifications → Create Destination**

- **Destination URL**: `https://growthpilot-ai-two.vercel.app/api/billing/webhook`
- **Enable Events**:
  - All `subscription.*` events
  - All `transaction.*` events
- Copy the **Webhook Secret** (starts with `pdl_ntf_set_live_...`).

---

## STEP 8 — Update Product/Price IDs in Codebase

Open [`src/lib/paddle.ts`](file:///C:/Users/Admin/.gemini/antigravity/scratch/growthpilot-ai/src/lib/paddle.ts) and update the `PADDLE_PLANS` constant with the live `pro_...` and `pri_...` IDs.

---

## STEP 9 — Update Vercel Environment Variables

**Where**: [https://vercel.com/dashboard](https://vercel.com/dashboard) → GrowthPilot AI project → Settings → Environment Variables

Update the following (production environment only):

| Variable | New Value |
|---|---|
| `NEXT_PUBLIC_PADDLE_ENV` | `production` |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | `live_...` (from Step 4) |
| `PADDLE_API_KEY` | `pdl_live_...` (from Step 3) |
| `PADDLE_WEBHOOK_SECRET` | `pdl_ntf_set_live_...` (from Step 7) |

Do NOT change `DATABASE_URL` or any other variable.

---

## STEP 10 — Redeploy on Vercel

In the Vercel dashboard, click **Redeploy** (or push a new commit) to rebuild the production deployment with the live environment variables.

---

## STEP 11 — Test Live Checkout with Real Card

1. Navigate to `https://growthpilot-ai-two.vercel.app/onboarding`.
2. Select any plan.
3. Click **Start 7-Day Free Trial**.
4. Enter a **real credit card** (you will see $0.00 due today — no charge until after 7 days).
5. Complete checkout.
6. Verify:
   - `subscription.created` webhook received by GrowthPilot.
   - Database subscription status = `TRIALING`.
   - Dashboard shows correct plan.

---

## STEP 12 — Rollback Procedure (Emergency)

If anything goes wrong after switching to Live:

1. In Vercel → Environment Variables, change `NEXT_PUBLIC_PADDLE_ENV` back to `sandbox`.
2. Revert `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` to the Sandbox token.
3. Revert `PADDLE_API_KEY` to the Sandbox API key.
4. Revert `PADDLE_WEBHOOK_SECRET` to the Sandbox webhook secret.
5. Redeploy.

The system immediately returns to Sandbox mode — no real charges will occur.

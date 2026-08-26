# PADDLE LIVE TRANSITION MASTER MIGRATION GUIDE — GROWTHPILOT AI

**Date**: August 26, 2026  
**Current State**: Fully Operational in Paddle Sandbox Mode  
**Objective**: Comprehensive 20-Point Step-by-Step Production Migration Checklist for Real-Money Billing

---

## 1. Official GrowthPilot Commercial Pricing (DO NOT ALTER)

- **STARTER / BASIC**: **$19/month** + 7-Day Free Trial ($0.00 today)
- **GROWTH PRO**: **$49/month** + 7-Day Free Trial ($0.00 today)
- **AGENCY / ADVANCED**: **$99/month** + 7-Day Free Trial ($0.00 today)
- **BUSINESS**: **$199/month** + 7-Day Free Trial ($0.00 today)

---

## 2. Master 20-Point Live Migration Checklist

1. [ ] **Paddle Live Account Verification**: Complete business identity, tax documents, and payout banking verification in the Paddle Live Vendor Dashboard (`https://vendors.paddle.com`).
2. [ ] **Approved Domain Configuration**: Add `growthpilot-ai-two.vercel.app` to **Approved Domains** in Paddle Live Dashboard.
3. [ ] **Create 4 Live Products**:
   - Product 1: "GrowthPilot AI Starter"
   - Product 2: "GrowthPilot AI Pro"
   - Product 3: "GrowthPilot AI Agency"
   - Product 4: "GrowthPilot AI Business"
4. [ ] **Create 4 Live Monthly Prices**:
   - Starter: $19.00 USD Monthly (Trial: 7 days)
   - Pro: $49.00 USD Monthly (Trial: 7 days)
   - Agency: $99.00 USD Monthly (Trial: 7 days)
   - Business: $199.00 USD Monthly (Trial: 7 days)
5. [ ] **Verify Trial Configuration**: Ensure all 4 prices have `Trial period: 7 days` with `$0.00 due today`.
6. [ ] **Generate Live Client-Side Token**: Go to **Developer Tools → Authentication → Client-side tokens** and generate a token starting with `live_...`.
7. [ ] **Generate Live API Key**: Go to **Developer Tools → Authentication → API keys** and generate a live API key (`pdl_live_...`).
8. [ ] **Configure Live Webhook Destination**:
   - URL: `https://growthpilot-ai-two.vercel.app/api/billing/webhook`
   - Events: Enable all `subscription.*` and `transaction.*` events.
9. [ ] **Copy Live Webhook Secret**: Note the secret (`pdl_ntf_set_live_...`).
10. [ ] **Update Product/Price IDs in Codebase**:
    - Update `PADDLE_PLANS` dictionary in [`src/lib/paddle.ts`](file:///C:/Users/Admin/.gemini/antigravity/scratch/growthpilot-ai/src/lib/paddle.ts) with the new live `pro_...` and `pri_...` IDs.
11. [ ] **Update Vercel Environment Variables**:
    - `NEXT_PUBLIC_PADDLE_ENV=production`
    - `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_...`
    - `PADDLE_API_KEY=pdl_live_...`
    - `PADDLE_WEBHOOK_SECRET=pdl_ntf_set_live_...`
12. [ ] **Redeploy on Vercel**: Trigger a clean production build so the live client token is compiled into client chunks.
13. [ ] **Tax / VAT Verification**: Verify Paddle automatically handles global VAT/sales tax calculation based on customer location.
14. [ ] **Customer Portal Link**: Ensure the Paddle Customer Management link is active in `/settings`.
15. [ ] **Test Live Cancellation**: Verify cancellation requests call `https://api.paddle.com/subscriptions/{id}/cancel`.
16. [ ] **Test Real Credit Card Transaction**: Perform a single real $0.00 7-day trial checkout with an authorized credit card.
17. [ ] **Verify Webhook Receipt**: Confirm the production webhook receives `transaction.completed` and `subscription.created`.
18. [ ] **Verify Database Sync**: Confirm the user subscription status in Neon PostgreSQL updates to `TRIALING` with plan: `PRO`.
19. [ ] **Rollback Plan (Emergency)**: If any issue occurs, reverting Vercel environment variables to `NEXT_PUBLIC_PADDLE_ENV=sandbox` instantly returns the system to safe Sandbox mode.
20. [ ] **Final Authorization**: Owner grants permission to enable public credit card billing.

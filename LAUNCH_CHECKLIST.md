# GrowthPilot AI — Production Launch Checklist

Use this comprehensive launch checklist to track and verify the transition from local testing to connected social-media accounts and production deployment.

---

## A. Local Development & Baseline Verification

* [x] Next.js 14 App Router, TypeScript, and Tailwind CSS compiled cleanly with 0 build errors.
* [x] Environment variables template configured (`.env.example`).
* [x] SQLite / PostgreSQL Prisma schema synced with 21 active models (`npx prisma db push` / `migrate`).
* [x] AES-256-GCM token encryption and PBKDF2 key derivation operational (`src/lib/crypto.ts`).
* [x] AI Content Engine (OpenAI / Gemini / Heuristic Fallback) tested across 6 languages.
* [x] Real Estate Mode anti-hallucination sanitization active.
* [x] 6-stage content approval workflow (`DRAFT` ➔ `AI_OPTIMIZED` ➔ `USER_REVIEW` ➔ `APPROVED` ➔ `SCHEDULED` ➔ `PUBLISHED`) verified.
* [x] Emergency Master Kill-Switch (`PAUSE ALL AUTOMATIONS`) and per-platform controls tested.
* [x] Demo Mode vs. Live Mode dynamic data separation verified.

---

## B. Meta (Instagram Professional & Facebook Pages)

* [ ] Meta Developer Account created at [developers.facebook.com](https://developers.facebook.com/).
* [ ] Meta Business App created (`GrowthPilot AI Social Engine`).
* [ ] Verified Meta Business Portfolio linked to Developer App.
* [ ] Instagram Professional (Business/Creator) account linked to a Facebook Page.
* [ ] Facebook Login for Business product configured with OAuth Redirect URIs:
  * `http://localhost:3000/api/auth/oauth/instagram/callback`
  * `http://localhost:3000/api/auth/oauth/facebook/callback`
  * `https://yourdomain.com/api/auth/oauth/instagram/callback`
  * `https://yourdomain.com/api/auth/oauth/facebook/callback`
* [ ] Required scopes configured: `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`, `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`.
* [ ] Meta App Review submitted for Advanced Access on publishing and insights.
* [ ] Development test user / admin account connected in GrowthPilot AI.
* [ ] Real Instagram / Facebook follower counts and profile details retrieved via API.
* [ ] Live publishing tested for Reel and Page post.

---

## C. LinkedIn (Member Profiles & Organization Pages)

* [ ] LinkedIn Developer App created at [linkedin.com/developers](https://www.linkedin.com/developers/).
* [ ] Verified LinkedIn Company Page associated with Developer App.
* [ ] Products added:
  * `Share on LinkedIn` (`w_member_social`)
  * `Sign In with LinkedIn using OpenID Connect` (`openid`, `profile`, `email`)
  * `Community Management API` / `Marketing Developer Platform` (`rw_organization_admin`)
* [ ] OAuth 2.0 Redirect URIs configured:
  * `http://localhost:3000/api/auth/oauth/linkedin/callback`
  * `https://yourdomain.com/api/auth/oauth/linkedin/callback`
* [ ] `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` added to `.env`.
* [ ] Test account connected via OAuth 2.0 PKCE.
* [ ] Real profile details and organization metrics retrieved.
* [ ] Thought leadership post publishing verified.

---

## D. TikTok (Creator & Business Accounts)

* [ ] TikTok Developer Account registered at [developers.tiktok.com](https://developers.tiktok.com/).
* [ ] TikTok App created in Category: Marketing & Content Management.
* [ ] Products & Scopes added:
  * `Login Kit`: `user.info.basic`, `user.info.stats`
  * `Content Posting API v2`: `video.publish`, `video.list`
* [ ] OAuth 2.0 Redirect URIs configured:
  * `http://localhost:3000/api/auth/oauth/tiktok/callback`
  * `https://yourdomain.com/api/auth/oauth/tiktok/callback`
* [ ] `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET` added to `.env`.
* [ ] Test account connected via TikTok Login Kit.
* [ ] Creator analytics retrieved via API.
* [ ] TikTok Content Posting API Partner Review submitted for direct publishing.

---

## E. Production Deployment

* [ ] Production PostgreSQL database instance provisioned (AWS RDS, Supabase, Neon, or Railway).
* [ ] `DATABASE_URL` configured with PostgreSQL connection string.
* [ ] Prisma migration applied on production database (`npx prisma migrate deploy`).
* [ ] Strong 32-byte `ENCRYPTION_KEY` and `NEXTAUTH_SECRET` generated and configured.
* [ ] Production domain configured with valid SSL/TLS certificate (HTTPS strictly required).
* [ ] All production OAuth redirect URIs updated in Meta, LinkedIn, and TikTok developer portals.
* [ ] Application built and deployed (`npm ci && npm run build && npm start`).
* [ ] Production developer diagnostic executed via `/admin/integration-test`.
* [ ] Initial live social account connected and verified on live dashboard.

# GrowthPilot AI — Production Deployment Guide

This guide details the complete deployment process for hosting GrowthPilot AI on AWS, Vercel, Railway, or VPS environments with PostgreSQL.

---

## 1. System Requirements
* **Node.js**: `v18.17.0+` or `v20.x LTS`
* **Database**: PostgreSQL `14+` or AWS RDS PostgreSQL
* **Reverse Proxy**: NGINX / Cloudflare with SSL/TLS (HTTPS is strictly required for OAuth redirect URLs)

---

## 2. Environment Variables Checklist
Ensure all production variables are set securely in your hosting environment:

```env
# Database (PostgreSQL Connection String)
DATABASE_URL="postgresql://gp_user:SecurePassword123@db.yourcluster.com:5432/growthpilot_prod?schema=public"

# Application URLs
NEXTAUTH_URL="https://app.growthpilot.ai"
NEXTAUTH_SECRET="generate_a_random_64_char_secret_using_openssl_rand_base64_48"
ENCRYPTION_KEY="32_byte_master_encryption_key_for_aes_256_gcm_token_vault"

# AI Model Keys
OPENAI_API_KEY="sk-proj-..."
GEMINI_API_KEY="AIzaSy..."

# Meta (Instagram & Facebook) OAuth Credentials
META_CLIENT_ID="123456789012345"
META_CLIENT_SECRET="your_meta_app_secret"
META_REDIRECT_URI="https://app.growthpilot.ai/api/auth/oauth/instagram/callback"

# LinkedIn OAuth Credentials
LINKEDIN_CLIENT_ID="86abc123def456"
LINKEDIN_CLIENT_SECRET="your_linkedin_client_secret"
LINKEDIN_REDIRECT_URI="https://app.growthpilot.ai/api/auth/oauth/linkedin/callback"

# TikTok OAuth Credentials
TIKTOK_CLIENT_KEY="aw1234567890"
TIKTOK_CLIENT_SECRET="your_tiktok_client_secret"
TIKTOK_REDIRECT_URI="https://app.growthpilot.ai/api/auth/oauth/tiktok/callback"
```

---

## 3. Database Migration Command (PostgreSQL)

When deploying to PostgreSQL in production:
1. Update `datasource db` in `prisma/schema.prisma` from `provider = "sqlite"` to `provider = "postgresql"`.
2. Run database migration:
```bash
npx prisma migrate deploy
npx prisma generate
```

---

## 4. Build & Start Commands
```bash
# 1. Install dependencies
npm ci

# 2. Build production Next.js bundle
npm run build

# 3. Start production server
npm start
```

---

## 5. Security & Maintenance Checklist
* [x] AES-256-GCM encryption enabled for all stored tokens.
* [x] HTTPS enforced on all OAuth callback endpoints.
* [x] Global "PAUSE ALL AUTOMATIONS" emergency kill-switch verified.
* [x] Daily automated database backups configured via `pg_dump` or AWS Automated Snapshots.

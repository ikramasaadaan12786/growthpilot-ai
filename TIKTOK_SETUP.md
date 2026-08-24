# TikTok for Developers Official Integration Setup Guide

Follow this guide to connect **GrowthPilot AI** with official **TikTok for Developers (API v2)**, **Login Kit**, and the **Content Posting API v2** for TikTok Creator and Business Accounts.

---

## 1. Architecture & Policy Compliance

GrowthPilot AI operates strictly under official TikTok Developer Policies:
* **Zero Scraping & Zero Unofficial Reverse Engineering:** No unofficial private APIs, bot scrapers, or click-farm automation.
* **OAuth 2.0 PKCE Handshake:** Anti-CSRF cryptographic state nonce protection with RFC 7636 PKCE S256 challenge.
* **Encrypted Vault Storage:** All tokens are encrypted server-side using **AES-256-GCM** with PBKDF2 salt and authTag verification.
* **Zero Client Exposure:** `TIKTOK_CLIENT_SECRET`, `ACCESS_TOKEN`, and `ENCRYPTION_KEY` are never bundled into the frontend or Android APK.

---

## 2. TikTok Developer App Setup (Step-by-Step)

### Step 1: Register as a TikTok Developer
1. Go to [developers.tiktok.com](https://developers.tiktok.com/).
2. Log in with your TikTok account or business credentials.
3. Complete Developer Account verification (Individual or Business).

### Step 2: Create an App
1. In the TikTok Developer Portal, navigate to **Manage apps** ➔ **Add an app**.
2. **App Name:** `GrowthPilot AI Social Engine`.
3. **App Category:** Select **Marketing & Analytics** or **Content Management**.
4. **App Description:** Provide an overview of the AI social management workflow.
5. Upload an official square app logo (1024x1024px).

### Step 3: Add Products & Request Scopes
Under **Add products** in your TikTok app:
1. **Login Kit:**
   * `user.info.basic`: Read avatar URL, display name, open_id, union_id, verification badge.
   * `user.info.profile`: Read user profile bio.
   * `user.info.stats`: Read follower count, following count, total likes, video count.
2. **Content Posting API v2:**
   * `video.publish`: Direct publishing of short-form vertical videos (Reels/TikToks).
   * `video.upload`: Upload video chunks and containers.
   * `video.list`: Retrieve historical video performance and view counts.

---

## 3. Configure OAuth 2.0 Redirect URIs

1. Under the **Redirect domain / URI** section in your app settings, add:
   ```
   http://localhost:3000/api/auth/oauth/tiktok/callback
   https://yourproductiondomain.com/api/auth/oauth/tiktok/callback
   ```
2. Copy your **Client Key** and **Client Secret**.

---

## 4. Environment Variables Configuration

In `C:\Users\Admin\.gemini\antigravity\scratch\growthpilot-ai\.env`:

```env
# ==============================================================================
# TIKTOK DEVELOPER CREDENTIALS (API v2)
# ==============================================================================
TIKTOK_CLIENT_KEY="your_tiktok_client_key"
TIKTOK_CLIENT_SECRET="your_tiktok_client_secret"
TIKTOK_REDIRECT_URI="http://localhost:3000/api/auth/oauth/tiktok/callback"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ==============================================================================
# TOKEN ENCRYPTION VAULT (AES-256-GCM)
# ==============================================================================
NEXTAUTH_SECRET="growthpilot_secure_encryption_key_min_32_chars_random_vault"
```

---

## 5. Development & Sandbox Testing Procedure

1. In the TikTok Developer Portal, navigate to **Roles** ➔ **Sandbox / Test Accounts**.
2. Add your TikTok test creator handle as an authorized tester.
3. Launch GrowthPilot AI:
   * Navigate to `/social-accounts`
   * Under **TikTok**, click **Connect Official TikTok**
   * Authorize the requested scopes in the official TikTok dialog.
   * Tokens are exchanged server-side, encrypted via AES-256-GCM, and stored in Prisma.

---

## 6. Official API Limitations & Rate Limits

* **Daily Video Uploads:** Standard verified developer accounts can publish up to 50 videos per user per day.
* **Video Specifications:** MP4 format, 9:16 aspect ratio (1080x1920 recommended), maximum file size 500MB, duration 3s to 600s.
* **Token Expiration:** TikTok user access tokens expire after **24 hours (86,400s)**, and refresh tokens are valid for **365 days**. GrowthPilot AI handles automatic background token refresh seamlessly.
* **Zero Fake Engagement:** Legitimate growth driven by fast-paced 3-second hook structures, high retention pacing, and algorithm SEO.

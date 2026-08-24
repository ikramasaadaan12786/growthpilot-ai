# LinkedIn Official Developer Integration Setup Guide

Follow this guide to connect **GrowthPilot AI** with official LinkedIn OAuth 2.0 and the UGC / Posts API for LinkedIn Member Profiles and Company Pages.

---

## 1. Architecture & Security Standards

GrowthPilot AI uses strictly official LinkedIn APIs:
* **Zero Scraping & Zero Unofficial Automation:** Complies fully with LinkedIn Developer Terms of Service. No browser automation or cookie harvesting.
* **OAuth 2.0 PKCE Handshake:** Anti-CSRF cryptographic state nonce protection.
* **Encrypted Vault Storage:** All tokens are encrypted at rest using **AES-256-GCM** with PBKDF2 salt and authTag verification.
* **Zero Client Exposure:** `LINKEDIN_CLIENT_SECRET`, `ACCESS_TOKEN`, and `ENCRYPTION_KEY` are never bundled into the frontend or Android APK.

---

## 2. LinkedIn Developer App Setup (Step-by-Step)

### Step 1: Create a LinkedIn Developer Application
1. Log in to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/).
2. Click **Create App**.
3. **App Name:** `GrowthPilot AI Social Engine`.
4. **LinkedIn Page:** Link your verified LinkedIn Company Page.
5. **App Logo:** Upload a 1:1 square logo (100x100px minimum).
6. Agree to the Legal Terms and click **Create app**.

### Step 2: Request Required Products
Under the **Products** tab in your LinkedIn app:
1. **Sign In with LinkedIn using OpenID Connect** (Instant access) ➔ Grants `openid`, `profile`, `email`.
2. **Share on LinkedIn** (Self-serve) ➔ Grants `w_member_social` for personal thought leadership posting.
3. **Community Management API** (Application required for Organization Pages) ➔ Grants `r_organization_social`, `w_organization_social`, `rw_organization_admin`.

---

## 3. Configure OAuth 2.0 Redirect URIs

1. Navigate to the **Auth** tab in your developer portal.
2. In the **OAuth 2.0 settings** section, add your Authorized Redirect URLs:
   ```
   http://localhost:3000/api/auth/oauth/linkedin/callback
   https://yourproductiondomain.com/api/auth/oauth/linkedin/callback
   ```
3. Copy your **Client ID** and **Primary Client Secret**.

---

## 4. Required OAuth Permissions & Scopes

| Scope | Platform Role | Purpose | Access Tier |
| :--- | :--- | :--- | :--- |
| `openid` | Member Profile | Verify member identity via OpenID Connect | Standard (Immediate) |
| `profile` | Member Profile | Retrieve member name, profile picture, vanity URL | Standard (Immediate) |
| `email` | Member Profile | Retrieve member primary email address | Standard (Immediate) |
| `w_member_social` | Member Profile | Direct UGC sharing (Text, Images, Articles, Videos) | Standard (Self-serve) |
| `r_organization_social` | Company Page | Retrieve Company Page analytics, impressions & follower counts | Community Management API |
| `w_organization_social` | Company Page | Publish updates and video content on behalf of Company Page | Community Management API |
| `rw_organization_admin` | Company Page | Administer organization roles and lead generation ad forms | Community Management API |

---

## 5. Environment Variables Configuration

In `C:\Users\Admin\.gemini\antigravity\scratch\growthpilot-ai\.env`:

```env
# ==============================================================================
# LINKEDIN DEVELOPER APP CREDENTIALS
# ==============================================================================
LINKEDIN_CLIENT_ID="your_linkedin_client_id"
LINKEDIN_CLIENT_SECRET="your_linkedin_client_secret"
LINKEDIN_REDIRECT_URI="http://localhost:3000/api/auth/oauth/linkedin/callback"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ==============================================================================
# TOKEN ENCRYPTION VAULT (AES-256-GCM)
# ==============================================================================
NEXTAUTH_SECRET="growthpilot_secure_encryption_key_min_32_chars_random_vault"
```

---

## 6. Testing & Sandbox Verification

1. Navigate to `/social-accounts` in GrowthPilot AI.
2. Under the **LinkedIn** card, click **Connect Official LinkedIn**.
3. In the OAuth modal, click **Live Meta/LinkedIn OAuth Redirect** or **Instant Connect**.
4. Authorize requested permissions on the official LinkedIn dialog.
5. On return, tokens are AES-256-GCM encrypted and stored in Prisma.
6. Verify live member identity, company page URN discovery, and test publishing in the Content Studio.

---

## 7. Official API Limitations & Rate Limits

* **Daily Share Limits:** Standard member access allows up to 25 shares per member per day. Organizational access allows up to 500 posts per day.
* **Token Expiration:** LinkedIn user access tokens expire after **60 days**. GrowthPilot AI includes automatic background refresh handling.
* **Media Formats:** Supports PNG, JPEG, MP4 video (up to 200MB), and article link previews.

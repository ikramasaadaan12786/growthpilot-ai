# Meta (Instagram & Facebook) Production Integration Setup Guide

Follow this authoritative guide to connect **GrowthPilot AI** with official Meta Graph APIs (v20.0) for Instagram Professional (Creator / Business) accounts and Facebook Pages.

---

## 1. Architecture & Policy Compliance

GrowthPilot AI operates strictly under official Meta Developer Policies:
* **Zero Scraping & Zero Bot Activity:** No unofficial endpoints, reverse-engineered private APIs, or fake engagement tools.
* **OAuth 2.0 & Token Security:** All tokens are encrypted server-side using **AES-256-GCM** with unique cryptographic salt and IV.
* **Account Requirement:** Only **Instagram Professional (Creator or Business)** accounts linked to a managed **Facebook Page** are supported. Meta Graph API does not support personal accounts.

---

## 2. Meta Developer App Setup (Step-by-Step)

### Step 1: Create a Meta Developer App
1. Go to [developers.facebook.com](https://developers.facebook.com/) and log in with your verified Facebook account.
2. Click **My Apps** ➔ **Create App**.
3. Select **Other** as the use case ➔ Click **Next**.
4. Select **Business** as the app type ➔ Click **Next**.
5. App Name: `GrowthPilot AI Social Engine`.
6. App Contact Email: Enter your support/team email.
7. Business Account: Select your verified **Meta Business Portfolio (Business Manager)**.
8. Click **Create App**.

### Step 2: Add Facebook Login for Business
1. Under **Add Products to Your App**, locate **Facebook Login for Business** and click **Set Up**.
2. Navigate to **Facebook Login for Business** ➔ **Settings**.
3. In **Valid OAuth Redirect URIs**, add both development and production callback endpoints:
   ```
   http://localhost:3000/api/auth/oauth/instagram/callback
   http://localhost:3000/api/auth/oauth/facebook/callback
   https://yourproductiondomain.com/api/auth/oauth/instagram/callback
   https://yourproductiondomain.com/api/auth/oauth/facebook/callback
   ```
4. Click **Save Changes**.

### Step 3: Add Instagram Graph API
1. In the left navigation, click **Add Product**.
2. Locate **Instagram Graph API** and click **Set Up**.
3. Confirm that the product is linked to your Business App.

---

## 3. Required Permissions & Scopes Breakdown

| Permission / Scope | Platform | Purpose | App Review Tier |
| :--- | :--- | :--- | :--- |
| `instagram_basic` | Instagram | Read Instagram username, user ID, profile photo, follower count | Standard Access (Dev) / Advanced Access (Prod) |
| `instagram_content_publish` | Instagram | Direct publishing of Reels, Single Images, and Carousels | Requires Meta App Review |
| `instagram_manage_insights` | Instagram | Aggregate Reach, Impressions, Profile Views, and Interactions | Requires Meta App Review |
| `pages_show_list` | Facebook / IG | Discover managed Facebook Pages linked to Instagram accounts | Standard Access |
| `pages_read_engagement` | Facebook | Read Page post comments, likes, engagement metrics | Requires Meta App Review |
| `pages_manage_posts` | Facebook | Direct publishing of Page posts, photos, and video reels | Requires Meta App Review |
| `business_management` | Facebook / IG | Manage business assets and advertising campaigns | Advanced Access |

---

## 4. Environment Variables Configuration

In `C:\Users\Admin\.gemini\antigravity\scratch\growthpilot-ai\.env`:

```env
# ==============================================================================
# META (INSTAGRAM PROFESSIONAL & FACEBOOK PAGES) CREDENTIALS
# ==============================================================================
META_CLIENT_ID="your_meta_app_id"
META_CLIENT_SECRET="your_meta_app_secret"
META_APP_ID="your_meta_app_id"
META_APP_SECRET="your_meta_app_secret"
META_REDIRECT_URI="http://localhost:3000/api/auth/oauth/instagram/callback"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ==============================================================================
# TOKEN ENCRYPTION VAULT (AES-256-GCM)
# ==============================================================================
NEXTAUTH_SECRET="growthpilot_secure_encryption_key_min_32_chars_random_vault"
```

---

## 5. Development & Sandbox Testing Mode

When your Meta App is in **Development Mode**:
1. Go to **App Roles** ➔ **Roles** in the Meta Developer Portal.
2. Add your Facebook account as an **Administrator**, **Developer**, or **Tester**.
3. Ensure the test Facebook account is an Admin of the Facebook Page and linked Instagram Professional account.
4. Launch GrowthPilot AI:
   * Navigate to `/social-accounts`
   * Click **Connect Official Instagram** or **Connect Official Facebook**
   * Complete the OAuth dialog and authorize requested scopes.
   * GrowthPilot AI will exchange the short-lived token for a 60-day long-lived token, encrypt it via AES-256-GCM, and synchronize live follower counts.

---

## 6. Production & Meta App Review Requirements

To enable real external users to connect their Instagram and Facebook accounts without being added to App Roles, submit for **Meta App Review**:

1. **Business Verification:** Verify your business legal documents and address in Meta Business Settings.
2. **Data Protection Assessment (DPA):** Complete the annual Meta Data Privacy Assessment questionnaire.
3. **App Review Submissions:**
   * Submit `instagram_content_publish` with a screencast showing content creation, user review, and publishing in GrowthPilot AI.
   * Submit `instagram_manage_insights` with a screencast showing the analytics dashboard reading organic metrics.
   * Submit `pages_manage_posts` with a screencast demonstrating Facebook Page post publishing.
4. **App Privacy Policy & Terms of Service:** Provide live public URLs for Privacy Policy and Terms of Service.
5. Switch App Mode from **Development** to **Live**.

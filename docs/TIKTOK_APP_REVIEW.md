# GrowthPilot AI — TikTok Developer App Review Guidelines & Submission Package

---

## 1. TikTok App Review Guidelines (Copy-Paste Ready)

> **Instructions for Developer**: Copy and paste the text block below directly into the **"App Review Guidelines" / "Testing Instructions"** field in the TikTok Developer Portal.

```text
GrowthPilot AI is an AI-powered social media orchestration and video publishing platform for creators and businesses (https://growthpilot-ai-two.vercel.app).

Our application utilizes TikTok Login Kit to securely authenticate creators via OAuth 2.0 PKCE and Content Posting API to enable user-approved video uploads directly from our Content Studio.

--- TESTING INSTRUCTIONS FOR TIKTOK REVIEW TEAM ---

1. Access the live production web app:
   URL: https://growthpilot-ai-two.vercel.app/social-accounts

2. Connect TikTok Account:
   - On the "TikTok for Business & Creators" card, click the "Connect TikTok" button.
   - An informational modal appears outlining requested permissions (user.info.basic, video.upload).
   - Click "Authorize via TikTok" to initiate the official TikTok OAuth 2.0 PKCE authorization handshake.
   - Authorize using your test TikTok account on the official TikTok login screen.

3. Verify Account Connection:
   - You will be redirected back to:
     https://growthpilot-ai-two.vercel.app/social-accounts?connected=TikTok
   - The TikTok card now shows "CONNECTED" with your verified TikTok handle, profile photo, and active token health status.
   - Tokens are securely stored using AES-256-GCM encryption in our server vault.

4. Test Video Content Creation & Publishing Workflow:
   - Navigate to the Content Studio:
     https://growthpilot-ai-two.vercel.app/content-studio
   - Select the "TikTok 30s Script" / video format tab.
   - Enter property details or click "Generate AI Script".
   - Click "Publish to TikTok" to initiate a user-approved direct video upload via the official TikTok Content Posting API v2.

5. Test Disconnection & Immediate Token Revocation:
   - Return to https://growthpilot-ai-two.vercel.app/social-accounts.
   - Click "Disconnect" on the TikTok card.
   - Access tokens are instantly purged from our database vault and all background workers for TikTok are halted immediately.

6. Review Documentation & Compliance Pages:
   - App Review Hub: https://growthpilot-ai-two.vercel.app/tiktok-review
   - Terms of Service: https://growthpilot-ai-two.vercel.app/terms
   - Privacy Policy: https://growthpilot-ai-two.vercel.app/privacy
   - Support Contact: support@growthpilot.ai
```

---

## 2. TikTok Developer Portal Metadata Fields

| Field Name | Exact Value |
| :--- | :--- |
| **App Name** | `GrowthPilot AI` |
| **Category** | `Social & Communications` *(or `Productivity & Business Tools`)* |
| **App Description** | `GrowthPilot AI is a multi-platform social media growth and content studio. It empowers creators and businesses to analyze performance, draft platform-tailored short-form video content, and publish directly to TikTok using official APIs.` |
| **Platform** | `Web Application` |
| **Terms of Service URL** | `https://growthpilot-ai-two.vercel.app/terms` |
| **Privacy Policy URL** | `https://growthpilot-ai-two.vercel.app/privacy` |
| **Redirect URI (Callback)** | `https://growthpilot-ai-two.vercel.app/api/auth/oauth/tiktok/callback` |
| **Enabled Products** | `Login Kit`, `Content Posting API` |
| **Requested Scopes** | `user.info.basic`, `video.upload` |

---

## 3. Scope Justifications for App Review Form

### Scope 1: `user.info.basic`
* **Justification**:
  > "Required during the initial TikTok Login Kit handshake to identify the authenticated creator, display their verified TikTok avatar, display name, and handle in the GrowthPilot AI dashboard, and bind authorized video uploads to the correct channel."

### Scope 2: `video.upload`
* **Justification**:
  > "Required to allow authenticated creators and businesses to directly upload and publish short-form video content (e.g. real estate property reels and marketing updates) from the GrowthPilot AI Content Studio directly to their TikTok profile upon explicit user confirmation."

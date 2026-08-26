# META OWNER FINAL ACTIONS — GROWTHPILOT AI
## Streamlined Owner Actions Checklist for Meta App Review & Production Approval

> **Release Baseline**: GrowthPilot AI v1.0.0-beta.1  
> **Production App**: `https://growthpilot-ai-two.vercel.app`  
> **Meta Developer Portal**: [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/)

---

### EXECUTIVE SUMMARY OF AUTOMATION
All code, OAuth 2.0 adapters, API v20.0 endpoints, multi-tenant database isolation, AES-256-GCM token encryption, guided screencast recording mode, reviewer demo hubs, data deletion endpoints, and test suites are fully implemented and verified.

The only remaining actions are those physically protected by Meta's login, owner permissions, or human video submission.

---

## ─────────────────────────────────────────────
## ACTION 1: RECORD THE META REVIEW SCREENCAST (~90-120 SECONDS)
## ─────────────────────────────────────────────

1. Open **[https://growthpilot-ai-two.vercel.app/admin/meta-review](https://growthpilot-ai-two.vercel.app/admin/meta-review)** in Google Chrome.
2. Click the red **"START RECORDING"** button (uses browser MediaRecorder — no third-party software needed, or use OBS/Game Bar).
3. Click the blue **"START META REVIEW FLOW"** button.
4. The system will guide you automatically through 10 numbered steps with on-screen annotations for reviewers:
   - **Step 1**: Login display (Auto-advances)
   - **Step 2**: Instagram OAuth — *Click "Connect Instagram" and authorize with your test user*
   - **Step 3**: Facebook Pages OAuth — *Click "Connect Facebook Page" and authorize*
   - **Step 4**: Connected Account Identity displayed (Auto-advances)
   - **Step 5**: Content Studio AI Draft (Auto-advances)
   - **Step 6**: Human Approval Gate Demonstration (Auto-advances)
   - **Step 7**: Two-Step Instagram Media Container Publish (Auto-advances)
   - **Step 8**: Facebook Page Feed Publish (Auto-advances)
   - **Step 9**: Live Analytics & Engagement Insights (Auto-advances)
   - **Step 10**: Disconnect & Instant Token Purge (Auto-advances)
5. Click **"STOP RECORDING"** and **"Download Recording"** (`GrowthPilot-Meta-Review.webm`).
6. Upload the video to Google Drive or YouTube (Unlisted) and set sharing to *"Anyone with the link can view"*.

---

## ─────────────────────────────────────────────
## ACTION 2: META DEVELOPER PORTAL SUBMISSION
## ─────────────────────────────────────────────

1. Log in to [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/) and select **Growthpilot AI**.
2. Go to **Use Cases** / **Permissions and Features**:
   - For **"Manage messaging & content on Instagram"**:
     - Request `instagram_basic`
     - Request `instagram_content_publish`
     - Request `instagram_manage_insights`
   - For **"Manage everything on your Page"**:
     - Request `pages_show_list`
     - Request `pages_read_engagement`
     - Request `pages_manage_posts`
3. In each permission review form, copy & paste the exact text from [`META_FINAL_SUBMISSION_PACKAGE.md`](file:///C:/Users/Admin/.gemini/antigravity/scratch/growthpilot-ai/META_FINAL_SUBMISSION_PACKAGE.md).
4. Provide the required URLs in the submission:
   - **Privacy Policy URL**: `https://growthpilot-ai-two.vercel.app/privacy`
   - **Terms of Service URL**: `https://growthpilot-ai-two.vercel.app/terms`
   - **User Data Deletion Callback / URL**: `https://growthpilot-ai-two.vercel.app/data-deletion`
   - **Reviewer Demo Hub URL**: `https://growthpilot-ai-two.vercel.app/meta-review-demo`
   - **OAuth Redirect URI**: `https://growthpilot-ai-two.vercel.app/api/auth/oauth/instagram/callback`
5. Paste your Screencast Video Link (from Action 1).
6. In **App Roles → Roles → Testers**, ensure your review test account is added.
7. Click **"Submit for Review"**.

---

## ─────────────────────────────────────────────
## ACTION 3: APP PUBLISHING (AFTER META APPROVAL)
## ─────────────────────────────────────────────

1. Once Meta approves the permissions, toggle the App Mode switch from **Development** to **Live** in the Meta Developer Portal top navbar.
2. In Vercel Project Settings, confirm your live production `META_CLIENT_ID` and `META_CLIENT_SECRET` environment variables.

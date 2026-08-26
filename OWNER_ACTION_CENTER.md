# OWNER ACTION CENTER — GROWTHPILOT AI
## Release Baseline: Verified Production | Version `1.0.0-beta.1`

> **IMPORTANT**: All technical code, API routes, security encryption, OAuth popups, and automated QA tests are complete and verified in production on Vercel.  
> The screencast video has already been recorded and downloaded:
> • **Local File**: `C:\Users\Admin\Downloads\GrowthPilot-Meta-App-Review.webm`  
> • **Direct Web Link**: `https://growthpilot-ai-two.vercel.app/meta-review/GrowthPilot-Meta-App-Review.webm`

---

## ─────────────────────────────────────────────
## SECTION 1 — META APP REVIEW SUBMISSION (FINAL OWNER ACTIONS)
## ─────────────────────────────────────────────

### Exact Step-by-Step in Meta Developer Portal

1. Log in to [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/)
2. Select your app: **GrowthPilot AI** (App ID: `1379013277028626`).
3. Under **Use Cases**, configure both active use cases:
   - **Use Case 1**: **Manage messaging & content on Instagram**
     - Click **Customize** / **Permissions and features**.
     - Add: `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`.
     - Click **Request** next to each permission.
   - **Use Case 2**: **Manage everything on your Page**
     - Click **Customize** / **Permissions and features**.
     - Add: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`.
     - Click **Request** next to each permission.
4. For each requested permission, paste the pre-written justification from **Section 1B** below.
5. In the **Screencast / Video Demonstration** field:
   - Upload the local video file: `C:\Users\Admin\Downloads\GrowthPilot-Meta-App-Review.webm`
   - (Or paste the hosted link: `https://growthpilot-ai-two.vercel.app/meta-review/GrowthPilot-Meta-App-Review.webm`)
6. Fill in the App Details & Compliance URLs:
   - **Privacy Policy URL**: `https://growthpilot-ai-two.vercel.app/privacy`
   - **Terms of Service URL**: `https://growthpilot-ai-two.vercel.app/terms`
   - **User Data Deletion URL**: `https://growthpilot-ai-two.vercel.app/data-deletion`
   - **Reviewer Demo Hub URL**: `https://growthpilot-ai-two.vercel.app/meta-review-demo`
7. Click **Submit for Review** (and accept any Meta owner declarations / certifications).

---

### Permissions Being Requested & Copy-Paste Justifications

| Permission | Use Case | Justification Text to Paste |
|---|---|---|
| `instagram_basic` | Instagram | GrowthPilot AI uses `instagram_basic` to authenticate the user's Instagram identity and display their connected account handle, profile picture, and follower count on the unified social accounts dashboard. This data is read-only and used only to confirm the correct account is linked. No content is read from the user's feed. |
| `instagram_content_publish` | Instagram | GrowthPilot AI uses `instagram_content_publish` to publish posts that the user has explicitly reviewed and approved in the content studio. Publishing follows the two-step Graph API flow: (1) `POST /me/media` creates a media container; (2) `POST /me/media_publish` publishes it only after user approval. Content cannot be published without an explicit user approval action in GrowthPilot's interface. |
| `instagram_manage_insights` | Instagram | GrowthPilot AI uses `instagram_manage_insights` to display real-time post-level and account-level engagement analytics (impressions, reach, likes, comments, saves) in the GrowthPilot Analytics dashboard. This gives users a consolidated performance view without leaving the app. Data is read-only; nothing is written. |
| `pages_show_list` | Facebook Pages | GrowthPilot AI uses `pages_show_list` to retrieve the Facebook Pages a user administers (via `GET /me/accounts`) so the user can select which Page to connect for publishing and analytics. This allows users managing multiple pages to select the correct one without entering a Page ID manually. Read-only. |
| `pages_read_engagement` | Facebook Pages | GrowthPilot AI uses `pages_read_engagement` to display Facebook Page-level analytics (post reach, impressions, fan growth) in the GrowthPilot Analytics dashboard, giving users a combined Instagram + Facebook performance view. Called via `GET /{page-id}/insights`. Read-only. |
| `pages_manage_posts` | Facebook Pages | GrowthPilot AI uses `pages_manage_posts` to publish content to the user's connected Facebook Page after the user has explicitly approved the content in GrowthPilot's mandatory approval workflow. Publishing is performed via `POST /{page-id}/feed` or `/{page-id}/photos`. No post is published without user approval. |

---

### Production Compliance Endpoints (Verified Live)

| Field | URL | Status |
|---|---|---|
| Privacy Policy | `https://growthpilot-ai-two.vercel.app/privacy` | HTTP 200 Live |
| Terms of Service | `https://growthpilot-ai-two.vercel.app/terms` | HTTP 200 Live |
| Data Deletion | `https://growthpilot-ai-two.vercel.app/data-deletion` | HTTP 200 Live |
| Support | `https://growthpilot-ai-two.vercel.app/support` | HTTP 200 Live |
| Reviewer Demo Hub | `https://growthpilot-ai-two.vercel.app/meta-review-demo` | HTTP 200 Live |
| Admin Review Mode | `https://growthpilot-ai-two.vercel.app/admin/meta-review` | HTTP 200 Live |
| Hosted Screencast | `https://growthpilot-ai-two.vercel.app/meta-review/GrowthPilot-Meta-App-Review.webm` | HTTP 200 Live |

---

## ─────────────────────────────────────────────
## SECTION 2 — TIKTOK APP REVIEW SUBMISSION
## ─────────────────────────────────────────────

### Step-by-Step Submission

1. Log in to [https://developers.tiktok.com/](https://developers.tiktok.com/)
2. Select your **GrowthPilot AI** app.
3. Navigate to **Manage App → App Review Submission**.
4. Request `user.info.basic` and `video.upload`.
5. Paste the product description and scope justification from **Section 2B** below.
6. Upload domain verification file proof: `https://growthpilot-ai-two.vercel.app/tiktok4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP.txt`
7. Upload your screencast video per **Screencast Checklist (Section 2C)**.
8. Submit for review.

---

### Scopes/Products Requested

| Scope | Justification |
|---|---|
| `user.info.basic` (Login Kit) | Authenticate creator identity and display TikTok handle and avatar in the social accounts dashboard |
| `video.upload` | Upload approved MP4 video files to the creator's TikTok Creator Inbox using the FILE_UPLOAD method — NOT auto-published to the public feed |

---

### Exact Review Text to Paste

#### Product Description
> GrowthPilot AI is an AI-powered content management and publishing platform serving real estate professionals, marketing agencies, and solo content creators. The TikTok integration allows users to generate short-form video scripts using AI, review and approve them, and then upload the approved video to their TikTok Creator Inbox for final review and publishing. GrowthPilot AI does not auto-publish to the public TikTok feed — all videos are delivered to the Creator Inbox where the creator retains full control.

#### `user.info.basic` Justification
> GrowthPilot AI uses `user.info.basic` to authenticate the TikTok creator's identity and display their connected username and profile avatar on the GrowthPilot social accounts dashboard. This allows users to confirm the correct TikTok account is connected. Data is read-only — only `display_name`, `avatar_url`, and `open_id` are read.

#### `video.upload` Justification
> GrowthPilot AI uses `video.upload` to deliver MP4 videos, which the user has approved in GrowthPilot's mandatory content approval workflow, to the creator's TikTok Creator Inbox using the FILE_UPLOAD method (`POST /v2/post/publish/inbox/video/init/`). The video is NOT published to the public feed — it lands in the Creator Inbox. The creator then reviews and decides whether to publish or discard from the TikTok app. GrowthPilot cannot bypass this creator-controlled step.

---

### URLs Required by TikTok Reviewer

| Field | URL |
|---|---|
| Domain Verification File | `https://growthpilot-ai-two.vercel.app/tiktok4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP.txt` |
| Reviewer Demo Hub | `https://growthpilot-ai-two.vercel.app/tiktok-review-demo` |
| Privacy Policy | `https://growthpilot-ai-two.vercel.app/privacy` |
| Terms of Service | `https://growthpilot-ai-two.vercel.app/terms` |
| Data Deletion | `https://growthpilot-ai-two.vercel.app/data-deletion` |
| Support | `https://growthpilot-ai-two.vercel.app/support` |
| OAuth Redirect URI | `https://growthpilot-ai-two.vercel.app/api/auth/oauth/tiktok/callback` |

---

### Screencast Checklist (TikTok)

- [ ] Screen recording started, no credentials visible
- [ ] **Scene 1** (0:00–0:15): Navigate to TikTok verification file URL — shows plain text string
- [ ] **Scene 2** (0:15–1:00): Click "Connect TikTok Account" → OAuth dialog shows "GrowthPilot AI" + `user.info.basic` scope → authorize → handle/avatar confirmed
- [ ] **Scene 3** (1:00–2:00): Generate video script → **Approval step shown explicitly** (upload blocked until approved) → click Approve
- [ ] **Scene 4** (2:00–3:00): Click "Upload to Creator Inbox" → `publish_id` returned in success screen
- [ ] **Scene 5** (3:00–3:30): Open TikTok app Creator Inbox → video visible (NOT on public feed)
- [ ] **Scene 6** (3:30–4:00): Click "Disconnect" → token deletion confirmed
- [ ] Total duration: under 4 minutes
- [ ] No passwords, API keys, or tokens visible

---

## ─────────────────────────────────────────────
## SECTION 3 — LINKEDIN COMMUNITY MANAGEMENT API
## ─────────────────────────────────────────────

### Step-by-Step Submission

1. Log in to [https://www.linkedin.com/developers/apps/](https://www.linkedin.com/developers/apps/)
2. Select your **GrowthPilot AI** app.
3. Click the **Products** tab.
4. Find **Community Management API** and click **Request Access**.
5. If the Marketing Developer Platform is also listed, request it for `rw_organization_admin`.
6. Paste the application text from **Section 3B** below.
7. Submit.

---

### Required Products / Scopes

| Product | Scope | Status |
|---|---|---|
| Community Management API | `r_organization_social` | Pending |
| Community Management API | `w_organization_social` | Pending |
| Marketing Developer Platform | `rw_organization_admin` | Pending (optional for full org management) |

**Already Active (self-serve, no review needed)**:
- `openid`, `profile`, `email` — OpenID Connect
- `w_member_social` — Member UGC posting

---

### Exact Application Text to Paste

#### Use Case Description
> GrowthPilot AI is a B2B AI content management and publishing platform used by real estate brokerages, marketing agencies, and independent agents to manage LinkedIn Company Page content. Our enterprise users require the ability to publish approved property listing announcements, market reports, and recruitment posts to their brokerage's LinkedIn Company Page from a centralized GrowthPilot dashboard, eliminating the need to copy-paste content between tools.

#### Organization Admin Flow Description
> After a user authenticates via LinkedIn OpenID Connect, GrowthPilot calls `GET https://api.linkedin.com/v2/organizationAcls?q=roleAssignee` to retrieve the LinkedIn Company Pages the user administers. The user then selects which Company Page to link. Content is drafted in GrowthPilot's Content Studio and must pass through a mandatory approval workflow before publishing. Approved content is published via `POST https://api.linkedin.com/v2/ugcPosts` using the organization URN (`urn:li:organization:{id}`). Users can disconnect at any time, immediately revoking all tokens.

#### Data Handling Statement
> LinkedIn access and refresh tokens are stored server-side only, encrypted with AES-256-GCM, in a Neon PostgreSQL database. Tokens are never exposed to the client browser. Organization URNs are stored to identify which Company Page to publish to. No LinkedIn data is shared with third parties. Users can permanently delete all data via `https://growthpilot-ai-two.vercel.app/data-deletion`.

---

### Required URLs for LinkedIn Application

| Field | URL |
|---|---|
| Privacy Policy | `https://growthpilot-ai-two.vercel.app/privacy` |
| Terms of Service | `https://growthpilot-ai-two.vercel.app/terms` |
| Data Deletion | `https://growthpilot-ai-two.vercel.app/data-deletion` |
| Support | `https://growthpilot-ai-two.vercel.app/support` |
| OAuth Redirect URI | `https://growthpilot-ai-two.vercel.app/api/auth/oauth/linkedin/callback` |

---

## ─────────────────────────────────────────────
## SECTION 4 — ANDROID RELEASE SIGNING
## ─────────────────────────────────────────────

> ⚠️ **CRITICAL SECURITY NOTICE**: The keystore password and private key are generated locally on your machine. NEVER commit them to Git, NEVER paste them in a chat, NEVER upload them to any online service.

### Step 1 — Generate a Secure Release Keystore

Run this command on your local machine (requires Java JDK installed):

```bash
keytool -genkey -v \
  -keystore growthpilot-release.jks \
  -alias growthpilot \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_SECURE_KEYSTORE_PASSWORD \
  -keypass YOUR_SECURE_KEY_PASSWORD \
  -dname "CN=GrowthPilot AI, OU=Mobile, O=GrowthPilot AI, L=YourCity, ST=YourState, C=US"
```

Replace `YOUR_SECURE_KEYSTORE_PASSWORD` and `YOUR_SECURE_KEY_PASSWORD` with strong unique passwords.  
Store `growthpilot-release.jks` in a secure, backed-up location **outside the project repository**.

### Step 2 — Configure Gradle Signing (Do NOT commit passwords to Git)

In `android/app/build.gradle`, inside `android {}`:

```groovy
signingConfigs {
    release {
        storeFile file('/path/to/growthpilot-release.jks')
        storePassword System.getenv("KEYSTORE_PASSWORD")
        keyAlias "growthpilot"
        keyPassword System.getenv("KEY_PASSWORD")
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

Set `KEYSTORE_PASSWORD` and `KEY_PASSWORD` as environment variables — never hardcode them.

### Step 3 — Build the Signed Release AAB (Preferred for Google Play)

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 4 — Build Signed Release APK (Alternative)

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Step 5 — Upload to Google Play Console

1. Open [https://play.google.com/console](https://play.google.com/console)
2. Create a new application: "GrowthPilot AI"
3. Complete store listing (description, screenshots, content rating)
4. Upload the signed `.aab` under Production or Internal Testing
5. Submit for Google Play review

> **Environment Note**: Android SDK and Gradle are not available in this cloud environment. Steps 1–4 must be run on the owner's local machine or a configured CI/CD pipeline.

---

## ─────────────────────────────────────────────
## SECTION 5 — PUBLIC BETA LAUNCH CHECKLIST
## ─────────────────────────────────────────────

### Pre-Launch Checklist

- [x] Production build passes (50/50 routes)
- [x] All 8 public compliance/review URLs return HTTP 200
- [x] Billing QA matrix: 24/24 tests pass
- [x] Security audit: zero secrets in client bundles
- [x] Paddle Sandbox billing end-to-end verified (real PRO trial checkout)
- [x] Auth: register/login/session/password-reset verified
- [x] Data deletion route live
- [x] Support form upgraded with structured fields
- [x] Meta review demo hub live
- [x] TikTok review demo hub live
- [x] TikTok domain verification file live
- [x] Windows installer compiled (`dist/GrowthPilot AI Setup 1.0.0.exe`)
- [x] Android debug APK compiled (`android/app/build/outputs/apk/debug/app-debug.apk`)
- [ ] Meta App Review submitted ← **OWNER ACTION**
- [ ] TikTok App Review submitted ← **OWNER ACTION**
- [ ] LinkedIn Community API applied ← **OWNER ACTION**
- [ ] Android release keystore generated ← **OWNER ACTION**

---

### Tester Acceptance Criteria

A beta tester is considered onboarded when they have:
1. Registered an account successfully.
2. Completed plan selection (Sandbox trial, $0.00 today).
3. Logged in and viewed the main dashboard.
4. Used Demo Mode (no social account required).
5. Navigated to Content Studio and generated at least one AI post draft.
6. Confirmed the Approve step blocks publishing of unapproved content.

---

### Bug Severity Classification

| Severity | Definition | Example | SLA |
|---|---|---|---|
| **BLOCKER** | Prevents core usage; release cannot ship | Login crashes on all browsers, Paddle checkout returns 500 | Fix before any release |
| **CRITICAL** | Core feature broken for most users | AI generation always fails, subscription not persisted | Fix before public launch |
| **MAJOR** | Important feature broken for some users | Analytics not loading for specific plan, TikTok disconnect fails | Fix within 48h of report |
| **MINOR** | Cosmetic or edge-case issue | Typo in UI text, minor layout misalignment on mobile | Fix in next patch |

---

### Go / No-Go Criteria for Production Release

| Criterion | Threshold | Current Status |
|---|---|---|
| Build passes | 50/50 routes | ✅ PASS |
| Zero BLOCKER bugs | 0 confirmed | ✅ PASS |
| Zero CRITICAL bugs | 0 confirmed | ✅ PASS |
| Billing QA | 24/24 | ✅ PASS |
| Security audit | Zero secrets exposed | ✅ PASS |
| Auth flow end-to-end | Register + Login + Session | ✅ PASS |
| Compliance routes | All HTTP 200 | ✅ PASS |

**Current Go/No-Go: GO for Public Beta** (Social publishing scope is limited by platform approval timelines, not code defects).

---

## ─────────────────────────────────────────────
## SECTION 6 — PADDLE SANDBOX STATUS
## ─────────────────────────────────────────────

> Paddle Sandbox remains **ACTIVE AND UNCHANGED**.

- `NEXT_PUBLIC_PADDLE_ENV=sandbox` — confirmed
- Sandbox pricing: STARTER $19 / PRO $49 / AGENCY $99 / BUSINESS $199
- All plans include 7-day free trial ($0.00 today)
- Live migration package preserved at `PADDLE_LIVE_OWNER_ACTIONS.md`
- **No live payments will be enabled without explicit owner action following that guide.**

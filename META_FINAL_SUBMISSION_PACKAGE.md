# META FINAL SUBMISSION PACKAGE — GROWTHPILOT AI
**Version**: `1.0.0-beta.1` | **Release Baseline**: Verified Production  
**Production URL**: [https://growthpilot-ai-two.vercel.app](https://growthpilot-ai-two.vercel.app)  
**Reviewer Demo Hub**: [https://growthpilot-ai-two.vercel.app/meta-review-demo](https://growthpilot-ai-two.vercel.app/meta-review-demo)  
**Admin Review Mode**: [https://growthpilot-ai-two.vercel.app/admin/meta-review](https://growthpilot-ai-two.vercel.app/admin/meta-review)  
**Hosted Screencast URL**: [https://growthpilot-ai-two.vercel.app/meta-review/GrowthPilot-Meta-App-Review.webm](https://growthpilot-ai-two.vercel.app/meta-review/GrowthPilot-Meta-App-Review.webm)  
**Local Screencast File**: `C:\Users\Admin\Downloads\GrowthPilot-Meta-App-Review.webm`

---

## 1. COMPLIANCE & LEGAL URLS

| Field | Production URL | Status |
|---|---|---|
| **Privacy Policy** | `https://growthpilot-ai-two.vercel.app/privacy` | HTTP 200 Live |
| **Terms of Service** | `https://growthpilot-ai-two.vercel.app/terms` | HTTP 200 Live |
| **User Data Deletion Callback / Instructions** | `https://growthpilot-ai-two.vercel.app/data-deletion` | HTTP 200 Live |
| **Customer Support URL** | `https://growthpilot-ai-two.vercel.app/support` | HTTP 200 Live |
| **Instagram OAuth Redirect URI** | `https://growthpilot-ai-two.vercel.app/api/auth/oauth/instagram/callback` | HTTP 307 Live |
| **Facebook Pages OAuth Redirect URI** | `https://growthpilot-ai-two.vercel.app/api/auth/oauth/facebook/callback` | HTTP 307 Live |

---

## 2. APP USE CASES & REQUIRED PERMISSIONS BREAKDOWN

GrowthPilot AI operates under **TWO** official Meta App Use Cases:

### Use Case 1: "Manage messaging & content on Instagram"
*API Architecture: Instagram Graph API v20.0 via Facebook Login*

#### A. `instagram_basic`
- **Feature**: Instagram Account Identity & Profile Verification
- **API Endpoint**: `GET /{ig-user-id}?fields=id,username,profile_picture_url,followers_count`
- **Copy-Paste Justification**:
  > GrowthPilot AI uses `instagram_basic` to authenticate the user's professional Instagram account identity and display their verified handle, avatar, and follower count in their unified dashboard. All data is read-only and used solely to confirm the correct account is connected. No private user feed content is read.
- **Reviewer Instructions**:
  > 1. Open `https://growthpilot-ai-two.vercel.app/meta-review-demo`.
  > 2. Click "Step 1: Connect Instagram".
  > 3. Complete authorization in the popup.
  > 4. Verify that the Instagram handle, profile picture, and follower statistics display in the dashboard card.

#### B. `instagram_content_publish`
- **Feature**: AI Content Studio — Approved Instagram Post & Reel Publishing
- **API Endpoint**: `POST /{ig-user-id}/media` (Container creation) → `POST /{ig-user-id}/media_publish`
- **Copy-Paste Justification**:
  > GrowthPilot AI uses `instagram_content_publish` to publish posts that users have created and explicitly approved in GrowthPilot's Content Studio. GrowthPilot strictly enforces a mandatory human-in-the-loop approval gate: content remains in DRAFT and cannot be published until the user clicks 'Approve Post'. Publishing executes via the two-step Graph API container creation and publication endpoints.
- **Reviewer Instructions**:
  > 1. In `https://growthpilot-ai-two.vercel.app/meta-review-demo`, navigate to Step 3 (Draft AI Content).
  > 2. Note that content is locked in DRAFT.
  > 3. Click "Approve Post" to unlock publishing.
  > 4. Click "Publish to Instagram".
  > 5. Confirm that the Graph API returns a valid media container ID and confirms publication.

#### C. `instagram_manage_insights`
- **Feature**: Growth & Performance Analytics Dashboard
- **API Endpoint**: `GET /{ig-user-id}/insights?metric=impressions,reach,profile_views`
- **Copy-Paste Justification**:
  > GrowthPilot AI uses `instagram_manage_insights` to display aggregated reach, impression trends, and audience engagement metrics in the unified Analytics dashboard. This allows creators and real estate professionals to track performance across platforms in one place. All metrics are strictly read-only; no user data is shared or modified.
- **Reviewer Instructions**:
  > 1. Navigate to `https://growthpilot-ai-two.vercel.app/analytics` after connecting an Instagram account.
  > 2. Select the Instagram tab.
  > 3. Verify that impressions, reach, and follower growth trends render on screen.

---

### Use Case 2: "Manage everything on your Page"
*API Architecture: Facebook Graph API v20.0 via Facebook Login*

#### D. `pages_show_list`
- **Feature**: Facebook Page & Linked Instagram Account Discovery
- **API Endpoint**: `GET /me/accounts?fields=id,name,access_token,instagram_business_account`
- **Copy-Paste Justification**:
  > GrowthPilot AI uses `pages_show_list` to list the Facebook Pages administered by the authenticated user. This enables the user to select which Facebook Page and linked Instagram Business Account to connect to GrowthPilot without having to manually locate and input Page IDs. This permission is strictly read-only.
- **Reviewer Instructions**:
  > 1. In `https://growthpilot-ai-two.vercel.app/meta-review-demo`, click "Step 2: Connect Facebook Page".
  > 2. Complete Facebook OAuth in the popup.
  > 3. Verify that the administered Facebook Page is discovered and listed in the connected accounts view.

#### E. `pages_read_engagement`
- **Feature**: Facebook Page Analytics & Health Center
- **API Endpoint**: `GET /{page-id}/insights?metric=page_impressions,page_engaged_users`
- **Copy-Paste Justification**:
  > GrowthPilot AI uses `pages_read_engagement` to read high-level page engagement, total reach, and follower metrics for connected Facebook Pages to populate the unified analytics overview. Data is read-only.
- **Reviewer Instructions**:
  > 1. Open `https://growthpilot-ai-two.vercel.app/analytics`.
  > 2. Select the Facebook Page tab.
  > 3. Verify that page impression and engagement metrics are loaded.

#### F. `pages_manage_posts`
- **Feature**: AI Content Studio — Facebook Page Feed Publishing
- **API Endpoint**: `POST /{page-id}/feed` or `POST /{page-id}/photos`
- **Copy-Paste Justification**:
  > GrowthPilot AI uses `pages_manage_posts` to publish user-approved posts, photos, and property announcements directly to the user's selected Facebook Page feed. Content cannot be published automatically; each post requires explicit human review and approval in GrowthPilot before submission.
- **Reviewer Instructions**:
  > 1. In `https://growthpilot-ai-two.vercel.app/meta-review-demo`, approve a draft post.
  > 2. Click "Publish to Facebook Page".
  > 3. Confirm that the API executes `POST /{page-id}/feed` and returns a valid post ID.

---

## 3. SCREENCAST VIDEO EVIDENCE

- **File Name**: `GrowthPilot-Meta-App-Review.webm`
- **Local Path**: `C:\Users\Admin\Downloads\GrowthPilot-Meta-App-Review.webm`
- **Web Link**: `https://growthpilot-ai-two.vercel.app/meta-review/GrowthPilot-Meta-App-Review.webm`
- **Screencast Outline**:
  - **0:00 - 0:15**: GrowthPilot AI Login screen & public app identity.
  - **0:15 - 0:35**: Instagram & Facebook OAuth popup flows demonstrating clean scope requests.
  - **0:35 - 0:50**: Account identity confirmation (`instagram_basic`, `pages_show_list`).
  - **0:50 - 1:15**: Content Studio AI draft + mandatory Human Approval Gate (`Lock` -> `Approve Post`).
  - **1:15 - 1:30**: Direct Instagram & Facebook publishing flow (`instagram_content_publish`, `pages_manage_posts`).
  - **1:30 - 1:45**: Analytics Dashboard (`instagram_manage_insights`, `pages_read_engagement`).
  - **1:45 - 2:00**: Disconnect & permanent AES-256 encrypted token purge.

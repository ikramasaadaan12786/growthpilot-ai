# META FINAL SUBMISSION PACKAGE — GROWTHPILOT AI

**Date**: August 26, 2026  
**App Name**: GrowthPilot AI  
**Company**: GrowthPilot AI  
**Product URL**: [https://growthpilot-ai-two.vercel.app](https://growthpilot-ai-two.vercel.app)  
**Reviewer Demo Hub**: [https://growthpilot-ai-two.vercel.app/meta-review-demo](https://growthpilot-ai-two.vercel.app/meta-review-demo)  
**Privacy Policy**: [https://growthpilot-ai-two.vercel.app/privacy](https://growthpilot-ai-two.vercel.app/privacy)  
**Terms of Service**: [https://growthpilot-ai-two.vercel.app/terms](https://growthpilot-ai-two.vercel.app/terms)  
**Data Deletion**: [https://growthpilot-ai-two.vercel.app/data-deletion](https://growthpilot-ai-two.vercel.app/data-deletion)  
**Support**: [https://growthpilot-ai-two.vercel.app/support](https://growthpilot-ai-two.vercel.app/support)  
**OAuth Redirect URI**: `https://growthpilot-ai-two.vercel.app/api/auth/oauth/instagram/callback`

---

## SECTION A — APP DESCRIPTION

GrowthPilot AI is an AI-powered social media content management platform designed for real estate professionals, marketing agencies, and solo creators. The platform provides an end-to-end workflow: AI-generated caption and post content → human review and approval → multi-platform publishing to Instagram, Facebook, LinkedIn, and TikTok. GrowthPilot AI does not auto-publish without explicit user action on every post.

---

## SECTION B — BUSINESS USE CASE

Real estate agents and marketing agencies use GrowthPilot AI to:
1. Save 10+ hours/week on creating property-listing content for Instagram and Facebook pages.
2. Maintain a consistent posting schedule across multiple platforms through a single unified dashboard.
3. Analyze audience engagement performance with built-in analytics powered by Instagram and Facebook page insights.
4. Manage approval workflows where content is reviewed by the account owner or a team lead before publishing.

---

## SECTION C — REVIEWER TEST ACCOUNT SETUP

**Test Demo Hub URL**: `https://growthpilot-ai-two.vercel.app/meta-review-demo`

**Test App Role User Credentials** (Meta Developer Portal → App Roles → Testers):
- The reviewing Facebook employee must be added to the app as a **Test User** or **Tester** in the app's Roles section in the Meta for Developers portal before the review OAuth will function.

**Test Account Required Capabilities**:
- A Facebook profile with access to at least one Facebook Page.
- The Facebook Page should have at least one linked Instagram Professional Account.
- No special business verification needed for sandbox/development mode.

---

## SECTION D — PERMISSION-BY-PERMISSION JUSTIFICATION

### 1. `instagram_basic`

| Field | Value |
|---|---|
| **Why GrowthPilot needs it** | To authenticate the user's Instagram identity and display the connected account handle, profile picture, and follower count on the GrowthPilot social accounts dashboard. |
| **Where user initiates it** | User navigates to `/social-accounts` → clicks "Connect Instagram" → completes OAuth dialog. |
| **What data is read/written** | Read-only: Instagram account ID, username, profile picture URL, media count. Nothing is written. |
| **How user benefits** | User can confirm their correct Instagram account is connected and see current follower / account status at a glance. |
| **How reviewer can reproduce it** | 1. Open `/meta-review-demo`. 2. Click "Step 1: Connect Instagram". 3. Complete OAuth. 4. Confirm username/avatar appears in dashboard. |
| **Screencast scene** | Demo Hub → Click Connect → OAuth Dialog → Callback Page → Dashboard with connected account identity visible. |

---

### 2. `instagram_content_publish`

| Field | Value |
|---|---|
| **Why GrowthPilot needs it** | To submit image and video posts that the user has explicitly reviewed and approved in the content studio to their Instagram account via the two-step Graph API media container + publish flow. |
| **Where user initiates it** | User navigates to `/content-studio` → drafts post → clicks "Approve & Publish to Instagram". |
| **What data is read/written** | Writes: Calls `POST /me/media` to create a media container, then `POST /me/media_publish` to publish it after user approval. |
| **How user benefits** | User can publish AI-drafted or custom Instagram posts directly from GrowthPilot without needing to copy/paste content. |
| **How reviewer can reproduce it** | 1. Open `/meta-review-demo`. 2. Proceed to Step 3: Draft Content. 3. Click "Approve Post". 4. Click "Publish to Instagram". 5. Confirm publish_id returned. |
| **Screencast scene** | Content Studio → Draft → Review Screen → "Approve" button click → API call to Graph → Success confirmation modal with post URL. |

---

### 3. `instagram_manage_insights`

| Field | Value |
|---|---|
| **Why GrowthPilot needs it** | To display real-time Instagram post-level and account-level engagement analytics (impressions, reach, likes, comments, saves) in the GrowthPilot Analytics dashboard, giving users a consolidated view without leaving the app. |
| **Where user initiates it** | User navigates to `/analytics` → selects "Instagram" from the platform filter. |
| **What data is read/written** | Read-only: Calls `GET /media/{id}/insights` and `GET /me/insights` metrics. Nothing is written. |
| **How user benefits** | Users see which content is performing best without switching between apps. Growth score and recommendations are computed from this data. |
| **How reviewer can reproduce it** | 1. Complete Instagram connect flow. 2. Navigate to `/analytics`. 3. Select Instagram platform. 4. Verify impressions and reach data loads. |
| **Screencast scene** | Analytics Dashboard → Instagram tab → Chart rendering with impressions/reach/engagement metrics for the past 7 days. |

---

### 4. `pages_show_list`

| Field | Value |
|---|---|
| **Why GrowthPilot needs it** | To retrieve the list of Facebook Pages that the authenticated user administers, so they can select which Page to connect to GrowthPilot for publishing and analytics. |
| **Where user initiates it** | User navigates to `/social-accounts` → clicks "Connect Facebook Page" → completes OAuth. |
| **What data is read/written** | Read-only: Calls `GET /me/accounts` to list accessible pages. Nothing is written. |
| **How user benefits** | Users managing multiple Facebook Pages can select the correct one without having to enter a Page ID manually. |
| **How reviewer can reproduce it** | 1. Complete Facebook OAuth. 2. Observe page selection screen with a dropdown showing available pages. |
| **Screencast scene** | Post-OAuth callback → Page Selection Dropdown populated with available Facebook Pages → User selects one → Dashboard shows selected page name. |

---

### 5. `pages_read_engagement`

| Field | Value |
|---|---|
| **Why GrowthPilot needs it** | To display Facebook Page-level engagement analytics (post reach, impressions, fan growth) in the GrowthPilot Analytics dashboard. |
| **Where user initiates it** | User navigates to `/analytics` → selects "Facebook" platform tab. |
| **What data is read/written** | Read-only: Calls `GET /{page-id}/insights` with engagement metrics. Nothing is written. |
| **How user benefits** | Users see combined Instagram + Facebook performance in one dashboard. |
| **How reviewer can reproduce it** | 1. Connect a Facebook Page. 2. Navigate to `/analytics`. 3. Click Facebook tab. 4. Verify fan count and reach data loads. |
| **Screencast scene** | Analytics → Facebook tab → Page Insights chart rendering → Engagement metrics visible. |

---

### 6. `pages_manage_posts`

| Field | Value |
|---|---|
| **Why GrowthPilot needs it** | To publish approved content to the user's connected Facebook Page using `POST /{page-id}/feed` or `POST /{page-id}/photos` on behalf of the page. Every post requires explicit user approval before publishing. |
| **Where user initiates it** | User navigates to `/content-studio` → drafts or edits content → clicks "Approve & Publish to Facebook". |
| **What data is read/written** | Writes: `POST /{page-id}/feed` or `/{page-id}/photos`. Only publishes content that the user has approved in the approval workflow. |
| **How user benefits** | Users publish Facebook page content directly from GrowthPilot after review, eliminating copy-paste workflows. |
| **How reviewer can reproduce it** | 1. Connect Facebook page. 2. Open `/content-studio`. 3. Draft a post. 4. Approve it. 5. Click "Publish to Facebook". 6. Observe the post_id confirmation. |
| **Screencast scene** | Content Studio → Facebook Post Draft → Approval Step → Publish button → Success screen with post_id. |

---

## SECTION E — TEST FLOW (STEP-BY-STEP FOR REVIEWER)

1. **Open Reviewer Demo Hub**: Navigate to `https://growthpilot-ai-two.vercel.app/meta-review-demo`.
2. **Register / Log In**: Create a demo account or use the provided test credentials.
3. **Connect Instagram Account**: Click "Step 1: Connect Instagram" to initiate OAuth.
4. **Connect Facebook Page**: Click "Step 2: Connect Facebook Page" to initiate Pages OAuth.
5. **View Account Identity**: Confirm both connected accounts appear in the social accounts section.
6. **Draft Content**: Click "Step 3: Draft AI Content" to generate a sample post.
7. **Review Content**: The approval screen appears — content cannot be published without this step.
8. **Approve & Publish**: Click "Approve" then "Publish to Instagram & Facebook".
9. **View Analytics**: Navigate to "Step 5: View Analytics" and confirm engagement metrics load.
10. **Disconnect Accounts**: Click "Step 6: Disconnect" — tokens are immediately purged from database.

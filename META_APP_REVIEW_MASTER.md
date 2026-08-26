# META APP REVIEW MASTER SUBMISSION GUIDE — GROWTHPILOT AI

**Application Name**: GrowthPilot AI  
**Meta App ID**: (Configured in Meta Developer Dashboard)  
**Primary Website**: [https://growthpilot-ai-two.vercel.app](https://growthpilot-ai-two.vercel.app)  
**Meta Review Hub**: [https://growthpilot-ai-two.vercel.app/meta-review-demo](https://growthpilot-ai-two.vercel.app/meta-review-demo)  
**Privacy Policy**: [https://growthpilot-ai-two.vercel.app/privacy](https://growthpilot-ai-two.vercel.app/privacy)  
**Terms of Service**: [https://growthpilot-ai-two.vercel.app/terms](https://growthpilot-ai-two.vercel.app/terms)  
**Data Deletion URL**: [https://growthpilot-ai-two.vercel.app/data-deletion](https://growthpilot-ai-two.vercel.app/data-deletion)

---

## 1. Product Overview & Purpose
GrowthPilot AI is a multi-platform social media growth, lead acquisition, and content automation SaaS built specifically for real estate agencies, brokerages, and digital creators. The application allows users to connect their Instagram Professional accounts and Facebook Pages to draft, optimize, approve, schedule, and publish property listings, market updates, and video reels with unified lead tracking.

---

## 2. Requested Permissions & Business Justifications

### A. `instagram_basic`
- **Purpose**: Read the user's Instagram Professional Account ID, username/handle, profile picture, and follower counts to display account connectivity status on the dashboard.
- **Where Used**: [`src/app/social-accounts/page.tsx`](file:///C:/Users/Admin/.gemini/antigravity/scratch/growthpilot-ai/src/app/social-accounts/page.tsx) and Header account status.
- **User Flow**: User clicks "Connect Instagram" on the Social Accounts page, completes Meta Dialog OAuth, and returns to see their connected Instagram profile handle and follower metric.

### B. `instagram_content_publish`
- **Purpose**: Create media containers and publish verified property tour photos, carousel posts, and Instagram Reels approved by the user.
- **Where Used**: [`src/lib/integrations/instagram.ts`](file:///C:/Users/Admin/.gemini/antigravity/scratch/growthpilot-ai/src/lib/integrations/instagram.ts) via `POST /v19.0/{ig-user-id}/media` and `POST /v19.0/{ig-user-id}/media_publish`.
- **User Flow**: User drafts content in Content Studio, reviews formatting, approves the draft, and clicks "Publish Now" or sets a schedule.

### C. `pages_show_list`
- **Purpose**: List the Facebook Pages managed by the authenticated user to let them select which business page to connect.
- **Where Used**: [`src/lib/integrations/facebook.ts`](file:///C:/Users/Admin/.gemini/antigravity/scratch/growthpilot-ai/src/lib/integrations/facebook.ts) via `GET /v19.0/me/accounts`.

### D. `pages_read_engagement` & `pages_manage_posts`
- **Purpose**: Read page engagement metrics (reach, impressions, reactions) and publish approved property announcements to the connected Facebook Business Page.
- **Where Used**: [`src/app/analytics/page.tsx`](file:///C:/Users/Admin/.gemini/antigravity/scratch/growthpilot-ai/src/app/analytics/page.tsx) and Facebook publishing handlers.

---

## 3. Step-by-Step Meta Reviewer Testing Instructions

1. **Access Web App**: Navigate to `https://growthpilot-ai-two.vercel.app/meta-review-demo`.
2. **Review Account Login**: Log in with the test user account provided in the Meta Review Notes.
3. **Trigger OAuth**: Click **Launch Real Instagram OAuth Dialog** or **Launch Real Facebook OAuth Dialog**.
4. **Grant Permissions**: Approve the requested permissions (`instagram_basic`, `instagram_content_publish`, `pages_manage_posts`).
5. **Inspect Live State**: Observe the connected handle `@growthpilot_re` and live follower count.
6. **Generate Content**: Navigate to **Content Studio**, generate a sample Real Estate listing post.
7. **Approve & Publish**: Change status from `DRAFT` to `APPROVED` and trigger the test publish to create the media container.
8. **Disconnect & Data Deletion**: Click **Disconnect** or visit `/data-deletion` to confirm the access token is purged from the database.

---

## 4. Screencast Storyboard Checklist
- **Clip 1 (0:00 - 0:30)**: Show login and navigating to Social Accounts.
- **Clip 2 (0:30 - 1:15)**: Click "Connect Instagram", show Facebook OAuth Dialog with app name, icon, and requested scopes.
- **Clip 3 (1:15 - 1:45)**: Return to dashboard, show connected profile handle and live metrics.
- **Clip 4 (1:45 - 2:30)**: Create reel in Content Studio, review caption and hashtags, approve draft, and click publish.
- **Clip 5 (2:30 - 3:00)**: Navigate to Settings, click Disconnect, verify token purge, and show `/data-deletion` page.

# TIKTOK APP REVIEW MASTER SUBMISSION GUIDE — GROWTHPILOT AI

**Application Name**: GrowthPilot AI  
**TikTok App Key**: (Configured in TikTok Developer Portal)  
**Production URL**: [https://growthpilot-ai-two.vercel.app](https://growthpilot-ai-two.vercel.app)  
**TikTok Review Demo Hub**: [https://growthpilot-ai-two.vercel.app/tiktok-review-demo](https://growthpilot-ai-two.vercel.app/tiktok-review-demo)  
**Verification File**: [https://growthpilot-ai-two.vercel.app/tiktok4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP.txt](https://growthpilot-ai-two.vercel.app/tiktok4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP.txt)  
**Privacy Policy**: [https://growthpilot-ai-two.vercel.app/privacy](https://growthpilot-ai-two.vercel.app/privacy)  
**Terms of Service**: [https://growthpilot-ai-two.vercel.app/terms](https://growthpilot-ai-two.vercel.app/terms)  
**Data Deletion**: [https://growthpilot-ai-two.vercel.app/data-deletion](https://growthpilot-ai-two.vercel.app/data-deletion)

---

## 1. Product Overview & Purpose
GrowthPilot AI enables digital creators, marketing agencies, and real estate professionals to plan, script, optimize, and upload short-form video property tours and educational content directly to their authorized TikTok accounts via the official Content Posting API.

---

## 2. Requested Scopes & Technical Justification

### A. `user.info.basic`
- **Purpose**: Authenticate creator identity and display the connected username/avatar on the multi-platform dashboard.
- **Where Used**: [`src/lib/integrations/tiktok.ts`](file:///C:/Users/Admin/.gemini/antigravity/scratch/growthpilot-ai/src/lib/integrations/tiktok.ts) via `GET https://open.tiktokapis.com/v2/user/info/`.

### B. `video.upload`
- **Purpose**: Upload approved video drafts to the creator's TikTok Creator Inbox for final review and direct publishing.
- **Where Used**: [`src/lib/integrations/tiktok.ts`](file:///C:/Users/Admin/.gemini/antigravity/scratch/growthpilot-ai/src/lib/integrations/tiktok.ts) via `POST https://open.tiktokapis.com/v2/post/publish/inbox/video/init/` and binary `FILE_UPLOAD` streaming.

---

## 3. TikTok Reviewer Test Instructions

1. **Access Demo Hub**: Visit `https://growthpilot-ai-two.vercel.app/tiktok-review-demo`.
2. **Authorize Sandbox/Review Account**: Click **Connect TikTok Account** to trigger OAuth 2.0 PKCE with `user.info.basic` and `video.upload`.
3. **Inspect Profile State**: Observe connected TikTok creator handle and live status indicator.
4. **Draft & Dispatch Video**: Click **Dispatch Test Video to Creator Inbox (FILE_UPLOAD)**.
5. **Verify Inbox Notification**: Confirm the sample video is uploaded with a valid `publish_id` into the TikTok app Creator Inbox.
6. **Disconnect Account**: Click **Disconnect** to immediately revoke access and delete the stored token.

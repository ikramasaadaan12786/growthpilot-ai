# TIKTOK FINAL SUBMISSION PACKAGE — GROWTHPILOT AI

**Date**: August 26, 2026  
**App Name**: GrowthPilot AI  
**TikTok App Key**: (Configured in TikTok Developer Portal)  
**Product URL**: [https://growthpilot-ai-two.vercel.app](https://growthpilot-ai-two.vercel.app)  
**TikTok Reviewer Demo Hub**: [https://growthpilot-ai-two.vercel.app/tiktok-review-demo](https://growthpilot-ai-two.vercel.app/tiktok-review-demo)  
**TikTok Verification File**: [https://growthpilot-ai-two.vercel.app/tiktok4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP.txt](https://growthpilot-ai-two.vercel.app/tiktok4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP.txt)  
**Privacy Policy**: [https://growthpilot-ai-two.vercel.app/privacy](https://growthpilot-ai-two.vercel.app/privacy)  
**Terms of Service**: [https://growthpilot-ai-two.vercel.app/terms](https://growthpilot-ai-two.vercel.app/terms)  
**Data Deletion**: [https://growthpilot-ai-two.vercel.app/data-deletion](https://growthpilot-ai-two.vercel.app/data-deletion)  
**Support**: [https://growthpilot-ai-two.vercel.app/support](https://growthpilot-ai-two.vercel.app/support)  
**OAuth Redirect URI**: `https://growthpilot-ai-two.vercel.app/api/auth/oauth/tiktok/callback`

---

## SECTION A — PRODUCT DESCRIPTION

GrowthPilot AI is an AI-powered content management and publishing platform serving real estate agents, marketing agencies, and digital content creators.

GrowthPilot AI integrates with TikTok to allow users to:
1. Generate short-form video property tour scripts using AI.
2. Review and approve video content before upload.
3. Upload approved videos to their TikTok Creator Inbox using the official TikTok Content Posting API `FILE_UPLOAD` method.
4. The creator then manually reviews and publishes from the TikTok app or Creator Center.

GrowthPilot AI does NOT auto-publish without creator consent. All videos are delivered to the Creator Inbox, not published directly to the public feed.

---

## SECTION B — SCOPE-BY-SCOPE JUSTIFICATION

### 1. Login Kit / `user.info.basic`

**Why GrowthPilot needs it**: To authenticate the TikTok creator's identity and display their connected account handle and profile avatar on the GrowthPilot social accounts dashboard.

**User flow**: User → `/social-accounts` → "Connect TikTok" → TikTok OAuth 2.0 PKCE dialog → authorize → Callback stores creator info.

**Data Read**: `display_name`, `avatar_url`, `open_id` — read-only. No content read.

**User benefit**: User can confirm their correct TikTok creator account is linked to GrowthPilot.

**Reviewer Reproduction**: 1. Open `/tiktok-review-demo`. 2. Click "Connect TikTok Account". 3. Complete OAuth. 4. Observe username and avatar appear in dashboard.

---

### 2. `video.upload`

**Why GrowthPilot needs it**: To upload MP4 video files that the user has approved in GrowthPilot's content studio to their TikTok Creator Inbox using the official `FILE_UPLOAD` mode of the Content Posting API. The video is NOT auto-published — it lands in the Creator Inbox for the creator to review and publish.

**User flow**: User → `/content-studio` → generates video script → approves content → clicks "Upload to TikTok Creator Inbox" → GrowthPilot calls `POST /v2/post/publish/inbox/video/init/` with creator's access token → Binary file upload follows → `publish_id` returned.

**Data Written**: An MP4 video file streamed to the TikTok Content Posting API. No captions, no hashtags, no public posting without the creator acting in their TikTok app.

**User benefit**: Creators can seamlessly move videos drafted in GrowthPilot's AI studio to their TikTok Creator Inbox without leaving the GrowthPilot workflow.

**Important**: The Creator Inbox approach means a human creator reviews and publishes every video — GrowthPilot cannot auto-publish.

**Reviewer Reproduction**: 1. Open `/tiktok-review-demo`. 2. Complete OAuth. 3. Click "Dispatch Test Video to Creator Inbox". 4. Check TikTok Creator app Inbox for the received video.

---

## SECTION C — USER CONTROL

- **Connect**: User initiates TikTok OAuth from `/social-accounts` — never automatic.
- **Approve Before Upload**: Every video must be approved in GrowthPilot's approval workflow before upload. Unapproved drafts cannot reach TikTok.
- **Creator Inbox (Not Auto-Publish)**: GrowthPilot places videos in the TikTok Creator Inbox. The creator retains full control over whether to publish to their feed.
- **Disconnect**: User clicks "Disconnect TikTok" on `/social-accounts`. The access token is immediately deleted from GrowthPilot's encrypted database (AES-256-GCM vault).
- **Data Deletion**: User submits a deletion request via `/data-deletion`. All TikTok tokens and associated data are removed within 48 hours.

---

## SECTION D — CONTENT APPROVAL FLOW

```
[User: Generate AI Video Script in Content Studio]
          ↓
[User: Review Script — can edit or reject]
          ↓
[User: Click "Approve" button (required)]
          ↓
[GrowthPilot: Status = APPROVED, Upload becomes available]
          ↓
[User: Click "Upload to TikTok Creator Inbox"]
          ↓
[GrowthPilot → TikTok Content Posting API: FILE_UPLOAD]
          ↓
[TikTok: Video appears in Creator Inbox (NOT public)]
          ↓
[Creator: Reviews in TikTok app → publishes or discards]
```

**No step in this chain bypasses human creator intent.**

---

## SECTION E — TESTER INSTRUCTIONS FOR TIKTOK REVIEWER

1. **Verify the domain file**: Open `https://growthpilot-ai-two.vercel.app/tiktok4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP.txt` — should return the required verification string.
2. **Open Demo Hub**: Navigate to `https://growthpilot-ai-two.vercel.app/tiktok-review-demo`.
3. **Connect TikTok Account**: Click "Connect TikTok Account" — completes OAuth 2.0 PKCE S256 flow.
4. **Verify Creator Identity**: Observe TikTok handle and avatar on the dashboard.
5. **Generate Content**: Click "Generate Video Script" to produce AI-written real estate video content.
6. **Approve Content**: Click "Approve Script" — note Publish is blocked until this step.
7. **Upload to Creator Inbox**: Click "Dispatch Test Video to Creator Inbox (FILE_UPLOAD)".
8. **Verify Inbox**: Open the TikTok Creator app and confirm the test video appears in the Creator Inbox — not on the public feed.
9. **Disconnect**: Click "Disconnect TikTok" and confirm token deletion.

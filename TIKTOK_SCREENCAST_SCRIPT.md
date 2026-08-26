# TIKTOK APP REVIEW — SCREENCAST SCRIPT
## GrowthPilot AI — TikTok Reviewer Video Recording Guide

**Target Duration**: 3–4 minutes  
**Required**: TikTok test account with Content Posting API sandbox access, screen recorder

---

## PRE-RECORDING CHECKLIST

- [ ] TikTok Developer App in sandbox/review mode
- [ ] Test TikTok Creator account authorized as a sandbox tester in the TikTok Dev Portal
- [ ] `https://growthpilot-ai-two.vercel.app/tiktok-review-demo` loaded in Chrome
- [ ] Screen recording started

---

## SCENE 1 — Domain Verification File (0:00–0:15)

**Screen**: Browser address bar  
**Action**: Navigate to `https://growthpilot-ai-two.vercel.app/tiktok4Y8GRLOuyJat8Xcl2RC0JqaTqMX3dNsP.txt`  
**Expected Result**: Plain text verification string renders in the browser  
**Narration**: *"GrowthPilot AI's domain ownership is verified via the TikTok-required verification file."*  
**Permission Demonstrated**: Domain ownership

---

## SCENE 2 — TikTok OAuth with Login Kit (0:15–1:00)

**Screen**: `/tiktok-review-demo` demo hub  
**Action**: Click "Connect TikTok Account"  
**Expected Result**: TikTok OAuth 2.0 dialog appears showing app name "GrowthPilot AI" and `user.info.basic` scope  
**Action**: Authorize with test TikTok account  
**Expected Result**: Callback redirects to GrowthPilot dashboard showing TikTok creator username and avatar  
**Narration**: *"The user authorizes GrowthPilot to read their basic TikTok profile identity. No content is read or published at this point."*  
**Permission Demonstrated**: `user.info.basic`

---

## SCENE 3 — Video Script Generation & Approval (1:00–2:00)

**Screen**: Content Studio (`/content-studio`) or Review Demo Hub Step 3  
**Action**: Click "Generate AI Video Script"  
**Expected Result**: AI-written real estate property tour script appears in a draft editor  
**Action**: Review the script content — narrator reads through it  
**Action**: Click "Approve Script" button  
**Expected Result**: Status badge changes from DRAFT to APPROVED. Upload button becomes active.  
**Narration**: *"The creator must explicitly approve the script before any video upload is possible. This is a required step — GrowthPilot cannot bypass it."*  
**Permission Demonstrated**: Human approval flow (prerequisite to `video.upload`)

---

## SCENE 4 — Upload to TikTok Creator Inbox (2:00–3:00)

**Screen**: Content Studio → Upload Step  
**Action**: Click "Upload Approved Video to TikTok Creator Inbox"  
**Expected Result**: GrowthPilot calls TikTok Content Posting API `POST /v2/post/publish/inbox/video/init/` with FILE_UPLOAD mode  
**Expected Result**: Success screen displays `publish_id` — confirming the video reached the Creator Inbox  
**Narration**: *"The video is placed in the creator's TikTok Creator Inbox, NOT published to the public feed. The creator still decides whether to publish."*  
**Permission Demonstrated**: `video.upload`

---

## SCENE 5 — TikTok Creator Inbox Verification (3:00–3:30)

**Screen**: TikTok mobile app or Creator Center → Inbox  
**Action**: Navigate to TikTok app → Creator tools → Inbox  
**Expected Result**: Uploaded video appears in the Inbox, awaiting creator review  
**Narration**: *"The video is ready in the TikTok Creator Inbox. The creator can preview, add hashtags, and publish — or delete it. GrowthPilot's role ends at upload."*  
**Permission Demonstrated**: `video.upload` — end-to-end creator inbox delivery verified

---

## SCENE 6 — Account Disconnect (3:30–4:00)

**Screen**: `/social-accounts` or Demo Hub disconnect step  
**Action**: Click "Disconnect TikTok"  
**Expected Result**: Confirmation that TikTok access token has been permanently deleted from GrowthPilot's database  
**Narration**: *"The user can disconnect at any time. All tokens are immediately and permanently deleted."*  
**Permission Demonstrated**: User control, data deletion compliance

---

## POST-RECORDING CHECKLIST

- [ ] TikTok "GrowthPilot AI" app name is visible in the OAuth dialog
- [ ] Approve step is clearly shown BEFORE upload
- [ ] Creator Inbox receipt is visually confirmed (not just an API response)
- [ ] Disconnect shown with confirmation
- [ ] No passwords, tokens, or credentials visible
- [ ] Duration: under 4 minutes

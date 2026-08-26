# PLATFORM REVIEW SCREENCAST MASTER GUIDE — GROWTHPILOT AI

**Date**: August 26, 2026  
**Platforms**: Meta (Instagram + Facebook) | TikTok | LinkedIn  
**Purpose**: Consolidated recording sequence for all external platform reviews

---

## MASTER PRE-RECORDING SETUP

Before recording any video:

1. **Browser**: Chrome with clean profile (no personal autofill, no saved passwords visible).
2. **Screen resolution**: 1920×1080 (Full HD) or 1280×720 minimum.
3. **Recording tool**: OBS Studio (free), Loom, or macOS QuickTime.
4. **Test accounts**: Relevant sandbox/test accounts active in each platform's Developer Portal.
5. **GrowthPilot URL**: `https://growthpilot-ai-two.vercel.app` open in browser.
6. **Duration target**: Each video under 5 minutes.

---

## VIDEO 1 — META (INSTAGRAM & FACEBOOK) — ~4 minutes

### Scene Sequence

| # | Screen | Action | Expected Result | Narration | Permission |
|---|---|---|---|---|---|
| 1 | `/meta-review-demo` | Scroll through hub overview | 8 review steps visible | "This is GrowthPilot AI's Meta reviewer hub." | App overview |
| 2 | Demo Hub Step 1 | Click "Connect Instagram & Facebook" | TikTok Meta OAuth dialog with GrowthPilot app name | "One OAuth authorizes both Instagram and Facebook." | `instagram_basic`, `pages_show_list` |
| 3 | Callback / Dashboard | OAuth completes | Username, avatar, follower count + Facebook Page name shown | "Identity data reads successfully." | `instagram_basic`, `pages_show_list` |
| 4 | `/content-studio` | Click "Generate AI Post Draft" | AI-generated caption appears | "GrowthPilot generates post content." | — |
| 5 | Approval Screen | Review draft — **do NOT skip** | Post stays DRAFT until approved | "Content cannot be published without approval." | Human control |
| 6 | Approval Screen | Click "Approve" | Status → APPROVED; Publish buttons activate | — | — |
| 7 | Publish Step | Click "Publish to Instagram" + "Publish to Facebook" | `instagram_media_id` and `post_id` confirmed | "Content published after approval." | `instagram_content_publish`, `pages_manage_posts` |
| 8 | `/analytics` | Select Instagram tab | Impressions/reach chart loads | "Analytics pulled from Instagram Insights." | `instagram_manage_insights` |
| 9 | `/analytics` | Select Facebook tab | Page insights load | "Facebook engagement analytics visible." | `pages_read_engagement` |
| 10 | Demo Hub Step 6 | Click "Disconnect" both | Confirmation: tokens deleted | "Users can disconnect and delete data anytime." | Data control |

**What NOT to show**: Any password input, API key, session token, or personal email address.

---

## VIDEO 2 — TIKTOK — ~3.5 minutes

### Scene Sequence

| # | Screen | Action | Expected Result | Narration | Permission |
|---|---|---|---|---|---|
| 1 | Browser address bar | Navigate to TikTok verification file URL | Plain text verification string renders | "Domain ownership verified." | Domain verification |
| 2 | `/tiktok-review-demo` | Click "Connect TikTok Account" | TikTok OAuth dialog with `user.info.basic` scope | "TikTok profile authorization." | `user.info.basic` |
| 3 | Dashboard | OAuth completes | TikTok handle + avatar visible | "Creator identity confirmed." | `user.info.basic` |
| 4 | Content Studio | Click "Generate Video Script" | AI real estate video script appears | "AI drafts property tour content." | — |
| 5 | Approval step | Review script | Post remains DRAFT | "Human approval is required before upload." | Human control |
| 6 | Approval step | Click "Approve Script" | Status → APPROVED | — | — |
| 7 | Upload step | Click "Upload to Creator Inbox" | `publish_id` returned | "Video dispatched to TikTok Creator Inbox." | `video.upload` |
| 8 | TikTok Creator app | Navigate to Inbox | Video appears in inbox (NOT on public feed) | "Creator decides to publish or discard." | `video.upload` end result |
| 9 | `/social-accounts` | Click "Disconnect TikTok" | Token deleted confirmation | "User in full control of data." | Data deletion |

---

## VIDEO 3 — LINKEDIN (Member Profile Posting) — ~2 minutes

> **Note**: This video demonstrates currently approved self-serve scopes. Organization page posting is pending Community Management API approval and should NOT be demonstrated until that approval is granted.

### Scene Sequence

| # | Screen | Action | Expected Result | Narration | Permission |
|---|---|---|---|---|---|
| 1 | `/social-accounts` | Click "Connect LinkedIn" | LinkedIn OpenID OAuth dialog | "LinkedIn OpenID Connect authorization." | `openid`, `profile`, `email` |
| 2 | Dashboard | OAuth completes | LinkedIn name, headline, avatar visible | "Member profile identity confirmed." | `openid`, `profile` |
| 3 | Content Studio | Draft LinkedIn post | Post text in LinkedIn format | — | — |
| 4 | Approval step | Click "Approve" | Status → APPROVED | "Same approval flow as other platforms." | Human control |
| 5 | Publish step | Click "Publish to LinkedIn" | `ugcPost_id` returned | "UGC post published to member profile." | `w_member_social` |
| 6 | `/social-accounts` | Click "Disconnect LinkedIn" | Token deleted | "Data deleted immediately on disconnect." | Data control |

---

## COMMON RULES FOR ALL RECORDINGS

- ✅ Always show the app name in the OAuth dialog
- ✅ Always show the approval step BEFORE publishing
- ✅ Always show the disconnect/data deletion step
- ❌ Never show passwords, tokens, API keys, or email addresses
- ❌ Never cut the video before showing success confirmation
- ❌ Never show the admin dashboard or internal system diagnostics

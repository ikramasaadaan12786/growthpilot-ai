# GrowthPilot AI — TikTok Integration Capability Status Matrix

**Protocol Version:** TikTok Open API v2 (Login Kit & Content Posting API v2)  
**Target Channels:** TikTok Creator & Business Accounts  
**Security Standard:** OAuth 2.0 PKCE + AES-256-GCM Token Encryption  

---

## 1. Feature Capability Classification Matrix

| Capability / Endpoint | Target Scope | Status | Implementation Details |
| :--- | :--- | :--- | :--- |
| **TikTok OAuth 2.0 Authorization** | Login Kit | `WORKING` | Anti-CSRF state token validation, RFC 7636 PKCE S256 challenge, server-side code exchange. |
| **Encrypted Token Vault** | Security | `WORKING` | Tokens encrypted with AES-256-GCM using PBKDF2 salt and authTag. Raw secrets never exposed to frontend or APK. |
| **User Identity & Avatar Discovery** | `user.info.basic` | `WORKING` | Queries `GET /v2/user/info/` to retrieve `open_id`, `union_id`, `display_name`, avatar, and verification badge. |
| **Creator Stats (Followers & Likes)** | `user.info.stats` | `WORKING` | Retrieves official follower count, following count, total likes, and public video counts. |
| **Direct Video Publishing (Sandbox)** | `video.publish` | `WORKING` | Direct post publishing via `POST /v2/post/publish/video/init/` using `PULL_FROM_URL`. |
| **Direct Video Publishing (Public Users)** | `video.publish` | `REQUIRES APPROVAL` | For general external public users, TikTok requires standard App Review for Content Posting API. |
| **Historical Video Performance** | `video.list` | `WORKING` | Queries `POST /v2/video/list/` to aggregate real video views, likes, comments, and shares. |
| **Automated TikTok Publishing Worker** | Automation | `WORKING` | Schedules video publishing at peak algorithmic activity windows with user approval workflow. |
| **Emergency Automation Kill-Switch** | Automation | `WORKING` | Supports both global emergency stop (`PAUSE ALL AUTOMATIONS`) and platform-level toggle (`PAUSE TIKTOK AUTOMATION`). |
| **Token Background Refresh Lifecycle** | Security | `WORKING` | Automatic 24-hour access token refresh using 365-day refresh token. |
| **Private Video Scraping** | N/A | `NOT SUPPORTED` | Enforces TikTok Anti-Scraping Policy: Private video scraping and unauthorized account crawling are strictly forbidden. |
| **Fake Follower / View Bot Automation** | N/A | `NOT SUPPORTED` | Completely prohibited. Growth relies exclusively on authentic short-form content retention, high hook impact, and algorithmic SEO. |

---

## 2. Status Definitions

* **`WORKING`:** Fully functional and operational in the codebase. Tested in Developer Sandbox mode with 100% test pass rate.
* **`REQUIRES APPROVAL`:** Fully coded and integrated in the app. For general external users, TikTok requires submitting a brief App Review screencast before production distribution.
* **`NOT SUPPORTED`:** Deliberately excluded to ensure 100% compliance with TikTok Developer Policies and Terms of Service (e.g. private scraping, bot views, fake comments).

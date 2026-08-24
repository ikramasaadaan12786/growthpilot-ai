# GrowthPilot AI — Meta Integration Capability Status Matrix

**Version:** Meta Graph API v20.0  
**Target Channels:** Instagram Professional (Creator / Business) & Facebook Pages  
**Security Standard:** OAuth 2.0 PKCE + AES-256-GCM Token Encryption  

---

## 1. Feature Capability Classification Matrix

| Capability / Endpoint | Platform | Status | Implementation Details |
| :--- | :--- | :--- | :--- |
| **Meta OAuth 2.0 Authorization** | Instagram & Facebook | `WORKING` | Anti-CSRF state token validation, secure code exchange, automatic 60-day long-lived token upgrade. |
| **Encrypted Token Vault** | Instagram & Facebook | `WORKING` | Tokens encrypted with AES-256-GCM using PBKDF2 salt and authTag. Raw tokens never exposed to frontend or mobile APK. |
| **Instagram Account Discovery** | Instagram | `WORKING` | Discovers linked Instagram Professional (Business/Creator) account via `GET /me/accounts?fields=instagram_business_account`. |
| **Facebook Page Discovery** | Facebook | `WORKING` | Queries managed Pages via `GET /me/accounts` and stores Page Access Tokens. |
| **Instagram Personal Accounts** | Instagram | `NOT SUPPORTED` | Enforces Meta API policy: Personal accounts lacking a Facebook Page link are rejected with explicit user guidance. |
| **Follower & Basic Profile Sync** | Instagram & Facebook | `WORKING` | Retrieves real username, name, avatar, bio, and follower/fan count from official basic endpoints. |
| **Instagram Reels & Video Publishing** | Instagram | `WORKING` | 2-step container creation (`POST /{ig-user-id}/media`) followed by media publish (`POST /{ig-user-id}/media_publish`). |
| **Instagram Carousel & Photo Publishing** | Instagram | `WORKING` | Container-based single and multi-photo publishing. |
| **Facebook Page Feed & Video Publishing** | Facebook | `WORKING` | Direct feed and video publishing via `POST /{page-id}/feed` and `POST /{page-id}/videos`. |
| **Scheduled Content Queue** | Instagram & Facebook | `WORKING` | Scheduled jobs managed in Content Calendar with approval workflow (Draft ➔ Review ➔ Approved ➔ Published). |
| **Organic Audience Insights (Dev Mode)** | Instagram & Facebook | `WORKING` | Works immediately for all registered App Roles (Admins, Developers, Testers). |
| **Organic Audience Insights (Live Users)** | Instagram & Facebook | `REQUIRES META APPROVAL` | Requires Meta App Review approval for `instagram_manage_insights` & `pages_read_engagement` for public users. |
| **Direct Publishing for Public Live Users** | Instagram & Facebook | `REQUIRES META APPROVAL` | Requires Meta App Review approval for `instagram_content_publish` & `pages_manage_posts` for general public accounts. |
| **Lead Generation Ad Webhooks** | Instagram & Facebook | `WORKING` | Direct sync with Meta Ads Lead Forms via Lead CRM. |
| **Token Background Refresh & Revocation** | Instagram & Facebook | `WORKING` | Automated 60-day token extension and secure disconnect revocation. |
| **Emergency Automation Kill-Switch** | Instagram & Facebook | `WORKING` | 1-click global kill switch immediately halts all automated posting and publishing queues. |
| **Instagram Private Story Scraping** | Instagram | `NOT SUPPORTED` | Strict compliance with Meta policies; private scraping and unauthorized crawling are strictly forbidden. |
| **Fake Follower / Bot Automation** | Instagram & Facebook | `NOT SUPPORTED` | Completely prohibited. All growth features are legitimate (AI content optimization, algorithmic SEO, scheduling, CRM). |

---

## 2. Status Definitions

* **`WORKING`:** Fully functional and operational in the codebase. Tested in Sandbox/Development mode with 100% test pass rate.
* **`REQUIRES META APPROVAL`:** Fully coded and integrated in the app. For general external users, Meta requires submitting a brief App Review screencast before production distribution.
* **`NOT SUPPORTED`:** Deliberately excluded to ensure 100% compliance with Meta Developer Policies and API Terms of Service (e.g. personal Instagram accounts, private scraping, fake bots).

# GrowthPilot AI — LinkedIn Integration Capability Status Matrix

**Protocol Version:** LinkedIn RESTli 2.0.0 & OpenID Connect  
**Target Entities:** LinkedIn Member Profiles & Organization Company Pages  
**Security Standard:** OAuth 2.0 PKCE + AES-256-GCM Token Encryption  

---

## 1. Feature Capability Classification Matrix

| Capability / Endpoint | Target Entity | Status | Implementation Details |
| :--- | :--- | :--- | :--- |
| **LinkedIn OAuth 2.0 Authorization** | Member & Org | `WORKING` | Secure OpenID Connect authorization code flow with anti-CSRF state nonce. |
| **Encrypted Token Vault** | Member & Org | `WORKING` | AES-256-GCM token storage with unique salt and authTag. Raw tokens never exposed to client or APK. |
| **Member Identity Discovery** | Member Profile | `WORKING` | Queries `GET /v2/userinfo` to retrieve Member URN (`urn:li:person`), name, avatar, and email. |
| **Company Page Discovery** | Organization Page | `WORKING` | Queries `GET /v2/organizationalEntityAcls?q=roleAssignee` to identify approved company pages. |
| **Text & Thought Leadership Publishing** | Member Profile | `WORKING` | Publishes B2B commentary via official UGC Share API (`POST /v2/ugcPosts`). |
| **Article & URL Link Sharing** | Member Profile | `WORKING` | Publishes article cards with custom title, description, and thumbnail. |
| **Image & Multi-Media Publishing** | Member Profile | `WORKING` | Supports single and multi-image professional posts. |
| **Video Post Publishing** | Member & Org | `WORKING` | Direct MP4 video sharing via UGC Post container. |
| **Company Page Direct Publishing** | Organization Page | `REQUIRES APPROVAL` | Requires LinkedIn Community Management API approval (`w_organization_social`). |
| **Organization Follower Statistics** | Organization Page | `REQUIRES APPROVAL` | Requires Community Management API (`r_organization_social`) for live follower growth curves. |
| **Personal 1st-Degree Connection Scraping**| Member Profile | `NOT SUPPORTED` | Enforces LinkedIn Anti-Scraping Policy: Private connection lists cannot be exported via unofficial scraping. |
| **Automated Endorsement / InMail Spam** | Member Profile | `NOT SUPPORTED` | Strictly prohibited. Only legitimate AI-optimized content creation and scheduled publishing are supported. |
| **Scheduled Content Calendar Queue** | Member & Org | `WORKING` | Full approval workflow: Draft ➔ AI Optimized ➔ Review ➔ Approved ➔ Scheduled ➔ Published. |
| **Emergency Automation Kill-Switch** | Member & Org | `WORKING` | 1-click global kill switch immediately halts all automated LinkedIn workers and scheduled queues. |
| **Token Background Refresh** | Member & Org | `WORKING` | 60-day token extension lifecycle with automatic refresh before expiration. |

---

## 2. Status Legend

* **`WORKING`:** Fully functional and tested in the codebase. Operates immediately with standard LinkedIn developer credentials.
* **`REQUIRES APPROVAL`:** Fully implemented in the adapter. Access for public enterprise organizations requires LinkedIn Community Management API partner approval.
* **`NOT SUPPORTED`:** Deliberately excluded to ensure 100% compliance with LinkedIn Developer Policies (e.g. private connection scraping, bot endorsement, automated InMail spam).

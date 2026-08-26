# LINKEDIN ORGANIZATION ACCESS APPLICATION PACKAGE — GROWTHPILOT AI

**Date**: August 26, 2026  
**Company**: GrowthPilot AI  
**Product URL**: [https://growthpilot-ai-two.vercel.app](https://growthpilot-ai-two.vercel.app)  
**Privacy Policy**: [https://growthpilot-ai-two.vercel.app/privacy](https://growthpilot-ai-two.vercel.app/privacy)  
**Terms of Service**: [https://growthpilot-ai-two.vercel.app/terms](https://growthpilot-ai-two.vercel.app/terms)  
**Data Deletion**: [https://growthpilot-ai-two.vercel.app/data-deletion](https://growthpilot-ai-two.vercel.app/data-deletion)  
**Support**: [https://growthpilot-ai-two.vercel.app/support](https://growthpilot-ai-two.vercel.app/support)  
**OAuth Redirect URI**: `https://growthpilot-ai-two.vercel.app/api/auth/oauth/linkedin/callback`

---

## SECTION A — SEPARATION OF SELF-SERVE vs. ORGANIZATION API FEATURES

### Currently Live — No LinkedIn Approval Required

| Feature | Scope | Status |
|---|---|---|
| LinkedIn OpenID Connect login | `openid`, `profile`, `email` | ✅ SELF-SERVE — No review required |
| Member profile display | `openid`, `profile` | ✅ SELF-SERVE |
| Publish member UGC posts (individual) | `w_member_social` | ✅ SELF-SERVE — Standard access |
| Member email display | `email` | ✅ SELF-SERVE |

### Requires LinkedIn Community Management API Approval

| Feature | Scope | Status |
|---|---|---|
| List administered company pages | `r_organization_social` | ⏳ PENDING — Community Management API |
| Publish to company/organization pages | `w_organization_social` | ⏳ PENDING — Community Management API |
| Read company page analytics | `r_organization_social` | ⏳ PENDING — Community Management API |
| Manage organization admin settings | `rw_organization_admin` | ⏳ PENDING — Marketing Developer Platform |

---

## SECTION B — USE CASE DESCRIPTION (FOR LINKEDIN PORTAL APPLICATION)

### Application Title
**GrowthPilot AI — B2B Real Estate & Marketing Agency Content Publishing Platform**

### Product Description
GrowthPilot AI is a content management and AI publishing platform specifically designed for real estate professionals, real estate brokerages, and marketing agencies managing corporate LinkedIn company pages on behalf of their clients.

Our users include:
1. **Real Estate Brokerages**: A managing broker publishes property listing announcements, market reports, and recruitment posts to their brokerage's LinkedIn Company Page.
2. **Marketing Agencies**: An agency content manager publishes approved corporate content on behalf of their B2B enterprise clients.
3. **Solo Agents / Consultants**: An individual publishes both personal posts (`w_member_social`) and company page posts (`w_organization_social`) from a unified dashboard.

### Why Organization Access is Needed
Without `w_organization_social`, users managing a real estate brokerage's LinkedIn Company Page must manually copy-paste approved content from GrowthPilot into the LinkedIn interface. The requested API access enables the same structured approve-then-publish workflow available for personal posts to also work for company pages.

---

## SECTION C — ORGANIZATION ADMIN FLOW

1. User connects LinkedIn account via OpenID Connect OAuth.
2. After connection, GrowthPilot calls `GET https://api.linkedin.com/v2/organizationAcls?q=roleAssignee` to fetch pages the user administers.
3. User selects which Company Page to connect.
4. User creates or generates content in the GrowthPilot Content Studio.
5. Content goes through the mandatory approval workflow (draft → approved).
6. Approved content is published via `POST https://api.linkedin.com/v2/ugcPosts` using an organization URN (`urn:li:organization:{id}`).

---

## SECTION D — DATA HANDLING

| Data Type | Usage | Retention |
|---|---|---|
| LinkedIn `access_token` | Server-side only, AES-256-GCM encrypted, stored in Neon PostgreSQL | Until user disconnects or expires |
| `refresh_token` | Server-side only, encrypted, used for silent renewal | Until user disconnects or expires |
| Organization URN | Stored to identify which Company Page to publish to | Until user disconnects |
| UGC post content | Authored by user in GrowthPilot, transmitted to LinkedIn on publish | Not retained by GrowthPilot after publish |
| Analytics data | Fetched on-demand and rendered in dashboard, not persisted externally | Not stored externally |

---

## SECTION E — PRIVACY, TERMS, AND DELETION

- **Privacy Policy**: `https://growthpilot-ai-two.vercel.app/privacy`
- **Terms of Service**: `https://growthpilot-ai-two.vercel.app/terms`
- **Data Deletion Requests**: `https://growthpilot-ai-two.vercel.app/data-deletion` — Submitting a request permanently deletes all LinkedIn tokens and associated data within 48 hours.
- **Disconnect anytime**: User clicks "Disconnect LinkedIn" on `/social-accounts` and all tokens are immediately and permanently deleted.

---

## SECTION F — REVIEWER INSTRUCTIONS

1. Register or log in at `https://growthpilot-ai-two.vercel.app`.
2. Navigate to `/social-accounts`.
3. Click "Connect LinkedIn".
4. Complete LinkedIn OAuth — the basic `openid`, `profile`, `email`, `w_member_social` scopes will complete immediately.
5. Observe LinkedIn profile identity displayed on dashboard.
6. Navigate to `/content-studio`.
7. Draft a LinkedIn post.
8. Approve the post.
9. Publish to the connected member profile.
10. Confirm `ugcPost_id` returned in the success confirmation.
11. Click "Disconnect LinkedIn" to confirm token deletion.

*Note*: Step 9–10 for Company Page publishing will require `w_organization_social` approval. Until approved, GrowthPilot gracefully shows a "LinkedIn Company Page Access Pending Approval" notice rather than failing.

# PRIVACY COMPLIANCE & DATA PROTECTION REPORT — GROWTHPILOT AI

**Date**: August 26, 2026  
**Status**: Fully Compliant with Meta Platform Terms, TikTok Developer Terms, LinkedIn API Policy & GDPR/CCPA

---

## 1. Compliance Architecture Overview
GrowthPilot AI enforces strict zero-trust data minimization, tenant isolation, and cryptographic security across all user data, social access tokens, and generated content.

---

## 2. Personal & Social Data Categories

| Data Category | Purpose | Storage & Security | Retention Policy |
|---|---|---|---|
| **User Account Credentials** | Authentication & Billing | Salted PBKDF2 (10,000 rounds) password hashes | Retained while account is active |
| **OAuth Access Tokens** | Social Media API Publishing & Insights | AES-256-GCM encrypted vault (16-byte salt, 16-byte IV, 16-byte auth tag) | Purged immediately on Disconnect or Deletion Request |
| **Social Profile Analytics** | Dashboard Growth Metrics | Ephemeral caching; refreshed on-demand | Overwritten during live data sync |
| **AI-Generated Drafts** | Content Studio Posts | PostgreSQL text records associated with Tenant ID | Editable / deletable by user |
| **Lead CRM Records** | Real Estate Inquiries | Tenant-isolated database records | Full CRUD deletion supported |
| **Billing & Transactions** | Subscription Management | Handled by Paddle as Merchant of Record (Zero card data stored) | Legal tax record compliance |

---

## 3. Production Compliance Endpoints
- **Privacy Policy**: `https://growthpilot-ai-two.vercel.app/privacy`
- **Terms of Service**: `https://growthpilot-ai-two.vercel.app/terms`
- **Data Deletion Request Page**: `https://growthpilot-ai-two.vercel.app/data-deletion`
- **Support & Inquiries**: `https://growthpilot-ai-two.vercel.app/support`

---

## 4. User Rights & Deletion Protocol
1. **Self-Service Token Revocation**: Users can disconnect any connected social network at any time from `/social-accounts`, triggering instant deletion of the encrypted OAuth access token from the database.
2. **Formal Account & Data Deletion**: Users can submit deletion requests via `/data-deletion` or email `privacy@growthpilot.ai`. All personal records are purged within 48 hours.

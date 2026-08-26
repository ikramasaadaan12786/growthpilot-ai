# BETA FEEDBACK OPERATIONS GUIDE — GROWTHPILOT AI

**Date**: August 26, 2026  
**Support URL**: [https://growthpilot-ai-two.vercel.app/support](https://growthpilot-ai-two.vercel.app/support)  
**Contact URL**: [https://growthpilot-ai-two.vercel.app/contact](https://growthpilot-ai-two.vercel.app/contact)

---

## 1. Feedback Form Fields

The support form at `/support` now collects the following structured fields:

| Field | Type | Required | Purpose |
|---|---|---|---|
| **Name** | Text input | Optional | For personalized support response |
| **Email** | Email input | ✅ Required | For follow-up communication |
| **Category** | Dropdown | ✅ Required | Routes ticket to correct engineering queue |
| **Platform** | Dropdown | Recommended | Identifies reproduction environment |
| **Device / Browser** | Text input | Recommended | Narrows platform-specific bugs |
| **App Version** | Text input | Recommended | Pre-filled with `1.0.0-beta.1` |
| **Steps to Reproduce** | Textarea | Recommended | Numbered reproduction steps |
| **Expected Result** | Textarea | Recommended | What the user expected to happen |
| **Actual Result** | Textarea | Recommended | What actually happened (the bug) |
| **Additional Details** | Textarea | Optional | Screenshots description, extra context |

> **Security**: The form explicitly instructs users NOT to include passwords, API keys, session tokens, or payment card numbers.

---

## 2. Category Routing

| Category | Assigned Queue | Target Response |
|---|---|---|
| **Bug Report (Public Beta)** | Engineering / Bug Triage | < 12 hours |
| **Feature Request** | Product Roadmap Backlog | < 48 hours |
| **Billing / Subscription / Trial Issue** | Billing Support + Paddle Portal | < 4 hours |
| **Account / Login Issue** | Engineering / Auth | < 12 hours |
| **Social Account Connection Issue** | Engineering / OAuth | < 12 hours |
| **Technical Support / Other** | Support Team | < 24 hours |
| **Data Deletion / Account Closure** | Compliance + Engineering | < 48 hours |

---

## 3. Ticket Generation

On form submission, a unique ticket reference ID is generated in the format `GP-{timestamp-base36}` (example: `GP-1N0K3A7Z`). Users are instructed to retain this for follow-up communications.

---

## 4. What NOT to Include in Reports

- Passwords or authentication tokens
- API keys or webhook secrets
- Payment card numbers or bank details
- Third-party OAuth access tokens
- Other users' personal data

---

## 5. Additional Support Channels

| Channel | Details |
|---|---|
| **Email** | support@growthpilot.ai |
| **Paddle Billing Issues** | https://help.paddle.com (Paddle is the Merchant of Record) |
| **Data Deletion Requests** | https://growthpilot-ai-two.vercel.app/data-deletion |

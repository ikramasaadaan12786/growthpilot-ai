# PUBLIC BETA TESTER GUIDE — GROWTHPILOT AI

> **⚠️ BETA NOTICE**: This is a Public Beta release. Some features may be incomplete or subject to change. Real estate data shown in Demo Mode is for illustration only.
> 
> **⚠️ SANDBOX BILLING**: Paddle billing is in Sandbox (Test) Mode. No real credit cards will be charged during beta.
> 
> **⚠️ PLATFORM APPROVALS PENDING**: Instagram, Facebook, and TikTok publishing requires external platform approval. LinkedIn member posting is available now.

---

**Version**: `1.0.0-beta.1`  
**Production URL**: [https://growthpilot-ai-two.vercel.app](https://growthpilot-ai-two.vercel.app)  
**Support**: [https://growthpilot-ai-two.vercel.app/support](https://growthpilot-ai-two.vercel.app/support)  
**Bug Reports**: [https://growthpilot-ai-two.vercel.app/support](https://growthpilot-ai-two.vercel.app/support)

---

## 1. HOW TO REGISTER

1. Open `https://growthpilot-ai-two.vercel.app/register`.
2. Enter your **name**, **email**, and a **secure password** (min. 8 characters).
3. Click **Create Account**.
4. You are automatically logged in and redirected to the onboarding flow.

---

## 2. HOW TO LOG IN

1. Open `https://growthpilot-ai-two.vercel.app/login`.
2. Enter your registered email and password.
3. Click **Sign In**.
4. You will be redirected to the main dashboard.

**Forgot your password?** Click "Forgot Password" on the login page and follow the reset email instructions.

---

## 3. HOW TO CHOOSE A PLAN

> **BETA**: All plans use Paddle Sandbox billing. No real money is charged.

1. After registering, you will see the onboarding plan selection at `/onboarding`.
2. Choose your plan:
   - **STARTER** — $19/month + 7-Day Free Trial
   - **PRO** — $49/month + 7-Day Free Trial
   - **AGENCY** — $99/month + 7-Day Free Trial
   - **BUSINESS** — $199/month + 7-Day Free Trial
3. Click **Start 7-Day Free Trial**.
4. The Paddle Sandbox checkout overlay opens.
5. Use **Paddle Sandbox test card details** (see below) — do NOT use a real credit card.

### Paddle Sandbox Test Card Numbers
| Card | Number | Expiry | CVV |
|---|---|---|---|
| Visa (success) | `4111 1111 1111 1111` | Any future date | Any 3 digits |
| Mastercard (success) | `5555 5555 5555 4444` | Any future date | Any 3 digits |
| Decline (to test failure) | `4000 0000 0000 0002` | Any future date | Any 3 digits |

6. After checkout, you will be redirected to `/settings?billing=success&plan=PRO` (or your selected plan).
7. Your dashboard will reflect your active plan entitlements.

---

## 4. HOW SANDBOX BILLING WORKS

- **$0.00 due today** during the 7-day free trial.
- After 7 days (in sandbox): Paddle would normally charge your card — but in Sandbox mode, all charges are simulated.
- To cancel anytime: Navigate to `/settings` → click **Cancel Subscription** → cancellation is scheduled for the end of the billing period.
- You can upgrade, downgrade, or cancel at any time.

---

## 5. HOW TO USE DEMO MODE

Demo Mode shows you GrowthPilot AI with realistic sample data without requiring any real social media connections.

1. After logging in, look for the **DEMO MODE** toggle in the header.
2. Toggle it ON to see:
   - Pre-populated social analytics benchmarks
   - Sample AI-generated content in Content Studio
   - Simulated CRM leads
   - Sample automation logs
3. Toggle it OFF to use your real connected accounts.

Demo Mode is safe — it never writes to real social platforms.

---

## 6. HOW TO USE LIVE MODE

Live Mode uses your real social media accounts:

1. Navigate to `/social-accounts`.
2. Click **Connect** next to the platform you want to link.
3. Complete the platform's OAuth dialog.
4. Return to the dashboard — your real data is now loaded.

> **BETA LIMITATION**: Instagram, Facebook, and TikTok publishing require external platform app review approvals that are currently pending. LinkedIn member profile posting is available immediately.

---

## 7. HOW TO CONNECT SOCIAL ACCOUNTS

### LinkedIn (Available Now)
1. `/social-accounts` → **Connect LinkedIn** → OAuth → Authorize.
2. Your LinkedIn member profile is now connected.
3. You can draft and publish posts to your personal profile from Content Studio.

### Instagram / Facebook (Beta — Pending Meta Review)
1. `/social-accounts` → **Connect Instagram** or **Connect Facebook**.
2. Complete Meta OAuth.
3. During beta, publishing requires the GrowthPilot Meta app to be approved.
4. Analytics and account identity features work now.

### TikTok (Beta — Pending TikTok Review)
1. `/social-accounts` → **Connect TikTok** → OAuth → Authorize.
2. During beta, Creator Inbox uploads work in TikTok sandbox mode.
3. Full public publishing requires TikTok Content Posting API approval.

---

## 8. HOW TO USE CONTENT STUDIO

1. Navigate to `/content-studio`.
2. Click **Generate AI Content**.
3. Fill in the prompt details (property address, tone, platform, type of post).
4. Click **Generate** — GrowthPilot AI creates a caption, hashtags, and image suggestions.
5. Edit the content as needed.
6. Click **Approve** to mark content ready for publishing.
7. Click **Publish** to dispatch to connected platforms.

All posts require the Approve step. Unapproved drafts cannot be published.

---

## 9. HOW TO USE REAL ESTATE MODE

1. Navigate to `/content-studio` or `/ideas`.
2. Toggle **Real Estate Mode** (PRO plan or higher required).
3. Enter property listing details: address, price, bedrooms, bathrooms, features.
4. Select post type: Property Showcase, Open House, Market Report, etc.
5. Generate AI content tailored specifically for real estate audiences.

---

## 10. HOW TO USE THE CRM

1. Navigate to `/leads`.
2. Click **Add Lead** to manually add a real estate prospect.
3. Track: Contact details, status (New / Contacted / Qualified / Closed), last interaction, notes.
4. Export leads from the CRM table using the Export button.

---

## 11. HOW TO REPORT BUGS

Navigate to [https://growthpilot-ai-two.vercel.app/support](https://growthpilot-ai-two.vercel.app/support).

Provide the following information for the fastest resolution:

| Field | Example |
|---|---|
| **Category** | Bug Report / Feature Request / Billing Issue / Social Connection Issue |
| **Platform** | Web / Windows Desktop / Android |
| **Device / Browser** | Chrome 127, Windows 11 |
| **App Version** | 1.0.0-beta.1 |
| **Steps to Reproduce** | 1. Click X. 2. See Y. |
| **Expected Result** | The page loads successfully. |
| **Actual Result** | A blank white page appears. |

> **DO NOT include your password, API keys, or session tokens in bug reports.**

---

## 12. KNOWN BETA LIMITATIONS

| Limitation | Status |
|---|---|
| Instagram / Facebook publishing | Pending Meta App Review |
| TikTok public feed publishing | Pending TikTok App Review |
| LinkedIn Company Page posting | Pending LinkedIn Community API approval |
| Android Play Store release | Debug APK available; signed release pending |
| Windows code signing | Unsigned installer; SmartScreen warning expected |
| AI content requires OpenAI API key | Configure in environment or use Demo Mode |
| Real credit card billing | Not enabled; Paddle Sandbox only during beta |

---

## 13. HOW TO DELETE YOUR ACCOUNT & DATA

1. Navigate to [https://growthpilot-ai-two.vercel.app/data-deletion](https://growthpilot-ai-two.vercel.app/data-deletion).
2. Complete the deletion request form.
3. Your account, all social access tokens, all content, and all CRM data will be permanently deleted within **48 hours**.

Alternatively, email `support@growthpilot.ai` with the subject "Account Deletion Request".

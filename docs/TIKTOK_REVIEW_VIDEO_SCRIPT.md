# GrowthPilot AI — TikTok App Review Demo Video Recording Script (60–90 Seconds)

---

> [!IMPORTANT]
> **Status:** Script & Recording Sequence Created.  
> **Action Required by Developer:** Follow the step-by-step recording plan below using any screen recorder (e.g. OBS, Loom, or Windows Game Bar `Win + Alt + R`) to capture your screen on `https://growthpilot-ai-two.vercel.app`. Upload the resulting `.mp4` / YouTube unlisted link to the TikTok Developer Portal under **Demo Video**.

---

## 🎬 Recommended 60-Second Recording Walkthrough (Using Dedicated Review Hub)

> [!TIP]
> Use the dedicated live testing hub at **`https://growthpilot-ai-two.vercel.app/tiktok-review-demo`** for the easiest single-page demonstration covering all review criteria in under 60 seconds!

| Time | Action on Screen | On-Screen Caption / Visual Focus |
| :--- | :--- | :--- |
| **0:00 – 0:10** | Open browser to `https://growthpilot-ai-two.vercel.app/tiktok-review-demo`. | *GrowthPilot AI — TikTok Developer App Review Interactive Hub* |
| **0:10 – 0:25** | Under Step 1, click **Connect TikTok via Official OAuth 2.0 PKCE**. | *Initiating OAuth 2.0 PKCE Handshake (user.info.basic, video.upload)* |
| **0:25 – 0:35** | Complete authorization on the official TikTok dialog. Redirects back to `/tiktok-review-demo`. | *Authenticating test creator via official TikTok consent screen* |
| **0:35 – 0:45** | Highlight the verified TikTok creator profile card displaying username, avatar, and AES-256-GCM vault security status. | *Retrieving user profile and identity via Login Kit (user.info.basic)* |
| **0:45 – 0:55** | Under Step 2, select a demo video reel and click **Initiate Video Upload to TikTok (Creator Inbox Draft)**. Show real-time API logs and Publish ID success confirmation. | *Transmitting video draft payload to TikTok Content Posting API (video.upload)* |
| **0:55 – 1:00** | Click **Disconnect** to demonstrate instant token purge and revocation. | *Instant token purging and session revocation* |

---

## 🎬 Alternative Multi-Page Walkthrough (Social Accounts + Content Studio)

| Time | Action on Screen | On-Screen Caption / Visual Focus |
| :--- | :--- | :--- |
| **0:00 – 0:10** | Open browser to `https://growthpilot-ai-two.vercel.app/social-accounts`. Ensure Live Mode is selected. | *GrowthPilot AI — Multi-Platform Social Media Growth Platform* |
| **0:10 – 0:25** | Locate the **TikTok for Business & Creators** card. Click **Connect TikTok**. Show modal with requested scopes (`user.info.basic`, `video.upload`). Click **Authorize via TikTok**. | *Initiating official TikTok OAuth 2.0 PKCE Authorization Handshake* |
| **0:25 – 0:40** | Complete authorization on official TikTok dialog (`tiktok.com/v2/auth/authorize`). | *Reviewing and approving requested scopes on official TikTok consent dialog* |
| **0:40 – 0:55** | Redirect back to GrowthPilot AI. TikTok card shows **🟢 CONNECTED** with verified handle and profile photo. | *Account connected successfully. AES-256-GCM encrypted vault storage.* |
| **0:55 – 1:15** | Click **Content Studio** (`/content-studio`), select **TikTok 30s Script / Video**, and click **Publish to TikTok**. Show publish confirmation. | *Drafting and publishing video content via TikTok Content Posting API v2* |
| **1:15 – 1:25** | Return to **Social Accounts** (`/social-accounts`) and click **Disconnect** on the TikTok card. | *Instant token purging and worker cancellation on disconnect* |

---

## 🎙️ Optional Voiceover / On-Screen Text Summary (No Voice Needed)

If recording without a microphone, add simple text captions or let the clear UI actions speak for themselves:

1. **Caption 1 (0:05):** "Connecting TikTok to GrowthPilot AI using Official OAuth 2.0 PKCE"
2. **Caption 2 (0:30):** "Authorizing user.info.basic and video.upload permissions"
3. **Caption 3 (0:45):** "TikTok account verified and connected in Live Mode"
4. **Caption 4 (1:05):** "Publishing user-approved short-form video via TikTok Content Posting API"
5. **Caption 5 (1:20):** "User can revoke access or disconnect instantly at any time"

---

## 📋 Pre-Recording Checklist
- [ ] Ensure `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET` are configured in Vercel Environment Variables.
- [ ] Browser window sized to standard 1080p (1920x1080) for crisp text readability.
- [ ] Close extraneous tabs and notifications before recording.

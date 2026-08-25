# GrowthPilot AI — TikTok App Review Demo Video Recording Script (60–90 Seconds)

---

> [!IMPORTANT]
> **Status:** Script & Recording Sequence Created.  
> **Action Required by Developer:** Follow the step-by-step recording plan below using any screen recorder (e.g. OBS, Loom, or Windows Game Bar `Win + Alt + R`) to capture your screen on `https://growthpilot-ai-two.vercel.app`. Upload the resulting `.mp4` / YouTube unlisted link to the TikTok Developer Portal under **Demo Video**.

---

## 🎬 60–90 Second Screen Recording Walkthrough

| Time | Action on Screen | On-Screen Caption / Visual Focus |
| :--- | :--- | :--- |
| **0:00 – 0:10** | Open browser to `https://growthpilot-ai-two.vercel.app/social-accounts`. Ensure Live Mode is selected. | *GrowthPilot AI — Multi-Platform Social Media Growth Platform* |
| **0:10 – 0:25** | Locate the **TikTok for Business & Creators** card. Click **Connect TikTok**. Show the modal showing requested permissions (`user.info.basic`, `video.upload`). Click **Authorize via TikTok**. | *Initiating official TikTok OAuth 2.0 PKCE Authorization Handshake* |
| **0:25 – 0:40** | The browser redirects to TikTok's official login/consent page (`tiktok.com/v2/auth/authorize`). Log in and click **Authorize**. | *Reviewing and approving requested scopes on official TikTok consent dialog* |
| **0:40 – 0:55** | Browser redirects back to GrowthPilot AI with success banner. TikTok card now displays **🟢 CONNECTED** with verified TikTok handle and profile picture. | *Account connected successfully. AES-256-GCM encrypted vault storage.* |
| **0:55 – 1:15** | Click **Content Studio** in the left sidebar (`/content-studio`). Select the **TikTok 30s Script / Video** tab. Show the AI script and click **Publish to TikTok**. Show publish confirmation. | *Drafting and publishing video content via TikTok Content Posting API v2* |
| **1:15 – 1:25** | Return to **Social Accounts** (`/social-accounts`) and click **Disconnect** on the TikTok card. Show instant disconnection and token purge. | *Instant token purging and worker cancellation on disconnect* |

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

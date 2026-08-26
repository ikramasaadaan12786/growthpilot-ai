# META APP REVIEW — SCREENCAST SCRIPT
## GrowthPilot AI — Reviewer Video Recording Guide

**Target Duration**: 3–5 minutes per permission group  
**Tools Needed**: Screen recorder (OBS / Loom), microphone (optional narration), Chrome browser

---

## PRE-RECORDING CHECKLIST

- [ ] Logged in as a Meta Test User with Facebook Page + linked Instagram Professional Account
- [ ] Opened `https://growthpilot-ai-two.vercel.app/meta-review-demo`
- [ ] Meta App in Development Mode (NOT Live — reviewer can use test users in Dev mode)
- [ ] Screen recording started, microphone ready

---

## SCENE 1 — App Overview (0:00–0:30)

**Screen**: `https://growthpilot-ai-two.vercel.app/meta-review-demo`  
**Action**: Scroll through the Meta Review Demo Hub page  
**Expected Result**: Hub shows 8 steps, all clearly labeled  
**Narration (optional)**: *"This is GrowthPilot AI's interactive Meta reviewer demonstration hub. It walks through every permission in sequence."*  
**Permission Demonstrated**: App identity, review hub availability

---

## SCENE 2 — `instagram_basic` + `pages_show_list` OAuth (0:30–1:30)

**Screen**: Demo Hub → Step 1  
**Action**: Click "Connect Instagram & Facebook" button  
**Expected Result**: Meta OAuth dialog opens in a new window showing GrowthPilot AI app name and requested permissions  
**Action**: Authorize with test account  
**Expected Result**: Redirect to callback → Dashboard shows Instagram username, profile picture, follower count AND Facebook page name  
**Narration**: *"The user authorizes once and GrowthPilot captures their Instagram profile identity and their administered Facebook Pages."*  
**Permission Demonstrated**: `instagram_basic`, `pages_show_list`

---

## SCENE 3 — `instagram_content_publish` + `pages_manage_posts` (1:30–2:45)

**Screen**: Demo Hub → Step 3: Draft Content  
**Action**: Click "Generate AI Post Draft"  
**Expected Result**: AI-generated caption and image prompt appear in draft editor  
**Action**: Review content in the Approval Screen — do NOT skip this step  
**Expected Result**: Post remains in DRAFT state, "Publish" button disabled  
**Action**: Click "Approve Post"  
**Expected Result**: Post status changes to APPROVED, Publish button becomes active  
**Action**: Click "Publish to Instagram" and "Publish to Facebook"  
**Expected Result**: Success modal shows `instagram_media_id` and Facebook `post_id`. No post is published without the explicit Approve step.  
**Narration**: *"Content cannot be published without explicit user approval. This demonstrates GrowthPilot's human-in-the-loop publishing workflow."*  
**Permission Demonstrated**: `instagram_content_publish`, `pages_manage_posts`

---

## SCENE 4 — `instagram_manage_insights` + `pages_read_engagement` (2:45–3:45)

**Screen**: Analytics Dashboard (`/analytics`)  
**Action**: Click "Instagram" platform tab  
**Expected Result**: Impressions, reach, engagement, and follower growth charts render with real data  
**Action**: Click "Facebook" platform tab  
**Expected Result**: Page insights (fan count, post reach) render  
**Narration**: *"GrowthPilot reads analytics to show users how their content performs — no data is modified or exported to third parties."*  
**Permission Demonstrated**: `instagram_manage_insights`, `pages_read_engagement`

---

## SCENE 5 — Account Disconnection & Data Deletion (3:45–4:15)

**Screen**: Demo Hub → Step 6: Disconnect  
**Action**: Click "Disconnect Instagram" and "Disconnect Facebook"  
**Expected Result**: Success message confirms token has been deleted from GrowthPilot's database  
**Narration**: *"Users can disconnect at any time. Tokens are immediately deleted from our encrypted database."*  
**Permission Demonstrated**: User control, data deletion compliance

---

## POST-RECORDING CHECKLIST

- [ ] Video clearly shows the app name "GrowthPilot AI" in the Meta OAuth dialog
- [ ] Video shows the Approval step BEFORE publishing
- [ ] Video shows analytics loading with real data
- [ ] Video shows successful disconnect
- [ ] No passwords, API keys, or session tokens visible in recording
- [ ] Total duration: under 5 minutes

# PRODUCTION OAUTH & REDIRECT ARCHITECTURE — GROWTHPILOT AI

**Date**: August 26, 2026  
**Architecture**: Unified HTTPS Backend Callback Routing with Native Dynamic Client Bridging

---

## 1. Multi-Platform Callback Overview

To guarantee seamless operation across Web, Windows Native Desktop, and Android Mobile without relying on fragile `localhost:3000` port bindings in production, GrowthPilot AI implements a centralized server-side callback architecture.

```
[Client (Web / Desktop / Mobile)] 
          │
          ▼ Initiates OAuth
[https://growthpilot-ai-two.vercel.app/api/auth/oauth/{platform}/authorize]
          │
          ▼ Redirects with State Nonce + PKCE Challenge
[External Platform OAuth Dialog (Meta / TikTok / LinkedIn)]
          │
          ▼ Returns with Code & State
[https://growthpilot-ai-two.vercel.app/api/auth/oauth/{platform}/callback]
          │
          ├─► Server-Side Token Exchange (POST with Secret)
          ├─► AES-256-GCM Encryption Vault Storage in Neon PostgreSQL
          └─► Redirects Client with Secure Session Cookie to /social-accounts
```

---

## 2. Environment Routing Matrix

| Environment | Authorize Origin | Callback URI | Client Context Resolution |
|---|---|---|---|
| **Vercel Production** | `https://growthpilot-ai-two.vercel.app` | `https://growthpilot-ai-two.vercel.app/api/auth/oauth/{platform}/callback` | Native browser cookies |
| **Windows Desktop** | Dynamic Private Port (e.g. `localhost:49152`) | Routes to `https://growthpilot-ai-two.vercel.app/api/...` | Custom Protocol / IPC Deep Link Bridge |
| **Android Mobile** | `https://growthpilot-ai-two.vercel.app` | Routes to `https://growthpilot-ai-two.vercel.app/api/...` | Custom Chrome Tabs / Deep Link Redirect |
| **Local Development** | `http://localhost:3000` | `http://localhost:3000/api/auth/oauth/{platform}/callback` | Local cookies |

---

## 3. Security Properties
1. **Server-Only Secret Handling**: `META_CLIENT_SECRET`, `TIKTOK_CLIENT_SECRET`, and `LINKEDIN_CLIENT_SECRET` are strictly resolved within serverless route handlers and are never bundled into desktop installers or mobile APKs.
2. **RFC 7636 PKCE S256**: Enforced on TikTok and mobile endpoints to prevent authorization code interception attacks.
3. **Anti-CSRF Cryptographic State**: Every OAuth initiation generates an HMAC-bound state token containing timestamp, platform tag, client type, and a random cryptographic nonce.

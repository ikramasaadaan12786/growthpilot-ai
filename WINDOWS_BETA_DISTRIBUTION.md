# WINDOWS BETA DISTRIBUTION GUIDE — GROWTHPILOT AI

**Product Name**: GrowthPilot AI  
**Version**: `1.0.0-beta.1`  
**Installer File**: `GrowthPilot AI Setup 1.0.0.exe`  
**Framework**: Electron 31 + Next.js 14 Standalone

---

## 1. INSTALLATION STEPS

1. **Download** the installer: `GrowthPilot AI Setup 1.0.0.exe`
2. **Double-click** the installer file to start installation.
3. **Windows SmartScreen Warning** may appear (see Section 2 below).
4. The installer runs a standard NSIS wizard:
   - Accept the license agreement.
   - Choose an installation directory (default: `C:\Program Files\GrowthPilot AI\`).
   - Click **Install**.
5. A desktop shortcut and Start Menu entry will be created.
6. The app will launch automatically after installation.

---

## 2. WINDOWS SMARTSCREEN WARNING — EXPLANATION & RESOLUTION

When running the unsigned beta installer, Windows Defender SmartScreen may display:

> "Windows protected your PC"  
> "The app isn't recognized by Windows"

**This is expected behavior for unsigned beta software.** GrowthPilot AI is safe. A commercial EV code-signing certificate is not used for the public beta.

**To proceed**:
1. Click **"More info"** in the SmartScreen dialog.
2. Click **"Run anyway"**.
3. Installation proceeds normally.

Once GrowthPilot AI is commercially released with a signed installer, this warning will no longer appear.

---

## 3. OFFLINE DEMO MODE

The Windows desktop app includes **full offline Demo Mode**:

- No internet connection required for Demo Mode.
- All AI content generation uses local heuristic benchmarks.
- All social analytics use pre-loaded sample data.
- CRM and Calendar work offline.

To enable: Open the app → Toggle **DEMO MODE ON** in the header.

---

## 4. ONLINE LIVE MODE REQUIREMENTS

For Live Mode (real social accounts, real billing):

- **Internet connection**: Required (HTTPS to `growthpilot-ai-two.vercel.app`).
- **Social accounts**: Connect from the Social Accounts page inside the app.
- **Paddle billing**: Requires internet connection to process checkout.

---

## 5. UPDATE INSTRUCTIONS (BETA)

During beta, updates are distributed manually:

1. Download the latest `GrowthPilot AI Setup X.X.X.exe` when announced.
2. Run the new installer over the existing installation — it will update automatically.
3. Your account data and preferences are preserved (stored server-side in Neon PostgreSQL).

Auto-update (Squirrel) will be enabled in the production release.

---

## 6. UNINSTALL INSTRUCTIONS

1. Open **Windows Settings** → **Apps** → **Installed Apps**.
2. Search for **GrowthPilot AI**.
3. Click the three dots → **Uninstall**.
4. Follow the uninstall wizard.

Or run: `C:\Program Files\GrowthPilot AI\Uninstall GrowthPilot AI.exe`

---

## 7. SUPPORT

- **In-App**: Click **Help** in the app menu.
- **Web**: [https://growthpilot-ai-two.vercel.app/support](https://growthpilot-ai-two.vercel.app/support)
- **Bug Reports**: [https://growthpilot-ai-two.vercel.app/support](https://growthpilot-ai-two.vercel.app/support)

---

## 8. KNOWN BETA LIMITATIONS — WINDOWS

| Item | Status |
|---|---|
| Code signing (EV certificate) | NOT INCLUDED in beta — SmartScreen warning expected |
| Auto-update (Squirrel) | NOT included in beta — manual update download required |
| Microsoft Store distribution | NOT yet submitted |
| Windows ARM64 build | NOT included in beta (x64 only) |

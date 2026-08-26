# WINDOWS DESKTOP RELEASE REPORT — GROWTHPILOT AI

**Application Name**: GrowthPilot AI  
**Executable / Product**: `GrowthPilot AI`  
**Version**: `1.0.0-beta.1`  
**App ID**: `com.growthpilot.desktop`  
**Framework**: Electron 31 + Next.js Standalone Runner

---

## 1. Release Artifacts

- **NSIS Installer**: `dist/GrowthPilot AI Setup 1.0.0.exe`
- **Standalone Unpacked Directory**: `dist/win-unpacked/GrowthPilot AI.exe`
- **Icon / Branding**: Configured with custom GrowthPilot logo (`build/icon.ico`)

---

## 2. Technical Architecture & Crash Prevention

1. **Dynamic Private Port Allocation**:
   - The desktop runtime queries an ephemeral open port (e.g. `localhost:49152`) using Node.js `net.createServer().listen(0)` on launch.
   - Eliminates port `3000` collisions with developer dev servers, Docker containers, or background instances.
2. **Single Instance Lock**:
   - `app.requestSingleInstanceLock()` prevents duplicate application windows from spawning.
3. **Offline Demo Mode Capability**:
   - Desktop application embeds local heuristic engine and mock benchmark database, allowing real estate agents to use Content Studio and Lead CRM offline without internet connectivity.
4. **SmartScreen Notice (Unsigned Release)**:
   - For beta testing without a commercial EV code-signing certificate, Windows SmartScreen will display an informational warning ("Unknown Publisher"). Users click *More Info → Run Anyway* during installation.

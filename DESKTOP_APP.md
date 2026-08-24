# GrowthPilot AI — Windows Desktop Application Guide

GrowthPilot AI is packaged as a standalone Windows 10/11 Desktop Application (`GrowthPilot AI.exe`).

---

## 1. Desktop Architecture

```
growthpilot-ai/
├── desktop/
│   ├── main.js        # Electron main process (Window lifecycle & server sync)
│   ├── preload.js     # Secure contextBridge IPC layer
│   └── loading.html   # Standalone splash & offline connection handler
├── dist/              # Generated Windows Executables and Installers
├── package.json       # Desktop build scripts & electron-builder config
```

---

## 2. Running in Desktop Development Mode
```bash
npm run desktop:dev
```
* Spawns Next.js on `localhost:3000`.
* Waits for server initialization.
* Opens the standalone dark-themed desktop application window (1366x868, frameless option, no browser tabs).

---

## 3. Building the Windows Installer (`GrowthPilot-AI-Setup.exe`)

To package a production-ready Windows NSIS Installer:
```bash
npm run desktop:installer
```
* **Output Folder:** `dist/`
* **Output File:** `dist/GrowthPilot-AI-Setup-1.0.0.exe`
* **Features:**
  * Custom installation directory selection.
  * Creates Start Menu and Desktop shortcuts.
  * Auto-launches GrowthPilot AI upon completion.

---

## 4. Building Portable Windows Executable (`GrowthPilot AI.exe`)
To package a zero-install single `.exe` file:
```bash
npm run desktop:portable
```
* **Output File:** `dist/GrowthPilot-AI-1.0.0.exe` (Runs directly from any folder or USB drive).

---

## 5. Windows SmartScreen & Code Signing Note
* For local development and testing, code-signing certificates ($300+/year) are **not required**.
* When running an unsigned development `.exe`, Windows SmartScreen may display:
  > *"Windows protected your PC — Unknown Publisher"*
* Click **More Info** ➔ **Run anyway** to launch your development build.

# GrowthPilot AI — Local Development & Setup Guide

This guide explains how to run **GrowthPilot AI** completely free on a fresh Windows 10/11 PC with **zero hosting costs**, **zero domain costs**, and **zero paid API requirements**.

---

## 1. Prerequisites
1. **Node.js**: `v18.17.0+` or `v20.x LTS` (Download from [nodejs.org](https://nodejs.org/)).
2. **Git** (optional, for cloning).
3. **Windows 10 / 11**.

---

## 2. Quick Start (1-Click Local Execution)

### Step 1: Install Dependencies
Open PowerShell or Command Prompt in the project folder and run:
```bash
npm install
```

### Step 2: Initialize Local Database (Free SQLite Fallback)
The project is pre-configured with a local SQLite database (`prisma/dev.db`):
```bash
npx prisma generate
npx prisma db push
```

### Step 3: Run the Desktop Application
To launch the native Windows Desktop Window with hot-reloading:
```bash
npm run desktop:dev
```
*This command automatically starts the local Next.js server on `http://localhost:3000` and opens the standalone desktop application window.*

To run in standard web browser mode only:
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

---

## 3. Free AI Development Engine (DEMO AI MODE)
* You **do not** need a paid OpenAI or Gemini API key.
* When `.env` does not contain a paid AI key, GrowthPilot AI automatically activates **DEMO AI MODE**.
* This utilizes our built-in multi-platform heuristic generation engine with full format adaptation (Reels, Articles, Carousels, TikToks) at **$0 cost**.
* Optional: You can connect local free open-source models using [Ollama](https://ollama.ai/) (`http://localhost:11434`).

---

## 4. Free Demo Mode vs. Live Social Data
* The header contains a prominent **Demo / Live** mode switch.
* **Demo Mode**: Allows you to test all analytics, growth calculations, CRM pipelines, and calendar workflows using realistic sample datasets without connecting real social media accounts.
* **Live Mode**: Interacts directly with official Meta, LinkedIn, and TikTok developer APIs via AES-256-GCM encrypted tokens.

---

## 5. Offline Capabilities
The following features work 100% offline without an active internet connection:
* Demo Dashboard & Multi-Platform Growth Engine
* AI Content Studio (using local DEMO AI engine)
* Content Calendar & 6-Stage Approval Pipeline
* Lead Center CRM & CSV Export
* System Settings & Application Diagnostics

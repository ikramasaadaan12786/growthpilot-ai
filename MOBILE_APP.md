# GrowthPilot AI — Android Mobile App Architecture Guide

GrowthPilot AI is designed with a responsive, cross-platform architecture that shares 100% of business logic, database models, and UI components across Desktop and Mobile.

---

## 1. Cross-Platform Mobile Strategy

We utilize **Capacitor** (Open Source by Ionic) to package the responsive Next.js application into a native Android APK:

* **Configuration File:** `capacitor.config.json`
* **App ID:** `com.growthpilot.ai`
* **App Name:** `GrowthPilot AI`
* **Target OS:** Android 10.0+ (API level 29+)

---

## 2. Steps to Build Android APK (Free & Open-Source)

### Prerequisites:
1. **Android Studio** (Free from [developer.android.com/studio](https://developer.android.com/studio)).
2. **Java JDK 17+**.

### Build Command Steps:
```bash
# 1. Install Capacitor CLI & Core
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor Android project
npx cap add android

# 3. Build Next.js static bundle
npm run build

# 4. Sync web assets to Android platform
npx cap sync android

# 5. Open project in Android Studio
npx cap open android
```

In Android Studio:
* Click **Build** ➔ **Build Bundle(s) / APK(s)** ➔ **Build APK(s)**.
* Output: `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 3. Mobile Features Supported
* Mobile Responsive Drawer Navigation.
* Touch-optimized Content Calendar.
* AI Content Studio with 1-tap copy & scheduling.
* Offline Demo Mode and CRM pipeline management.
* Shared database sync with desktop workstation via API routes.

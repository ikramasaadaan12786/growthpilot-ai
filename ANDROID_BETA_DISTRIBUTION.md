# ANDROID BETA DISTRIBUTION GUIDE — GROWTHPILOT AI

**Product Name**: GrowthPilot AI  
**Package ID**: `com.growthpilot.ai`  
**Version**: `1.0.0-beta.1` (Build Code: 1)  
**APK File**: `app-debug.apk` (Debug / Unsigned Beta)  
**Framework**: Capacitor 6 + Next.js Native Bridge

> **⚠️ BETA NOTICE**: This is a debug/unsigned APK for beta testing only. It is NOT a Google Play release build. Installation requires manually enabling "Install Unknown Apps" on your Android device.

---

## 1. ENABLE INSTALLATION OF UNKNOWN APPS

Before installing the APK, allow your Android device to install apps from unknown sources:

**Android 8.0+ (Oreo and later)**:
1. When you tap the APK to install, Android will automatically ask:
   > "Your phone is not allowed to install unknown apps from this source. Do you want to change this setting?"
2. Tap **Settings**.
3. Enable **"Allow from this source"** for your browser or file manager.
4. Press **Back** and try again.

**Android 7.0 and earlier**:
1. Open **Settings** → **Security**.
2. Enable **"Unknown Sources"**.
3. Confirm the warning.

---

## 2. INSTALL THE APK (SIDELOAD)

1. **Transfer** the `app-debug.apk` file to your Android device via:
   - USB cable → copy to Downloads folder
   - Google Drive or email → download on device
2. **Open** your device's file manager and navigate to the Downloads folder.
3. **Tap** `app-debug.apk`.
4. Android shows the app info screen. Tap **Install**.
5. Wait for installation to complete.
6. Tap **Open** to launch GrowthPilot AI.

---

## 3. USING THE APP AFTER INSTALLATION

- Open GrowthPilot AI from your app drawer.
- Register or log in with your GrowthPilot account.
- Demo Mode works offline.
- Live Mode requires internet connectivity.

---

## 4. UPDATE INSTRUCTIONS (BETA)

During beta, updates require manual APK replacement:

1. Download the new `app-debug.apk` version when announced.
2. Tap the new APK — Android will prompt to update/replace the existing app.
3. Tap **Install** to update.
4. Your account data is preserved (stored server-side).

---

## 5. UNINSTALL

1. Long-press the GrowthPilot AI icon.
2. Select **Uninstall**.
3. Confirm.

Or: **Settings** → **Apps** → **GrowthPilot AI** → **Uninstall**.

---

## 6. RELEASE APK / GOOGLE PLAY REQUIREMENTS

> ⚠️ **HUMAN ACTION REQUIRED** — The following steps require the project owner's action.

To publish on Google Play Store:

1. **Generate a Release Keystore**:
   ```bash
   keytool -genkey -v -keystore growthpilot-release.jks \
     -alias growthpilot -keyalg RSA -keysize 2048 -validity 10000
   ```
   Store the keystore file and passwords in a secure location — do NOT commit to Git.

2. **Sign the Release APK**:
   - In Android Studio: Build → Generate Signed APK → select keystore → build release APK.
   - Or via Gradle: Configure `signingConfigs` in `android/app/build.gradle`.

3. **Build the Release AAB** (App Bundle — preferred by Google Play):
   ```bash
   cd android && ./gradlew bundleRelease
   ```

4. **Upload to Google Play Console**:
   - Create a new app in Google Play Console.
   - Complete the Store Listing (screenshots, description, content rating).
   - Upload the signed `.aab` file.
   - Submit for Google Play review.

**GrowthPilot AI cannot generate a signed release build without the owner's keystore credentials. This is a security requirement.**

---

## 7. CURRENT ANDROID BETA LIMITATIONS

| Item | Status |
|---|---|
| APK type | Debug (unsigned) — beta only |
| Google Play submission | NOT YET SUBMITTED — Human action required |
| Release signing | HUMAN ACTION REQUIRED (owner must generate keystore) |
| Android ARM32 support | Not included — ARM64 and x86_64 only |
| Push notifications | Not implemented in beta |
| Offline AI generation | Available via Demo Mode only |

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function rotateSigningKey() {
  console.log('[GrowthPilot Security] Initiating Android Release Keystore Rotation...');

  const rootDir = path.resolve(__dirname, '..');
  const androidDir = path.join(rootDir, 'android');
  const oldJks = path.join(androidDir, 'growthpilot-release-key.jks');
  const newKeystore = path.join(androidDir, 'growthpilot-release.keystore');
  const keyPropertiesPath = path.join(androidDir, 'key.properties');

  // Delete old keystore
  if (fs.existsSync(oldJks)) {
    fs.unlinkSync(oldJks);
    console.log('[GrowthPilot Security] Removed previous keystore.');
  }
  if (fs.existsSync(newKeystore)) {
    fs.unlinkSync(newKeystore);
  }

  // Generate strong random password
  const securePassword = 'GP_Rel_' + crypto.randomBytes(16).toString('hex') + '!2026';
  const alias = 'growthpilot_release';

  // Generate new release keystore via keytool
  const dname = "CN=GrowthPilot AI Production, OU=Security Engineering, O=GrowthPilot AI Inc, L=San Francisco, ST=California, C=US";
  const cmd = `keytool -genkeypair -v -keystore "${newKeystore}" -alias "${alias}" -keyalg RSA -keysize 2048 -validity 10000 -storepass "${securePassword}" -keypass "${securePassword}" -dname "${dname}"`;
  
  execSync(cmd, { stdio: 'pipe' });

  // Write untracked android/key.properties
  const keyPropertiesContent = [
    `# GrowthPilot AI — Android Release Signing Properties (UNTRACKED)`,
    `storeFile=../growthpilot-release.keystore`,
    `storePassword=${securePassword}`,
    `keyAlias=${alias}`,
    `keyPassword=${securePassword}`,
    ``
  ].join('\n');

  fs.writeFileSync(keyPropertiesPath, keyPropertiesContent, { mode: 0o600 });

  console.log('[GrowthPilot Security] SUCCESS: Rotated Android release signing key and created untracked key.properties.');
}

try {
  rotateSigningKey();
} catch (e) {
  console.error('[GrowthPilot Security] Failed to rotate key:', e.message);
  process.exit(1);
}

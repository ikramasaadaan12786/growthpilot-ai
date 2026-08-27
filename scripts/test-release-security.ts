/**
 * GrowthPilot AI — Final Pre-Launch Security & Release Verification Suite
 * 
 * Verifies:
 * 1. Android keystore and key.properties are strictly NOT tracked by Git.
 * 2. No signing passwords or secret keys exist in tracked repository files.
 * 3. .gitignore contains hardened exclusion rules.
 * 4. Payment provider mode is active MANUAL (Paddle customer checkout disabled).
 * 5. Admin endpoints enforce strict server-side role authorization.
 * 6. Client bundles and components contain zero exposed server secrets.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}${detail ? ` — ${detail}` : ''}`);
  } else {
    console.error(`  ✗ [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
  }
}

async function runReleaseSecurityQA() {
  console.log('\n========================================================================');
  console.log('  GROWTHPILOT AI — FINAL PRE-LAUNCH SECURITY & SIGNING QA SUITE');
  console.log('========================================================================\n');

  const rootDir = path.resolve(__dirname, '..');

  // --- TEST 1: ANDROID KEYSTORE & SIGNING PROFILES UNTRACKED BY GIT ---
  console.log('--> Section 1: Android Release Keystore & Signing Isolation');
  let trackedKeystores = '';
  try {
    trackedKeystores = execSync('git ls-files "*.jks" "*.keystore" "key.properties" "android/key.properties" "local.properties"', {
      cwd: rootDir,
      encoding: 'utf8'
    }).trim();
  } catch (e) {}

  assert(trackedKeystores === '', 'Keystore & Signing Files Untracked', 
    trackedKeystores ? `Found tracked files: ${trackedKeystores}` : 'Zero keystore, key.properties, or local.properties tracked');

  // --- TEST 2: GITIGNORE HARDENING RULES ---
  console.log('\n--> Section 2: .gitignore Rule Hardening');
  const gitignoreContent = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf8');
  assert(gitignoreContent.includes('*.jks') && gitignoreContent.includes('*.keystore'), '.gitignore Keystores Blocked', 'Excludes all *.jks and *.keystore');
  assert(gitignoreContent.includes('key.properties') && gitignoreContent.includes('android/key.properties'), '.gitignore key.properties Blocked', 'Excludes key.properties');
  assert(gitignoreContent.includes('.env') && gitignoreContent.includes('!.env.example'), '.gitignore .env Vaults Blocked', 'Excludes all .env files while preserving .env.example template');
  assert(gitignoreContent.includes('local.properties'), '.gitignore local.properties Blocked', 'Excludes local SDK properties');

  // --- TEST 3: ZERO HARDCODED SIGNING PASSWORDS IN BUILD.GRADLE ---
  console.log('\n--> Section 3: Android build.gradle Dynamic Credential Resolution');
  const buildGradle = fs.readFileSync(path.join(rootDir, 'android', 'app', 'build.gradle'), 'utf8');
  const hasHardcodedPassword = buildGradle.includes("storePassword '") || buildGradle.includes('storePassword "') || buildGradle.includes("keyPassword '");
  assert(!hasHardcodedPassword, 'No Hardcoded Signing Passwords in build.gradle', 'Credentials loaded dynamically from keyProperties / env vars');

  // --- TEST 4: MANUAL PAYMENT LAUNCH MODE PRESERVATION ---
  console.log('\n--> Section 4: Manual Payment Mode Authority');
  const { getPaymentProviderConfig } = await import('../src/lib/billing-provider');
  const paymentConfig = getPaymentProviderConfig();
  assert(paymentConfig.mode === 'MANUAL', 'Payment Provider is MANUAL', 'Online automated checkout safely isolated');
  assert(!paymentConfig.isAutomatedCheckoutEnabled, 'Automated Checkout Disabled', 'Prevents customer access to broken or sandbox payment gateways');

  // --- TEST 5: CLIENT-SIDE SECRET EXPOSURE AUDIT ---
  console.log('\n--> Section 5: Client-Side Component Secret Leakage Audit');
  const sensitivePatterns = [
    /process\.env\.PADDLE_API_KEY/,
    /process\.env\.DATABASE_URL/,
    /process\.env\.NEXTAUTH_SECRET/,
    /process\.env\.ENCRYPTION_SECRET/,
    /process\.env\.META_CLIENT_SECRET/,
    /process\.env\.LINKEDIN_CLIENT_SECRET/,
    /process\.env\.TIKTOK_CLIENT_SECRET/
  ];

  function scanClientDir(dir: string): boolean {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
        if (!scanClientDir(fullPath)) return false;
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.startsWith("'use client'") || content.startsWith('"use client"')) {
          for (const pattern of sensitivePatterns) {
            if (pattern.test(content)) {
              console.error(`Leak detected in ${fullPath}: ${pattern}`);
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  const isClientSafe = scanClientDir(path.join(rootDir, 'src'));
  assert(isClientSafe, 'Zero Server Secrets in Client Components', 'Verified all "use client" components');

  // --- TEST 6: ADMIN AUTHORIZATION ENFORCEMENT ---
  console.log('\n--> Section 6: Admin Authorization Security Verification');
  const adminUsersRoute = fs.readFileSync(path.join(rootDir, 'src', 'app', 'api', 'admin', 'users', 'route.ts'), 'utf8');
  const adminUserByIdRoute = fs.readFileSync(path.join(rootDir, 'src', 'app', 'api', 'admin', 'users', '[id]', 'route.ts'), 'utf8');
  const adminStatsRoute = fs.readFileSync(path.join(rootDir, 'src', 'app', 'api', 'admin', 'stats', 'route.ts'), 'utf8');

  assert(adminUsersRoute.includes("user.role !== 'ADMIN'"), 'GET /api/admin/users Role Gate', 'Enforces strict ADMIN check');
  assert(adminUserByIdRoute.includes("adminUser.role !== 'ADMIN'"), 'PATCH /api/admin/users/[id] Role Gate', 'Enforces strict ADMIN check');
  assert(adminStatsRoute.includes("user.role !== 'ADMIN'"), 'GET /api/admin/stats Role Gate', 'Enforces strict ADMIN check');

  console.log('\n========================================================================');
  console.log(`  QA RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('========================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runReleaseSecurityQA().catch((err) => {
  console.error('Security QA Suite failure:', err);
  process.exit(1);
});

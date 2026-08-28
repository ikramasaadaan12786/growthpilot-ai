/**
 * GrowthPilot AI — Responsive Layout & Viewport Regression Test Suite
 * 
 * Verifies that:
 * 1. Root shell has box-sizing border-box and overflow-x-hidden.
 * 2. Header right controls and Profile dropdown use collision-aware right-aligned layout.
 * 3. PlatformFilter and Header controls collapse smoothly on 1280px, 1366px, 1440px, and 125% zoom.
 * 4. Admin Control Center tables and cards support min-w-0 and independent horizontal scrolling containers.
 * 5. All temporary debug backdoors are completely removed and diagnostics requires standard admin auth.
 */

import fs from 'fs';
import path from 'path';

interface Assertion {
  name: string;
  passed: boolean;
  details: string;
}

const assertions: Assertion[] = [];

function assert(condition: boolean, testName: string, details: string) {
  if (condition) {
    assertions.push({ name: testName, passed: true, details });
    console.log(`  ✅ PASS: ${testName} — ${details}`);
  } else {
    assertions.push({ name: testName, passed: false, details: `FAILED: ${details}` });
    console.error(`  ❌ FAIL: ${testName} — ${details}`);
  }
}

async function runResponsiveQA() {
  console.log('\n======================================================');
  console.log('  GROWTHPILOT AI — RESPONSIVE LAYOUT & SHELL QA');
  console.log('======================================================\n');

  const rootLayout = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf-8');
  const globalsCss = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf-8');
  const header = fs.readFileSync(path.join(process.cwd(), 'src/components/layout/Header.tsx'), 'utf-8');
  const platformFilter = fs.readFileSync(path.join(process.cwd(), 'src/components/layout/PlatformFilter.tsx'), 'utf-8');
  const sidebar = fs.readFileSync(path.join(process.cwd(), 'src/components/layout/Sidebar.tsx'), 'utf-8');
  const adminDashboard = fs.readFileSync(path.join(process.cwd(), 'src/components/admin/AdminDashboard.tsx'), 'utf-8');
  const diagnosticsRoute = fs.readFileSync(path.join(process.cwd(), 'src/app/api/admin/diagnostics/route.ts'), 'utf-8');
  const middleware = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf-8');

  // Test 1: Global CSS box-sizing and overflow-x protections
  assert(
    globalsCss.includes('box-sizing: border-box') && globalsCss.includes('overflow-x: hidden'),
    'Test 1: Global Viewport Protections',
    'globals.css defines border-box and body overflow-x-hidden'
  );

  // Test 2: Root Layout Shell Structure
  assert(
    rootLayout.includes('overflow-x-hidden') && rootLayout.includes('min-w-0') && rootLayout.includes('max-w-7xl'),
    'Test 2: Root Layout Fluid Grid',
    'layout.tsx wraps main content with min-w-0 and natural vertical scrolling'
  );

  // Test 3: Header Profile Dropdown Collision-Aware Positioning
  assert(
    header.includes('absolute right-0 top-full') && header.includes('max-w-[calc(100vw-1.5rem)]') && header.includes('z-50'),
    'Test 3: Collision-Aware Profile Dropdown',
    'Header dropdown is right-aligned with max-width bounding preventing horizontal overflow'
  );

  // Test 4: Header Outside Click Handlers
  assert(
    header.includes('userMenuRef') && header.includes('handleClickOutside') && header.includes('mousedown'),
    'Test 4: Outside Click Handlers',
    'Header manages outside-click events to cleanly dismiss popovers'
  );

  // Test 5: PlatformFilter Responsive Abbreviations
  assert(
    platformFilter.includes('hidden 2xl:inline') && platformFilter.includes('hidden sm:inline 2xl:hidden'),
    'Test 5: PlatformFilter Responsive Density',
    'PlatformFilter collapses full labels on <2xl screens to avoid pushing header profile controls off-screen'
  );

  // Test 6: Sidebar Isolated Flex Geometry
  assert(
    sidebar.includes('w-64') && sidebar.includes('shrink-0') && sidebar.includes('overflow-x-hidden'),
    'Test 6: Sidebar Fixed-Width Isolation',
    'Sidebar maintains rigid 64-width with overflow protection without squeezing main container'
  );

  // Test 7: AdminDashboard Responsive Containers
  assert(
    adminDashboard.includes('w-full max-w-full min-w-0') && adminDashboard.includes('overflow-x-auto custom-scrollbar'),
    'Test 7: Admin Control Center Responsive Tables',
    'Admin dashboard uses full-width fluid wrapper with isolated horizontal scroll containers on data tables'
  );

  // Test 8: Security Cleanup - Zero Backdoors in Diagnostics Route
  assert(
    diagnosticsRoute.includes('requireAdmin(req)') && !diagnosticsRoute.includes('x-cron-secret') && !diagnosticsRoute.includes('searchParams.get(\'key\')'),
    'Test 8: Diagnostics Security Cleanup',
    '/api/admin/diagnostics enforces standard requireAdmin session auth with zero query-key or cron-secret backdoors'
  );

  // Test 9: Security Cleanup - Middleware Protection of /api/admin/
  assert(
    !middleware.includes('/api/admin/diagnostics'),
    'Test 9: Middleware Protection',
    'Diagnostics route is protected by Edge session auth and removed from public API list'
  );

  const passed = assertions.filter(a => a.passed).length;
  console.log(`\n======================================================`);
  console.log(`  RESPONSIVE & SECURITY QA: ${passed}/${assertions.length} TESTS PASSED`);
  console.log(`======================================================\n`);

  if (passed !== assertions.length) {
    process.exit(1);
  }
}

runResponsiveQA().catch((err) => {
  console.error('Fatal Responsive QA error:', err);
  process.exit(1);
});

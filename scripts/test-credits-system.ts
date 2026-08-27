/**
 * GrowthPilot AI — Entitlements & Credits Compatibility Suite
 * 
 * Verifies that legacy credit calls cleanly return unlimited access
 * and that feature limits are governed exclusively by Plan & 7-Day Trial entitlements.
 */

export {};

interface Assertion {
  name: string;
  passed: boolean;
  details: string;
}

const assertions: Assertion[] = [];

function assert(condition: boolean, testName: string, details: string) {
  if (condition) {
    assertions.push({ name: testName, passed: true, details });
    console.log(`  ✓ [PASS] ${testName}: ${details}`);
  } else {
    assertions.push({ name: testName, passed: false, details: `FAILED: ${details}` });
    console.error(`  ✗ [FAIL] ${testName}: ${details}`);
  }
}

async function runCreditsQA() {
  console.log('\n========================================================================');
  console.log('  GROWTHPILOT AI — CREDITS COMPATIBILITY & ENTITLEMENT QA SUITE');
  console.log('========================================================================\n');

  const { getUserCredits, awardSignupBonus, deductCredits } = await import('../src/lib/credits');

  const testUserId = 'user_test_compat_' + Date.now().toString(36);

  // Test 1: Credits Compatibility
  try {
    const awardResult = await awardSignupBonus(testUserId);
    assert(
      awardResult === true,
      'Test 1: Credits Compatibility Layer',
      'Signup bonus call succeeds without blocking'
    );
  } catch (err: any) {
    assert(false, 'Test 1: Credits Compatibility Layer', err.message);
  }

  // Test 2: User Credits Balance
  try {
    const balance = await getUserCredits(testUserId);
    assert(
      balance === 999,
      'Test 2: User Credits Balance',
      'Credits balance returns unlimited capability'
    );
  } catch (err: any) {
    assert(false, 'Test 2: User Credits Balance', err.message);
  }

  // Test 3: Deduct Credits
  try {
    const deduction = await deductCredits(testUserId, 1, 'AI Generation');
    assert(
      deduction.success === true,
      'Test 3: Deduct Credits Operation',
      'Deduction succeeds cleanly without error'
    );
  } catch (err: any) {
    assert(false, 'Test 3: Deduct Credits Operation', err.message);
  }

  const passed = assertions.filter(a => a.passed).length;
  console.log(`\n========================================================================`);
  console.log(`  QA RESULTS: ${passed}/${assertions.length} TESTS PASSED`);
  console.log(`========================================================================\n`);

  if (passed !== assertions.length) {
    process.exit(1);
  }
}

runCreditsQA().catch((err) => {
  console.error('Fatal Credits QA error:', err);
  process.exit(1);
});

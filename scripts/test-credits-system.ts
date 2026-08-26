/**
 * GrowthPilot AI — Credits System Automated QA Suite
 * 
 * Tests the 20-credit signup bonus, credit deductions for AI generation,
 * insufficient balance handling, and idempotency guarantees.
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
  console.log('  GROWTHPILOT AI — CREDITS SYSTEM AUTOMATED QA SUITE');
  console.log('========================================================================\n');

  const { getUserCredits, awardSignupBonus, deductCredits, SIGNUP_BONUS_CREDITS } = await import('../src/lib/credits');

  const testUserId = 'user_test_credits_' + Date.now().toString(36);

  // Test 1: Initial Signup Bonus Award
  try {
    const awardResult = await awardSignupBonus(testUserId);
    assert(
      awardResult.success === true && awardResult.balance === 20 && SIGNUP_BONUS_CREDITS === 20,
      'Test 1: Initial 20-Credit Signup Bonus',
      'New user receives exactly 20 bonus credits upon registration'
    );
  } catch (err: any) {
    assert(false, 'Test 1: Initial 20-Credit Signup Bonus', err.message);
  }

  // Test 2: Double-Awarding Idempotency Protection
  try {
    const secondAward = await awardSignupBonus(testUserId);
    const balance = await getUserCredits(testUserId);
    assert(
      balance === 20,
      'Test 2: Signup Bonus Idempotency Protection',
      'Re-triggering signup bonus does not duplicate credits; balance remains 20'
    );
  } catch (err: any) {
    assert(false, 'Test 2: Signup Bonus Idempotency Protection', err.message);
  }

  // Test 3: Successful Deduction for AI Generation
  try {
    const deductRes = await deductCredits(testUserId, 1, 'AI Content Generation');
    assert(
      deductRes.success === true && deductRes.remaining === 19,
      'Test 3: AI Operation Credit Deduction',
      'Deducted 1 credit for AI operation; balance updated to 19'
    );
  } catch (err: any) {
    assert(false, 'Test 3: AI Operation Credit Deduction', err.message);
  }

  // Test 4: Multiple Sequential Deductions
  try {
    await deductCredits(testUserId, 10, 'Batch Real Estate Script Generation');
    const balanceAfterBatch = await getUserCredits(testUserId);
    assert(
      balanceAfterBatch === 9,
      'Test 4: Batch Deductions Ledger Consistency',
      'Deducted 10 credits; balance accurately reflects 9 credits remaining'
    );
  } catch (err: any) {
    assert(false, 'Test 4: Batch Deductions Ledger Consistency', err.message);
  }

  // Test 5: Insufficient Credit Safety Gate
  try {
    const overDeduct = await deductCredits(testUserId, 15, 'Large Campaign Generation');
    const balanceAfterRejection = await getUserCredits(testUserId);
    assert(
      overDeduct.success === false && balanceAfterRejection === 9 && !!overDeduct.error,
      'Test 5: Insufficient Credit Safety Gate',
      'Operations exceeding balance are safely rejected without altering credit balance'
    );
  } catch (err: any) {
    assert(false, 'Test 5: Insufficient Credit Safety Gate', err.message);
  }

  console.log('\n========================================================================');
  const passCount = assertions.filter(a => a.passed).length;
  console.log(`  QA RESULTS: ${passCount}/${assertions.length} TESTS PASSED`);
  console.log('========================================================================\n');

  if (passCount !== assertions.length) {
    process.exit(1);
  }
}

runCreditsQA().catch((e) => {
  console.error('Fatal Credits QA error:', e);
  process.exit(1);
});

import 'dotenv/config';

async function testAll4Plans() {
  console.log('=== TESTING ALL 4 PADDLE PLAN BUTTONS & TRANSACTIONS ===\n');

  const plans = ['STARTER', 'PRO', 'ADVANCED', 'BUSINESS'] as const;

  for (const plan of plans) {
    const res = await fetch('https://growthpilot-ai-two.vercel.app/api/billing/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass mock auth header or session if needed
      },
      body: JSON.stringify({ plan })
    });
    console.log(`Plan ${plan} status without cookie:`, res.status);
  }

  // Now test with authenticated user
  const email = 'pilot_plan_test_' + Date.now() + '@growthpilot.ai';
  const regRes = await fetch('https://growthpilot-ai-two.vercel.app/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Plan Tester',
      email,
      password: 'PlanTestPass2026!',
      companyName: '4-Plan Tester Inc',
      industry: 'Real Estate'
    })
  });
  const cookie = regRes.headers.get('set-cookie');

  for (const plan of plans) {
    const res = await fetch('https://growthpilot-ai-two.vercel.app/api/billing/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie || ''
      },
      body: JSON.stringify({ plan })
    });
    const data = await res.json();
    console.log(`Plan ${plan}: HTTP ${res.status} | Price: ${data.priceId} | Txn: ${data.transactionId} | Amount: $${Number(data.amount) / 100}/mo | Trial: ${data.trialDays}d`);
  }
}

testAll4Plans().catch(console.error);

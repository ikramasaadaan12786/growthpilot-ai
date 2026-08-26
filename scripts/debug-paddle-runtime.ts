import 'dotenv/config';

async function diagnosePaddle() {
  console.log('=== PADDLE SANDBOX DEEP DIAGNOSTIC ===\n');

  const apiKey = process.env.PADDLE_API_KEY;
  console.log('1. API Key configured:', !!apiKey);

  // 1. Register a fresh test user
  const email = 'pilot_debug_' + Date.now() + '@growthpilot.ai';
  const regRes = await fetch('https://growthpilot-ai-two.vercel.app/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Diagnostic User',
      email,
      password: 'PaddleDebugPass2026!',
      companyName: 'Debug Realty',
      industry: 'Real Estate'
    })
  });
  const cookie = regRes.headers.get('set-cookie');
  console.log('2. Registered user:', email, 'Status:', regRes.status);

  // 2. Call /api/billing/checkout
  const checkoutRes = await fetch('https://growthpilot-ai-two.vercel.app/api/billing/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie || ''
    },
    body: JSON.stringify({ plan: 'PRO' })
  });

  const checkoutData = await checkoutRes.json();
  console.log('3. /api/billing/checkout response:', JSON.stringify(checkoutData, null, 2));

  const txnId = checkoutData.transactionId;
  console.log('4. Transaction ID:', txnId);

  // 3. Query the created transaction directly from Paddle Sandbox API
  if (txnId && apiKey) {
    const txnRes = await fetch(`https://sandbox-api.paddle.com/transactions/${txnId}`, {
      headers: { Authorization: 'Bearer ' + apiKey }
    });
    const txnDetails = await txnRes.json();
    console.log('\n5. Paddle Sandbox GET /transactions/' + txnId + ' status:', txnRes.status);
    console.log('Transaction Details:', JSON.stringify(txnDetails, null, 2));
  }

  // 4. Test the checkout URL directly
  if (checkoutData.url) {
    const urlRes = await fetch(checkoutData.url);
    console.log('\n6. Checkout URL fetch HTTP status:', urlRes.status, 'URL:', checkoutData.url);
  }
}

diagnosePaddle().catch(console.error);

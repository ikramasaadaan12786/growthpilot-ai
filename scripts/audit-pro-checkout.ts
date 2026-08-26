import 'dotenv/config';
import { prisma } from '../src/lib/db';

async function auditProCheckout() {
  console.log('=== PHASE 1: AUDITING POSTGRESQL SUBSCRIPTION & PADDLE RECORDS ===\n');

  const apiKey = process.env.PADDLE_API_KEY;
  
  // 1. Fetch recent users with subscriptions
  const users = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { subscription: true }
  });

  console.log(`Found ${users.length} recent users in database:`);
  for (const u of users) {
    console.log(`\nUser: ${u.email} (ID: ${u.id})`);
    console.log(`Role: ${u.role}, Company: ${u.companyName}`);
    if (u.subscription) {
      console.log(`Subscription: Plan=${u.subscription.plan}, Status=${u.subscription.status}`);
      console.log(`Paddle Customer ID: ${u.subscription.paddleCustomerId || 'None'}`);
      console.log(`Paddle Sub ID: ${u.subscription.paddleSubscriptionId || 'None'}`);
      console.log(`Paddle Price ID: ${u.subscription.paddlePriceId || 'None'}`);
      console.log(`Period: Start=${u.subscription.currentPeriodStart.toISOString()}, End=${u.subscription.currentPeriodEnd.toISOString()}`);
      console.log(`CancelAtPeriodEnd: ${u.subscription.cancelAtPeriodEnd}`);
    } else {
      console.log('Subscription: None');
    }
  }

  // 2. Query Paddle Sandbox for recent transactions and customers
  if (apiKey) {
    console.log('\n--- Querying Paddle Sandbox for Recent Transactions ---');
    const txRes = await fetch('https://sandbox-api.paddle.com/transactions?per_page=5', {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    const txData = await txRes.json();
    console.log('Paddle Transactions count:', txData.data?.length || 0);
    if (txData.data) {
      for (const tx of txData.data) {
        console.log(`Txn: ${tx.id} | Status: ${tx.status} | Customer: ${tx.customer_id} | Total: ${tx.details?.totals?.total} ${tx.currency_code} | CustomData:`, tx.custom_data);
      }
    }

    console.log('\n--- Querying Paddle Sandbox for Recent Subscriptions ---');
    const subRes = await fetch('https://sandbox-api.paddle.com/subscriptions?per_page=5', {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    const subData = await subRes.json();
    console.log('Paddle Subscriptions count:', subData.data?.length || 0);
    if (subData.data) {
      for (const sub of subData.data) {
        console.log(`Sub: ${sub.id} | Status: ${sub.status} | Customer: ${sub.customer_id} | Next Bill: ${sub.next_billed_at}`);
      }
    }
  }
}

auditProCheckout().catch(console.error);

import fs from 'fs';

async function testScope(name: string, scopes: string[]) {
  const appId = '1379013277028626';
  const redirectUri = 'https://growthpilot-ai-two.vercel.app/api/auth/oauth/instagram/callback';
  const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=TEST_STATE&scope=${encodeURIComponent(scopes.join(','))}&response_type=code`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    }
  });

  const text = await res.text();
  const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  
  console.log(`\n=== [${name}] Scopes: ${scopes.join(', ')} ===`);
  console.log(`HTTP Status: ${res.status}`);
  console.log(`Snippet: ${clean.substring(0, 300)}`);
}

async function main() {
  await testScope('Current 7 Scopes (Failing)', [
    'instagram_basic',
    'instagram_content_publish',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'business_management'
  ]);

  await testScope('Standard Instagram Scopes (Clean)', [
    'instagram_basic',
    'pages_show_list',
    'pages_read_engagement'
  ]);

  await testScope('Instagram Scopes + Content Publish', [
    'instagram_basic',
    'instagram_content_publish',
    'pages_show_list',
    'pages_read_engagement'
  ]);

  await testScope('Facebook Pages Scopes (Clean)', [
    'pages_show_list',
    'pages_read_engagement'
  ]);

  await testScope('Facebook Pages Scopes + Manage Posts', [
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts'
  ]);
}

main().catch(console.error);

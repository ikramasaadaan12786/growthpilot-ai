import fs from 'fs';
import path from 'path';

async function securityAudit() {
  console.log('=== PHASE 13: SECURITY & CLIENT BUNDLE SECRET EXPOSURE AUDIT ===\n');

  const serverSecrets = [
    'PADDLE_API_KEY',
    'PADDLE_WEBHOOK_SECRET',
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'ENCRYPTION_SECRET',
    'TIKTOK_CLIENT_SECRET',
    'META_CLIENT_SECRET',
    'LINKEDIN_CLIENT_SECRET'
  ];

  const clientDir = path.join(process.cwd(), 'src');
  const violations: string[] = [];

  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        scanDir(full);
      } else if (e.isFile() && (e.name.endsWith('.tsx') || (e.name.endsWith('.ts') && !e.name.includes('/api/')))) {
        // Only inspect client components or files imported by client
        const content = fs.readFileSync(full, 'utf8');
        const isClient = content.includes("'use client'") || content.includes('"use client"');
        if (isClient) {
          for (const secret of serverSecrets) {
            if (content.includes(`process.env.${secret}`)) {
              violations.push(`File ${full} references server secret process.env.${secret}`);
            }
          }
        }
      }
    }
  }

  scanDir(clientDir);

  if (violations.length === 0) {
    console.log('✓ [PASS] Zero server secrets exposed in client-side ("use client") components!');
  } else {
    console.error('✗ [FAIL] Violations found:', violations);
  }

  for (const s of serverSecrets) {
    const isConfigured = !!process.env[s];
    console.log(`Secret ${s}: ${isConfigured ? 'CONFIGURED' : 'UNCONFIGURED (Local)'}`);
  }
}

securityAudit().catch(console.error);

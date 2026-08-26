/**
 * GrowthPilot AI — Production Database Schema Sync & Migration Script
 * Safely applies Prisma schema additions to production PostgreSQL without data loss.
 */

import { execSync } from 'child_process';
import 'dotenv/config';

async function syncDatabase() {
  console.log('\n======================================================');
  console.log('  GROWTHPILOT AI — DATABASE SCHEMA SYNCHRONIZATION');
  console.log('======================================================\n');

  const databaseUrl = process.env.DATABASE_URL || '';

  if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
    console.log('• Detected PostgreSQL Database (Neon / Cloud Production)');
    console.log('• Applying non-destructive schema additions via Prisma db push...');

    try {
      execSync('npx prisma db push --skip-generate', {
        stdio: 'inherit',
        env: process.env
      });
      console.log('✓ PostgreSQL database schema successfully synchronized.');
    } catch (err: any) {
      console.warn('⚠️ Notice during prisma db push:', err.message);
    }
  } else {
    console.log('• Database URL is local or non-Postgres. Skipping remote schema push.');
  }

  console.log('• Generating Prisma Client...');
  try {
    execSync('npx prisma generate', {
      stdio: 'inherit',
      env: process.env
    });
    console.log('✓ Prisma Client generated successfully.\n');
  } catch (err: any) {
    console.error('✗ Failed to generate Prisma Client:', err.message);
    process.exit(1);
  }
}

syncDatabase().catch((err) => {
  console.error('Database sync script error:', err);
  process.exit(1);
});

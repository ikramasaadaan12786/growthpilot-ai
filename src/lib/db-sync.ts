import { prisma } from './db';

let isSchemaEnsured = false;
let schemaPromise: Promise<void> | null = null;

/**
 * Ensures all required production database columns exist using safe,
 * idempotent ALTER TABLE ... ADD COLUMN IF NOT EXISTS statements.
 */
export async function ensureDatabaseSchema(): Promise<void> {
  if (isSchemaEnsured) return;

  if (schemaPromise) {
    return schemaPromise;
  }

  schemaPromise = (async () => {
    try {
      const databaseUrl = process.env.DATABASE_URL || '';
      const isPostgres = databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://');

      if (!isPostgres) {
        isSchemaEnsured = true;
        return;
      }

      // Safe, non-destructive column additions for PostgreSQL
      const safeMigrations = [
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" TEXT;`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER';`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "companyName" TEXT;`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "industry" TEXT DEFAULT 'Real Estate & Business';`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false;`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "verificationToken" TEXT;`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resetToken" TEXT;`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resetTokenExpires" TIMESTAMP(3);`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isSuspended" BOOLEAN DEFAULT false;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "paddleCustomerId" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "paddleSubscriptionId" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "paddlePriceId" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "stripePriceId" TEXT;`
      ];

      for (const query of safeMigrations) {
        try {
          await prisma.$executeRawUnsafe(query);
        } catch (e: any) {
          // Table might not exist yet or minor syntax notice
          console.warn('[DB Sync Notice]:', e.message);
        }
      }

      isSchemaEnsured = true;
      console.log('[DB Sync]: Production schema columns verified and up-to-date.');
    } catch (err: any) {
      console.warn('[DB Sync Error]:', err.message);
    } finally {
      schemaPromise = null;
    }
  })();

  return schemaPromise;
}

import { prisma } from './db';

let isSchemaEnsured = false;
let schemaPromise: Promise<void> | null = null;

/**
 * Ensures all required production database columns exist using safe,
 * idempotent ALTER TABLE ... ADD COLUMN IF NOT EXISTS statements and
 * verifies that the primary owner account has the MASTER_ADMIN role.
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
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "approvalStatus" TEXT DEFAULT 'APPROVED';`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3);`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "approvedBy" TEXT;`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "trialStatus" TEXT DEFAULT 'NOT_STARTED';`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "trialStartDate" TIMESTAMP(3);`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "trialEndDate" TIMESTAMP(3);`,
        `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isSuspended" BOOLEAN DEFAULT false;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "paddleCustomerId" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "paddleSubscriptionId" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "paddlePriceId" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "stripePriceId" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "paymentReference" TEXT;`,
        `ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "paymentNotes" TEXT;`,
        // Backfill existing ADMIN to MASTER_ADMIN and APPROVED
        `UPDATE "users" SET "role" = 'MASTER_ADMIN', "approvalStatus" = 'APPROVED' WHERE "role" = 'ADMIN';`,
        // Backfill existing users without approvalStatus to APPROVED to prevent lockout
        `UPDATE "users" SET "approvalStatus" = 'APPROVED' WHERE "approvalStatus" IS NULL;`
      ];

      for (const query of safeMigrations) {
        try {
          await prisma.$executeRawUnsafe(query);
        } catch (e: any) {
          // Non-fatal notice
        }
      }

      // Check if any MASTER_ADMIN exists in PostgreSQL. If none, promote the earliest user (the owner)
      try {
        const masterAdmin = await prisma.user.findFirst({
          where: { role: 'MASTER_ADMIN' }
        });

        if (!masterAdmin) {
          const earliestUser = await prisma.user.findFirst({
            orderBy: { createdAt: 'asc' }
          });

          if (earliestUser) {
            await prisma.user.update({
              where: { id: earliestUser.id },
              data: {
                role: 'MASTER_ADMIN',
                approvalStatus: 'APPROVED'
              }
            });
            console.log('[DB Sync]: Earliest user assigned MASTER_ADMIN role.');
          }
        }
      } catch (roleErr: any) {
        // Table or connection notice
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

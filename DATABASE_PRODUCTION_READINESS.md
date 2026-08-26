# DATABASE PRODUCTION READINESS & DISASTER RECOVERY — GROWTHPILOT AI

**Database Engine**: Neon Serverless PostgreSQL 16  
**ORM**: Prisma 5.22.0  
**Schema Status**: 21 Active Models Fully Synchronized

---

## 1. Schema Integrity & Relationship Audit

- **`User` Model**: Multi-tenant root with `passwordHash`, `role`, `companyName`, `industry`, and soft suspension flag (`isSuspended`).
- **`Subscription` Model**: 1:1 relation to `User` with indexed `paddleCustomerId`, `paddleSubscriptionId`, and `paddlePriceId`.
- **`SocialAccount` Model**: 1:N relation to `User` with cascade protection and indexed `platform` + `accountId`.
- **`OAuthToken` Model**: Encrypted token vault (AES-256-GCM) storing access and refresh tokens.
- **`AuditLog` Model**: Immutable append-only audit trail logging all OAuth handshakes, billing syncs, and publishing dispatches.

---

## 2. Automated Non-Destructive Deployment Process
Every production build automatically runs `scripts/sync-database-schema.ts` which uses Prisma Client code generation and non-destructive schema reconciliation, ensuring existing users, social accounts, and lead CRM data are never dropped or reset during deployments.

---

## 3. Snapshot Backups & Recovery
Neon PostgreSQL provides instant Point-In-Time Restore (PITR) with continuous automated write-ahead log (WAL) archiving. To restore in an emergency:
1. Open the Neon Console.
2. Select the GrowthPilot AI project branch.
3. Click **Restore to point in time** and select the desired timestamp.

# Deployment Guide

This guide provides step-by-step instructions to configure, run locally, and deploy the Companio AI monorepo from scratch.

---

## 1. Local Development Setup

### Prerequisites

- **Node.js:** v18.0.0 or higher
- **pnpm:** v9.0.0 or higher (Install globally via `npm install -g pnpm`)
- **Git**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nahas2003/companio-ai.git
   cd companio-ai
   ```
2. Install workspace dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
   The Next.js client is accessible at `http://localhost:3000`.

---

## 2. Environment Variables

Create a `.env` file inside the root folder and inside `apps/web/.env` using the following configurations:

```ini
# Supabase Client Credentials
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIs...

# Database Connection Strings (Prisma)
# Use port 6543 (transaction pooling) for DATABASE_URL
DATABASE_URL=postgresql://postgres:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10
# Use port 5432 (direct connection) for DIRECT_URL
DIRECT_URL=postgresql://postgres:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres

# AI Provider Integration
GEMINI_API_KEY=AIzaSy...
```

_Note: If `GEMINI_API_KEY` is omitted, the application automatically falls back to `MockProviderAdapter` for loopback sandbox execution._

---

## 3. Supabase & Storage Bucket Configuration

1. Create a new project in the [Supabase Dashboard](https://database.new).
2. Go to **Project Settings** -> **API** to copy the **Project URL** and **anon public key**.
3. Go to **Storage** in the sidebar.
4. Click **New Bucket** and configure:
   - **Bucket Name:** `sources`
   - **Privacy Level:** Private (Keep Public toggle disabled)
5. Add the following **Storage Policies** under Policy Editor:
   - **Select/Read:** Enable reading files for authenticated users only.
   - **Insert/Upload:** Enable uploads for authenticated users only.
   - **Delete:** Enable deletion for owners only.

---

## 4. Database Migration Steps

Companio uses Prisma Client to map PostgreSQL database operations.

### During Development (Schema Push)

To synchronize structural updates directly to PostgreSQL without generating intermediate migrations logs (recommended for fast iteration):

```bash
pnpm --filter db exec prisma db push
```

### Creating migrations

To create a named SQL migration baseline tracking file changes:

```bash
pnpm --filter db exec prisma migrate dev --name <migration_name>
```

### Production Deployment (Apply Migrations)

To apply pending migrations during your production deployment pipeline:

```bash
pnpm --filter db exec prisma migrate deploy
```

---

## 5. Build Commands

To build all workspace packages (Next.js web, db packages, ui components):

```bash
pnpm build
```

To compile only the Next.js web application:

```bash
pnpm --filter web build
```

---

## 6. Production Deployment (Vercel)

1. Sign in to your [Vercel Dashboard](https://vercel.com) and click **Add New** -> **Project**.
2. Import the cloned `companio-ai` repository.
3. Configure the following fields in the project setup screen:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
4. Expand the **Build and Development Settings** and ensure:
   - **Build Command:** `next build`
   - **Install Command:** `pnpm install` (Vercel auto-detects monorepos)
5. Expand the **Environment Variables** section and copy all key-value pairings from your `.env` configuration file.
6. Click **Deploy**.

---

## 7. Common Deployment Issues

### Pgbouncer Connection Pool Exhaustion

- **Symptom:** Logs throw `PrismaClientInitializationError: Pgbouncer failure` or timeout errors.
- **Resolution:** Ensure `DATABASE_URL` connection limit is set to a low value (e.g. `&connection_limit=10`) and transaction pooling `?pgbouncer=true` parameter is appended to the connection string.

### Missing User Profile Syncs

- **Symptom:** Authentication completes successfully but database queries fail with `User profile not found`.
- **Resolution:** Re-verify that Next.js actions call the centralized verification helper `getVerifiedUser(accessToken)`. This helper automatically lazy-provisions any missing user profile from Supabase Auth to the Postgres table on-the-fly.

---

## 8. Backup, Recovery & Rollbacks

### Database Backups

- **Supabase Automatic Backups:** Supabase automatically schedules daily backups.
- **Manual Backups:** Use `pg_dump` to output structure maps:
  ```bash
  pg_dump -h aws-0-<region>.pooler.supabase.com -U postgres -d postgres > companio_backup.sql
  ```

### Recovery

To apply a backup SQL file:

```bash
psql -h aws-0-<region>.pooler.supabase.com -U postgres -d postgres -f companio_backup.sql
```

### Rollback Strategy

1. **Frontend (Vercel):** Go to Vercel deployments, select the last stable build, and click **Redeploy** or click **Promote to Production** on a past release.
2. **Git:** Revert master commits:
   ```bash
   git revert <commit-hash-to-undo>
   git push origin main
   ```
3. **Database migrations rollback:** If a schema rollback is required, apply matching down migrations using direct SQL or manually re-sync using `prisma db push` with an older schema state.

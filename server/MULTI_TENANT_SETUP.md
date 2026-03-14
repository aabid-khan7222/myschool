# Multi-Tenant Database Setup

## Overview

The application supports multiple schools, each with its own database. The primary school uses the default connection (DB_HOST, DB_NAME, etc.). Additional schools can use separate cloud databases (e.g. Neon) via school-specific env vars.

## Production: Master DB on Neon

To connect `master_db` (school registry) to its Neon database in production:

1. **Set in your production env**:
   ```
   MASTER_DATABASE_URL=postgresql://USER:PASSWORD@ep-sweet-mode-a1vx0r90-pooler.ap-southeast-1.aws.neon.tech:5432/master_db?sslmode=require&channel_binding=require
   ```
   Replace `USER` and `PASSWORD` with your Neon credentials.

2. This affects only the school-registry queries (`master_db.schools`). Tenant DB routing remains unchanged.

## Production: Millat School on Neon

To connect Millat (institute 2222) to its Neon database in production:

1. **Set in your production env** (Render, Vercel, etc.):
   ```
   MILLAT_DATABASE_URL=postgresql://USER:PASSWORD@ep-sweet-mode-a1vx0r90-pooler.ap-southeast-1.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require
   ```
   Replace `USER` and `PASSWORD` with your Neon credentials.

2. **master_db** and the **primary school** (school_db) remain on your main PostgreSQL server. Only Millat traffic uses Neon when institute 2222 logs in.

3. **Local development:** Leave `MILLAT_DATABASE_URL` unset to use local `millat_db` on the same server as school_db.

## Production: Iqra School on Neon

To connect Iqra (institute 3333) to its Neon database in production:

1. **Set in your production env** (Render, Vercel, etc.):
   ```
   IQRA_DATABASE_URL=postgresql://USER:PASSWORD@ep-sweet-mode-a1vx0r90-pooler.ap-southeast-1.aws.neon.tech:5432/iqra_db?sslmode=require&channel_binding=require
   ```
   Replace `USER` and `PASSWORD` with your Neon credentials.

2. **Local development:** Leave `IQRA_DATABASE_URL` unset to use local `iqra_db`.

## Tenant Provisioning (Create New School)

When creating a new school, the system clones a template database. **PostgreSQL requires the template DB to have zero active connections.**

The template name is resolved as:
1. `PROVISIONING_TEMPLATE_DB_NAME` (recommended for production)
2. Else `DB_NAME` if set
3. Else database name from `DATABASE_URL` or `TENANT_ADMIN_DATABASE_URL`
4. Else `school_db` (local default)

**Production (Neon):** Neon may keep connections to databases. If "source database is being accessed" persists: (1) Create `school_template` on Neon, (2) In Neon SQL Editor run `ALTER DATABASE school_template CONNECTION LIMIT 0` to block new connections, (3) Wait for existing connections to drop, then retry. Or use Neon API/Console to create databases.

**TENANT_ADMIN_DATABASE_URL:** Connection for `CREATE DATABASE`. Falls back to `DATABASE_URL`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes (production) | Render Postgres. PreSkool (1111→school_db) uses this. |
| DB_NAME | No | Local primary. Production primary from DATABASE_URL. |
| MASTER_DATABASE_URL | Yes (production) | master_db on Neon (schools registry) |
| MILLAT_DATABASE_URL | No | Millat on Neon |
| IQRA_DATABASE_URL | No | Iqra on Neon |
| TENANT_ADMIN_DATABASE_URL | No | CREATE DATABASE (Neon postgres). Falls back to DATABASE_URL. |

## Security

- Never commit real credentials. Use placeholders in env.example.
- Add `MASTER_DATABASE_URL` only in production env (Render dashboard, etc.).
- Add `MILLAT_DATABASE_URL` only in production env (Render dashboard, etc.).
- Add `IQRA_DATABASE_URL` only in production env (Render dashboard, etc.).
- Keep `.env` in `.gitignore` (already configured).

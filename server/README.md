# The Amazing World of Gumball API

A free, read-only REST API about _The Amazing World of Gumball_.

## Stack

| Concern          | Choice                                                                        |
| ---------------- | ----------------------------------------------------------------------------- |
| Framework        | NestJS 12 (ESM, Express)                                                      |
| Database         | PostgreSQL on Supabase                                                        |
| ORM / migrations | Prisma 7 with the `pg` driver adapter                                         |
| Validation       | `class-validator` for requests, `zod` for environment variables               |
| Security         | Helmet, CORS (read-only methods), rate limiting, read-only database role, RLS |
| Observability    | `nestjs-pino` structured logs, Terminus health check                          |
| Quality          | Vitest, oxlint, Prettier, GitHub Actions                                      |

## Project structure

```
src/
├── main.ts
├── app.module.ts
├── app.constants.ts
├── bootstrap/          security middleware, CORS, versioning, validation, logger
├── config/             typed and validated environment variables
├── database/           PrismaService (global)
├── common/filters/     consistent error responses
├── generated/prisma/   generated Prisma Client (git-ignored)
└── modules/
    └── health/         GET /health
prisma/
├── schema.prisma
└── migrations/         database security baseline and future schema migrations
scripts/
└── verify-database-security.ts
supabase/sql/           one-off SQL scripts for the Supabase SQL Editor
```

## Getting started

Requirements: Node.js 22.18+ and a Supabase project configured with `docs/supabase-setup.pt-BR.md`.

```bash
npm install
cp .env.example .env
npm run db:migrate:deploy
npm run db:verify-security
npm run start:dev
```

## Environment variables

| Variable                 | Required    | Default       | Description                                                                                                                    |
| ------------------------ | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`           | yes         |               | Runtime connection as the read-only `gumball_api_reader` role through the transaction pooler (port 6543).                      |
| `DATABASE_MIGRATION_URL` | CLI only    |               | Prisma CLI and security checks, as `postgres` through the session pooler (port 5432). Never set it in the runtime environment. |
| `DATABASE_SSL_CA`        | recommended |               | Supabase root CA (PEM). `\n` sequences are accepted for single-line values.                                                    |
| `DATABASE_POOL_MAX`      | no          | `10`          | Maximum connections per API instance.                                                                                          |
| `NODE_ENV`               | no          | `development` | `development`, `test` or `production`.                                                                                         |
| `PORT`                   | no          | `3000`        | HTTP port.                                                                                                                     |
| `LOG_LEVEL`              | no          | `info`        | Pino log level.                                                                                                                |
| `CORS_ORIGINS`           | no          | `*`           | `*` or a comma-separated list of origins.                                                                                      |
| `TRUST_PROXY_HOPS`       | no          | `0`           | Reverse proxies in front of the API. Use `1` on Render, Railway, Fly and similar hosts.                                        |
| `THROTTLE_TTL_MS`        | no          | `60000`       | Rate limit window.                                                                                                             |
| `THROTTLE_LIMIT`         | no          | `100`         | Requests allowed per window and IP.                                                                                            |

## Database security model

The API is read-only at every layer:

1. **HTTP**: only `GET` routes exist and CORS only allows `GET`, `HEAD` and `OPTIONS`.
2. **Grants**: `anon`, `authenticated` and `gumball_api_reader` only ever receive `SELECT`. Default privileges are revoked, so a new table is inaccessible until it is explicitly opened.
3. **Row Level Security**: every table has RLS enabled with a single `FOR SELECT` policy and no write policies.
4. **API role**: the API connects as `gumball_api_reader`, which cannot bypass RLS, runs transactions as read-only by default and has a 5 second statement timeout.

### Adding a table

Every migration that creates a table must open it for reading with one line:

```sql
SELECT internal.apply_public_read_policy('public.<table>');
```

The function grants `SELECT`, enables RLS and creates the read policy. It lives in the `internal` schema, which public roles cannot reach.

Then run `npm run db:verify-security`. It audits grants, policies and RLS, and it attempts real writes as `anon`, `authenticated` and `gumball_api_reader`, failing if any of them succeeds.

## Scripts

| Script                                                  | Description                                     |
| ------------------------------------------------------- | ----------------------------------------------- |
| `npm run start:dev`                                     | Start in watch mode                             |
| `npm run build` / `npm run start:prod`                  | Build and run the compiled app                  |
| `npm run lint` / `npm run format` / `npm run typecheck` | Code quality                                    |
| `npm test` / `npm run test:e2e` / `npm run test:cov`    | Tests                                           |
| `npm run db:migrate:dev`                                | Create a migration from `schema.prisma` changes |
| `npm run db:migrate:deploy`                             | Apply pending migrations                        |
| `npm run db:migrate:status`                             | Show migration status                           |
| `npm run db:verify-security`                            | Audit and test the database security rules      |

## Disclaimer

_The Amazing World of Gumball_ and its characters are trademarks of and © Warner Bros. Discovery. This is an unofficial fan project and is not affiliated with or endorsed by Warner Bros. Discovery or Cartoon Network.

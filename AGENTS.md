# AGENTS.md

Guidance for AI coding agents working on the Gumball API.

## Project

A public, **read-only** REST API about *The Amazing World of Gumball*, meant to be used by other developers. Quality bar: professional, well structured, market-standard.

- The API lives in `server/`.
- The maintainer communicates in Brazilian Portuguese. Reply in Portuguese; write all code in English.

## Scope rules

- Build only what was asked. Do not add domain modules (characters, episodes, locations, etc.), endpoints or features on your own initiative. The maintainer provides them step by step.
- Do not add tooling that was not requested. In particular:
  - **No Docker** (no `Dockerfile`, `docker-compose`, `.dockerignore`).
  - **No Swagger/OpenAPI/Scalar** or other documentation tooling until explicitly requested.
- The approved stack is **NestJS + Prisma + Supabase (PostgreSQL)**, plus infrastructure that directly affects the API: Helmet, CORS, compression, rate limiting (`@nestjs/throttler`), validation (`class-validator`, `zod` for env), logging (`nestjs-pino`) and health checks (`@nestjs/terminus`). Ask before adding anything else.
- When unsure whether something is in scope, ask instead of adding it.

## Code conventions

- **All code in English**: identifiers, file names, error messages, commit messages.
- **No comments anywhere in code**, including TypeScript, SQL migrations and config files. Strip generated comments too (for example the `-- CreateTable` lines Prisma writes into migrations).
- Follow NestJS best practices and split everything into modules:
  - Feature modules live in `server/src/modules/<feature>/`.
  - Layering per feature: `controller` → `service` → `repository` (Prisma access only in repositories), with `dto/` and a `mapper` that converts Prisma models to response DTOs. Never return Prisma models directly.
  - Cross-cutting code goes in `server/src/common/`, configuration in `server/src/config/`, and database access in `server/src/database/`.
- The project is **ESM** (`"type": "module"`, `nodenext`): relative imports must end in `.js`.
- Read configuration through `AppConfigService`, never through `process.env` in application code. Every new env var must be added to `src/config/env.schema.ts` (zod) and to `.env.example`.
- Only `GET` routes. The API never creates, updates or deletes data over HTTP, and there is no authentication. Like PokéAPI or the Rick and Morty API, data is maintained outside the API: the maintainer edits it directly in Supabase.
- List endpoints are paginated with `PaginationQueryDto` and `paginate()` from `src/common/pagination/`, and every filter is validated in a query DTO. Route params go through `ParseIdPipe` / `ParseSlugPipe`.
- Enums are stored uppercase in the database and exposed in lowercase kebab-case through an enum codec (see `modules/characters/character.enums.ts`).
- Errors go through `AllExceptionsFilter`, which produces one consistent shape: `statusCode`, `error`, `message`, `path`, `timestamp`.
- Formatting: Prettier (single quotes, trailing commas). Linting: oxlint.

## Database and security

Security is non-negotiable: API consumers must only be able to **read**.

- **Two connections:**
  - `DATABASE_URL`: the runtime connection, as the read-only role `gumball_api_reader` through the Supabase transaction pooler (port 6543).
  - `DATABASE_MIGRATION_URL`: used only by the Prisma CLI and `db:verify-security`, as `postgres` through the session pooler (port 5432). It must **never** be used by application code or set in production.
- **Every migration that creates a table** must end with one line per new table:

  ```sql
  SELECT internal.apply_public_read_policy('public.<table>');
  ```

  This grants `SELECT` to `anon`, `authenticated` and `gumball_api_reader`, enables RLS and creates a single `FOR SELECT` policy. Never add `INSERT`, `UPDATE` or `DELETE` policies or grants for these roles.
- Because data is edited by hand in Supabase, the database must protect itself: give `updated_at` a default plus the `internal.set_updated_at()` trigger, and add `CHECK` constraints for formats Prisma cannot enforce (slugs, `https` URLs, non-null arrays).
- Create migrations with `npm run db:migrate:dev -- --create-only --name <name>`, edit them (add the policy line, strip comments), then apply them with `npm run db:migrate:deploy`.
- After any database change, run `npm run db:verify-security`. It must report `0 failed`.
- Never use or store the Supabase `service_role`/secret key or the publishable key. The API does not need them.
- Never run migrations or write to the maintainer's Supabase database unless explicitly asked. Read-only commands like `prisma migrate status` are fine.
- Never print, echo or commit secrets from `.env`.

## Dependencies

- Prisma is pinned to **exactly 7.10.0** (`prisma`, `@prisma/client`, `@prisma/adapter-pg`). Keep the three on the same exact version. The npm `latest` tag may point to a release candidate, so never upgrade to it.
- **Never run `npm audit fix --force`.** It once downgraded Prisma to v6 and broke the project. Fix advisories with targeted `overrides` in `package.json` instead, then verify that the Prisma CLI still works.
- Keep `server/src/generated/` out of git and out of manual edits. Regenerate it with `npm run prisma:generate`.

## Commands (run from `server/`)

| Command | Purpose |
| --- | --- |
| `npm run start:dev` | Run the API in watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | oxlint |
| `npm run format` / `npm run format:check` | Prettier |
| `npm test` | Unit tests (Vitest, `src/**/*.spec.ts`) |
| `npm run test:e2e` | E2E tests (`test/**/*.e2e-spec.ts`, Prisma mocked) |
| `npm run db:migrate:dev -- --create-only --name <name>` | Create a migration without applying it |
| `npm run db:migrate:deploy` | Apply pending migrations |
| `npm run db:migrate:status` | Show migration status |
| `npm run db:verify-security` | Audit and test grants, RLS and the read-only role |

Before reporting a task as done, run `format:check`, `lint`, `typecheck`, `test`, `test:e2e` and `build`, and report the actual results.

## Reference

- Supabase setup guide (pt-BR): `server/docs/supabase-setup.pt-BR.md`
- Security baseline migration: `server/prisma/migrations/20260929000000_database_security/migration.sql`
- Reference feature module: `server/src/modules/characters/`

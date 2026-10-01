# The Amazing World of Gumball API

A free, read-only REST API about _The Amazing World of Gumball_ and _The Wonderfully Weird World of Gumball_: characters, locations, episodes, seasons, songs, games and in-universe media.

No authentication or API key is required. Every image is a WebP file served from a CDN.

## Resources

`GET /` describes the API and lists every resource:

```json
{
    "name": "The Amazing World of Gumball API",
    "description": "A free, read-only REST API about The Amazing World of Gumball and The Wonderfully Weird World of Gumball. No authentication required.",
    "resources": {
        "characters": "/characters",
        "locations": "/locations",
        "episodes": "/episodes",
        "seasons": "/seasons",
        "songs": "/songs",
        "games": "/games",
        "media": "/media"
    }
}
```

Each resource exposes the same four routes:

| Route                            | Description                             |
| -------------------------------- | --------------------------------------- |
| `GET /<resource>`                | Paginated list with filters and sorting |
| `GET /<resource>/:id`            | A single item by numeric id             |
| `GET /<resource>/slug/:slug`     | A single item by slug                   |
| `GET /<resource>/random?count=n` | `n` random items (default `1`)          |

Only `GET` is supported. Data is curated by the maintainer directly in the database.

## Usage

### Pagination

Lists accept `page` (starting at `1`) and `limit` (default `20`, max `100`):

```bash
curl "/characters?page=2&limit=10"
```

```json
{
    "data": [{ "id": 11, "slug": "...", "url": "/characters/11" }],
    "meta": {
        "page": 2,
        "limit": 10,
        "totalItems": 245,
        "totalPages": 25,
        "hasNextPage": true,
        "hasPreviousPage": true
    },
    "links": {
        "self": "/characters?page=2&limit=10",
        "first": "/characters?page=1&limit=10",
        "previous": "/characters?page=1&limit=10",
        "next": "/characters?page=3&limit=10",
        "last": "/characters?page=25&limit=10"
    }
}
```

Links are relative to the API base URL.

### Sorting

`sort` takes a field name for ascending order or `-field` for descending order. Empty values are always sorted last.

```bash
curl "/characters?sort=-name"
curl "/episodes?sort=usAirDate"
```

### Filtering

Filters can be combined. Enum values are kebab-case, text filters are case-sensitive exact matches unless stated otherwise, and `ids` takes a comma-separated list (`ids=1,2,3`).

| Resource     | Filters                                                                                                                                                                                                                                          | Sort fields                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `characters` | `search`, `species` (case-insensitive), `gender` (`male`, `female`, `other`, `unknown`), `role` (`main`, `supporting`, `minor`), `status` (`alive`, `deceased`, `undead`, `unknown`), `animationStyle`, `voiceActor`, `firstAppearanceId`, `ids` | `id`, `name`, `createdAt`, `updatedAt`                                        |
| `locations`  | `search`, `type`, `parentId`, `firstAppearanceId`, `ids`                                                                                                                                                                                         | `id`, `name`, `createdAt`, `updatedAt`                                        |
| `episodes`   | `search`, `series` (`amazing-world`, `wonderfully-weird-world`), `type`, `status`, `season`, `writer`, `storyboardArtist`, `airedFrom`, `airedTo` (`YYYY-MM-DD`), `ids`                                                                          | `id`, `title`, `overallNumber`, `usAirDate`, `createdAt`, `updatedAt`         |
| `seasons`    | `search`, `series`, `status` (`completed`, `airing`, `upcoming`), `ids`                                                                                                                                                                          | `id`, `number` (default), `title`, `usPremiereDate`, `createdAt`, `updatedAt` |
| `songs`      | `search`, `type` (`episode`, `theme`, `web`), `episodeId`, `season`, `characterId`, `vocalist`, `genre`, `ids`                                                                                                                                   | `id`, `title`, `durationSeconds`, `createdAt`, `updatedAt`                    |
| `games`      | `search`, `platform` (`web`, `mobile`, `roblox`, `voice-assistant`), `status` (`available`, `discontinued`, `unknown`), `developer`, `releaseYear`, `ids`                                                                                        | `id`, `title`, `releaseDate`, `createdAt`, `updatedAt`                        |
| `media`      | `search`, `type` (`tv-show`, `movie`, `comic`, `book`, `app`, `video-game`, `video`), `firstAppearanceId`, `ids`                                                                                                                                 | `id`, `title`, `createdAt`, `updatedAt`                                       |

`search` is a case-insensitive partial match on the name or title, and also on the full name for characters. Unknown query parameters are rejected with `400`.

### Related resources

Links between resources are returned as small reference objects, for example a character's first appearance:

```json
"firstAppearance": {
    "id": 1,
    "slug": "the-dvd",
    "title": "The DVD",
    "code": "S01E01",
    "url": "/episodes/1"
}
```

### Errors

Every error has the same shape:

```json
{
    "statusCode": 404,
    "error": "Not Found",
    "message": "Character with id 999 not found",
    "path": "/characters/999",
    "timestamp": "2026-10-01T12:00:00.000Z"
}
```

| Status | Meaning                             |
| ------ | ----------------------------------- |
| `400`  | Invalid id, slug or query parameter |
| `404`  | Item or route not found             |
| `429`  | Rate limit exceeded                 |
| `500`  | Unexpected server error             |

### Rate limiting and caching

Each IP can make 100 requests per minute. Responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset`.

Lists and single items are cacheable for 5 minutes (`Cache-Control: public, max-age=300`). Random routes are never cached.

## Development

### Stack

| Concern          | Choice                                                                        |
| ---------------- | ----------------------------------------------------------------------------- |
| Framework        | NestJS 12 (ESM, Express)                                                      |
| Database         | PostgreSQL on Supabase                                                        |
| ORM / migrations | Prisma 7 with the `pg` driver adapter                                         |
| Validation       | `class-validator` for requests, `zod` for environment variables               |
| Security         | Helmet, CORS (read-only methods), rate limiting, read-only database role, RLS |
| Observability    | `nestjs-pino` structured logs                                                 |
| Quality          | Vitest, oxlint, Prettier                                                      |
| Hosting          | Vercel Functions                                                              |

### Project structure

```
api/
└── index.js            Vercel Function entry point
public/                 static files served by Vercel
src/
├── main.ts             local HTTP server
├── serverless.ts       Vercel request handler
├── app.module.ts
├── bootstrap/          app factory, security middleware, CORS, validation, logger
├── config/             typed and validated environment variables
├── database/           PrismaService (global)
├── common/             pagination, sorting, validation, pipes, filters
├── generated/prisma/   generated Prisma Client (git-ignored)
└── modules/
    ├── root/           GET /
    ├── characters/
    ├── locations/
    ├── episodes/
    ├── seasons/
    ├── songs/
    ├── games/
    └── media/
prisma/
├── schema.prisma
└── migrations/
scripts/
├── bundle-serverless.ts
└── verify-database-security.ts
test/                   end-to-end tests and fixtures
```

Each resource module follows the same layering: controller → service → repository → mapper, with request and response DTOs. Prisma is only used inside repositories.

### Getting started

Requirements: Node.js 22.18+ and a Supabase project with the read-only `gumball_api_reader` role.

```bash
npm install
cp .env.example .env
npm run db:migrate:deploy
npm run db:verify-security
npm run start:dev
```

### Environment variables

| Variable                 | Required    | Default       | Description                                                                                                                    |
| ------------------------ | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`           | yes         |               | Runtime connection as the read-only `gumball_api_reader` role through the transaction pooler (port 6543).                      |
| `DATABASE_MIGRATION_URL` | CLI only    |               | Prisma CLI and security checks, as `postgres` through the session pooler (port 5432). Never set it in the runtime environment. |
| `DATABASE_SSL_CA`        | recommended |               | Supabase root CA (PEM). `\n` sequences are accepted for single-line values.                                                    |
| `DATABASE_POOL_MAX`      | no          | `10`          | Maximum connections per API instance. Use `2` on Vercel.                                                                       |
| `NODE_ENV`               | no          | `development` | `development`, `test` or `production`.                                                                                         |
| `PORT`                   | no          | `3000`        | HTTP port for the local server.                                                                                                |
| `LOG_LEVEL`              | no          | `info`        | Pino log level.                                                                                                                |
| `CORS_ORIGINS`           | no          | `*`           | `*` or a comma-separated list of origins.                                                                                      |
| `TRUST_PROXY_HOPS`       | no          | `0`           | Reverse proxies in front of the API. Use `1` on Vercel.                                                                        |
| `THROTTLE_TTL_MS`        | no          | `60000`       | Rate limit window.                                                                                                             |
| `THROTTLE_LIMIT`         | no          | `100`         | Requests allowed per window and IP.                                                                                            |

### Database security model

The API is read-only at every layer:

1. **HTTP**: only `GET` routes exist and CORS only allows `GET`, `HEAD` and `OPTIONS`.
2. **Grants**: `anon`, `authenticated` and `gumball_api_reader` only ever receive `SELECT`. Default privileges are revoked, so a new table is inaccessible until it is explicitly opened.
3. **Row Level Security**: every table has RLS enabled with a single `FOR SELECT` policy and no write policies.
4. **API role**: the API connects as `gumball_api_reader`, which cannot bypass RLS, runs transactions as read-only by default and has a 5 second statement timeout.

Every migration that creates a table must open it for reading with one line:

```sql
SELECT internal.apply_public_read_policy('public.<table>');
```

The function grants `SELECT`, enables RLS and creates the read policy. It lives in the `internal` schema, which public roles cannot reach.

Then run `npm run db:verify-security`. It audits grants, policies and RLS, and it attempts real writes as `anon`, `authenticated` and `gumball_api_reader`, failing if any of them succeeds.

### Deployment

The API runs as a single Vercel Function configured by `vercel.json`:

- `npm run build:vercel` compiles the app and bundles the NestJS packages into `dist/serverless.bundle.js`, because the Vercel runtime cannot `require()` ES modules from CommonJS dependencies.
- Every path is rewritten to `api/index.js`, which re-exports that bundle.
- The function runs in `gru1` (São Paulo), next to the database.

In the Vercel project, set the root directory to `server` and configure the runtime variables above with `NODE_ENV=production`, `DATABASE_POOL_MAX=2` and `TRUST_PROXY_HOPS=1`. Migrations are never run during deployment.

### Scripts

| Script                                                  | Description                                     |
| ------------------------------------------------------- | ----------------------------------------------- |
| `npm run start:dev`                                     | Start in watch mode                             |
| `npm run build` / `npm run start:prod`                  | Build and run the compiled app                  |
| `npm run build:vercel`                                  | Build the Vercel Function bundle                |
| `npm run lint` / `npm run format` / `npm run typecheck` | Code quality                                    |
| `npm test` / `npm run test:e2e` / `npm run test:cov`    | Tests                                           |
| `npm run db:migrate:dev`                                | Create a migration from `schema.prisma` changes |
| `npm run db:migrate:deploy`                             | Apply pending migrations                        |
| `npm run db:migrate:status`                             | Show migration status                           |
| `npm run db:verify-security`                            | Audit and test the database security rules      |

## Disclaimer

_The Amazing World of Gumball_ and its characters are trademarks of and © Warner Bros. Discovery. This is an unofficial fan project and is not affiliated with or endorsed by Warner Bros. Discovery or Cartoon Network. Descriptions are original writing; facts were researched from public fan sources.

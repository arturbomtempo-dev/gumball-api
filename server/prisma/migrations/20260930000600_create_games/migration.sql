CREATE TYPE "game_platform" AS ENUM ('WEB', 'MOBILE', 'ROBLOX', 'VOICE_ASSISTANT');

CREATE TYPE "game_status" AS ENUM ('AVAILABLE', 'DISCONTINUED', 'UNKNOWN');

CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "platforms" "game_platform"[] DEFAULT ARRAY[]::"game_platform"[],
    "status" "game_status" NOT NULL DEFAULT 'UNKNOWN',
    "release_date" DATE,
    "release_year" SMALLINT,
    "developers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "image_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "games_slug_format" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT "games_title_not_blank" CHECK (length(btrim("title")) > 0),
    CONSTRAINT "games_image_url_https" CHECK ("image_url" LIKE 'https://%'),
    CONSTRAINT "games_lists_not_null" CHECK ("platforms" IS NOT NULL AND "developers" IS NOT NULL),
    CONSTRAINT "games_release_year_range" CHECK ("release_year" IS NULL OR "release_year" BETWEEN 1990 AND 2100),
    CONSTRAINT "games_release_date_matches_year" CHECK ("release_date" IS NULL OR "release_year" = EXTRACT(YEAR FROM "release_date"))
);

CREATE UNIQUE INDEX "games_slug_key" ON "games"("slug");

CREATE INDEX "games_title_idx" ON "games"("title");

CREATE INDEX "games_status_idx" ON "games"("status");

CREATE INDEX "games_release_year_idx" ON "games"("release_year");

CREATE TRIGGER "games_set_updated_at"
BEFORE UPDATE ON "games"
FOR EACH ROW EXECUTE FUNCTION internal.set_updated_at();

SELECT internal.apply_public_read_policy('public.games');

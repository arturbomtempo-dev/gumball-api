CREATE TYPE "episode_series" AS ENUM ('AMAZING_WORLD', 'WONDERFULLY_WEIRD_WORLD');

CREATE TYPE "episode_type" AS ENUM ('EPISODE', 'SPECIAL', 'SHORT', 'PILOT', 'FILM');

CREATE TYPE "episode_status" AS ENUM ('RELEASED', 'UNRELEASED', 'SCRAPPED');

CREATE TABLE "episodes" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "series" "episode_series" NOT NULL DEFAULT 'AMAZING_WORLD',
    "type" "episode_type" NOT NULL DEFAULT 'EPISODE',
    "status" "episode_status" NOT NULL DEFAULT 'RELEASED',
    "season" SMALLINT,
    "episode_number" SMALLINT,
    "overall_number" SMALLINT,
    "production_code" VARCHAR(20),
    "us_air_date" DATE,
    "uk_air_date" DATE,
    "writers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "storyboard_artists" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "image_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "episodes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "episodes_slug_format" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT "episodes_title_not_blank" CHECK (length(btrim("title")) > 0),
    CONSTRAINT "episodes_image_url_https" CHECK ("image_url" LIKE 'https://%'),
    CONSTRAINT "episodes_season_positive" CHECK ("season" IS NULL OR "season" >= 1),
    CONSTRAINT "episodes_episode_number_positive" CHECK ("episode_number" IS NULL OR "episode_number" >= 1),
    CONSTRAINT "episodes_overall_number_positive" CHECK ("overall_number" IS NULL OR "overall_number" >= 1),
    CONSTRAINT "episodes_episode_number_requires_season" CHECK ("episode_number" IS NULL OR "season" IS NOT NULL),
    CONSTRAINT "episodes_production_code_format" CHECK ("production_code" IS NULL OR "production_code" ~ '^GB[0-9A-Z]+$'),
    CONSTRAINT "episodes_lists_not_null" CHECK ("writers" IS NOT NULL AND "storyboard_artists" IS NOT NULL)
);

CREATE UNIQUE INDEX "episodes_slug_key" ON "episodes"("slug");

CREATE UNIQUE INDEX "episodes_overall_number_key" ON "episodes"("overall_number");

CREATE UNIQUE INDEX "episodes_series_season_episode_number_key" ON "episodes"("series", "season", "episode_number");

CREATE INDEX "episodes_title_idx" ON "episodes"("title");

CREATE INDEX "episodes_type_idx" ON "episodes"("type");

CREATE INDEX "episodes_status_idx" ON "episodes"("status");

CREATE INDEX "episodes_season_idx" ON "episodes"("season");

CREATE INDEX "episodes_us_air_date_idx" ON "episodes"("us_air_date");

CREATE TRIGGER "episodes_set_updated_at"
BEFORE UPDATE ON "episodes"
FOR EACH ROW EXECUTE FUNCTION internal.set_updated_at();

SELECT internal.apply_public_read_policy('public.episodes');

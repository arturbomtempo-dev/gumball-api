CREATE TYPE "season_status" AS ENUM ('COMPLETED', 'AIRING', 'UPCOMING');

CREATE TABLE "seasons" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(40) NOT NULL,
    "number" SMALLINT NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "series" "episode_series" NOT NULL DEFAULT 'AMAZING_WORLD',
    "series_season_number" SMALLINT NOT NULL,
    "status" "season_status" NOT NULL DEFAULT 'UPCOMING',
    "episode_count" SMALLINT,
    "networks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "us_premiere_date" DATE,
    "us_finale_date" DATE,
    "uk_premiere_date" DATE,
    "uk_finale_date" DATE,
    "image_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "seasons_slug_format" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT "seasons_title_not_blank" CHECK (length(btrim("title")) > 0),
    CONSTRAINT "seasons_image_url_https" CHECK ("image_url" LIKE 'https://%'),
    CONSTRAINT "seasons_number_positive" CHECK ("number" >= 1),
    CONSTRAINT "seasons_series_season_number_positive" CHECK ("series_season_number" >= 1),
    CONSTRAINT "seasons_episode_count_non_negative" CHECK ("episode_count" IS NULL OR "episode_count" >= 0),
    CONSTRAINT "seasons_networks_not_null" CHECK ("networks" IS NOT NULL),
    CONSTRAINT "seasons_us_dates_ordered" CHECK ("us_finale_date" IS NULL OR "us_premiere_date" IS NULL OR "us_finale_date" >= "us_premiere_date"),
    CONSTRAINT "seasons_uk_dates_ordered" CHECK ("uk_finale_date" IS NULL OR "uk_premiere_date" IS NULL OR "uk_finale_date" >= "uk_premiere_date")
);

CREATE UNIQUE INDEX "seasons_slug_key" ON "seasons"("slug");

CREATE UNIQUE INDEX "seasons_number_key" ON "seasons"("number");

CREATE UNIQUE INDEX "seasons_series_series_season_number_key" ON "seasons"("series", "series_season_number");

CREATE INDEX "seasons_status_idx" ON "seasons"("status");

CREATE TRIGGER "seasons_set_updated_at"
BEFORE UPDATE ON "seasons"
FOR EACH ROW EXECUTE FUNCTION internal.set_updated_at();

SELECT internal.apply_public_read_policy('public.seasons');

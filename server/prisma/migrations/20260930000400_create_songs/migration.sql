CREATE TYPE "song_type" AS ENUM ('EPISODE', 'THEME', 'PROMO', 'WEB');

CREATE TABLE "songs" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "type" "song_type" NOT NULL DEFAULT 'EPISODE',
    "episode_id" INTEGER,
    "vocalists" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "duration_seconds" SMALLINT,
    "musical_key" VARCHAR(120),
    "image_url" VARCHAR(500),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "songs_slug_format" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT "songs_title_not_blank" CHECK (length(btrim("title")) > 0),
    CONSTRAINT "songs_image_url_https" CHECK ("image_url" IS NULL OR "image_url" LIKE 'https://%'),
    CONSTRAINT "songs_duration_positive" CHECK ("duration_seconds" IS NULL OR "duration_seconds" > 0),
    CONSTRAINT "songs_lists_not_null" CHECK ("vocalists" IS NOT NULL AND "genres" IS NOT NULL)
);

CREATE TABLE "song_characters" (
    "song_id" INTEGER NOT NULL,
    "character_id" INTEGER NOT NULL,

    CONSTRAINT "song_characters_pkey" PRIMARY KEY ("song_id","character_id")
);

CREATE UNIQUE INDEX "songs_slug_key" ON "songs"("slug");

CREATE INDEX "songs_title_idx" ON "songs"("title");

CREATE INDEX "songs_type_idx" ON "songs"("type");

CREATE INDEX "songs_episode_id_idx" ON "songs"("episode_id");

CREATE INDEX "song_characters_character_id_idx" ON "song_characters"("character_id");

ALTER TABLE "songs" ADD CONSTRAINT "songs_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "song_characters" ADD CONSTRAINT "song_characters_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "song_characters" ADD CONSTRAINT "song_characters_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TRIGGER "songs_set_updated_at"
BEFORE UPDATE ON "songs"
FOR EACH ROW EXECUTE FUNCTION internal.set_updated_at();

SELECT internal.apply_public_read_policy('public.songs');
SELECT internal.apply_public_read_policy('public.song_characters');

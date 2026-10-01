CREATE TYPE "media_type" AS ENUM ('TV_SHOW', 'MOVIE', 'COMIC', 'BOOK', 'APP', 'VIDEO_GAME', 'VIDEO');

CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "type" "media_type" NOT NULL,
    "parody_of" VARCHAR(200),
    "first_appearance_id" INTEGER,
    "image_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "media_slug_format" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT "media_title_not_blank" CHECK (length(btrim("title")) > 0),
    CONSTRAINT "media_parody_of_not_blank" CHECK ("parody_of" IS NULL OR length(btrim("parody_of")) > 0),
    CONSTRAINT "media_image_url_https" CHECK ("image_url" LIKE 'https://%')
);

CREATE UNIQUE INDEX "media_slug_key" ON "media"("slug");

CREATE INDEX "media_title_idx" ON "media"("title");

CREATE INDEX "media_type_idx" ON "media"("type");

CREATE INDEX "media_first_appearance_id_idx" ON "media"("first_appearance_id");

ALTER TABLE "media" ADD CONSTRAINT "media_first_appearance_id_fkey" FOREIGN KEY ("first_appearance_id") REFERENCES "episodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TRIGGER "media_set_updated_at"
BEFORE UPDATE ON "media"
FOR EACH ROW EXECUTE FUNCTION internal.set_updated_at();

SELECT internal.apply_public_read_policy('public.media');

CREATE TYPE "character_gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

CREATE TYPE "character_role" AS ENUM ('MAIN', 'SUPPORTING', 'MINOR');

CREATE TYPE "character_status" AS ENUM ('ALIVE', 'DECEASED', 'UNDEAD', 'UNKNOWN');

CREATE TYPE "animation_style" AS ENUM ('TWO_D', 'CGI', 'STOP_MOTION', 'PUPPET', 'LIVE_ACTION', 'MIXED_MEDIA', 'OTHER');

CREATE TABLE "characters" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "full_name" VARCHAR(200),
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "species" VARCHAR(80),
    "gender" "character_gender" NOT NULL DEFAULT 'UNKNOWN',
    "age" SMALLINT,
    "occupation" VARCHAR(200),
    "role" "character_role" NOT NULL DEFAULT 'MINOR',
    "status" "character_status" NOT NULL DEFAULT 'ALIVE',
    "animation_style" "animation_style" NOT NULL DEFAULT 'TWO_D',
    "voice_actors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "first_appearance" VARCHAR(200),
    "colors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "image_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "characters_slug_format" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT "characters_name_not_blank" CHECK (length(btrim("name")) > 0),
    CONSTRAINT "characters_age_non_negative" CHECK ("age" IS NULL OR "age" >= 0),
    CONSTRAINT "characters_image_url_https" CHECK ("image_url" LIKE 'https://%'),
    CONSTRAINT "characters_lists_not_null" CHECK ("aliases" IS NOT NULL AND "voice_actors" IS NOT NULL AND "colors" IS NOT NULL),
    CONSTRAINT "characters_colors_hex" CHECK (array_to_string("colors", ',') ~ '^(#[0-9a-f]{6}(,#[0-9a-f]{6})*)?$')
);

CREATE UNIQUE INDEX "characters_slug_key" ON "characters"("slug");

CREATE INDEX "characters_name_idx" ON "characters"("name");

CREATE INDEX "characters_species_idx" ON "characters"("species");

CREATE INDEX "characters_gender_idx" ON "characters"("gender");

CREATE INDEX "characters_role_idx" ON "characters"("role");

CREATE INDEX "characters_status_idx" ON "characters"("status");

CREATE INDEX "characters_animation_style_idx" ON "characters"("animation_style");

CREATE OR REPLACE FUNCTION internal.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION internal.set_updated_at() FROM PUBLIC, anon, authenticated, gumball_api_reader;

CREATE TRIGGER "characters_set_updated_at"
BEFORE UPDATE ON "characters"
FOR EACH ROW EXECUTE FUNCTION internal.set_updated_at();

SELECT internal.apply_public_read_policy('public.characters');

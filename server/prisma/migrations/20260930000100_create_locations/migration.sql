CREATE TYPE "location_type" AS ENUM ('TOWN', 'RESIDENCE', 'SCHOOL', 'SCHOOL_FACILITY', 'SHOP', 'RESTAURANT', 'BUSINESS', 'PUBLIC_SERVICE', 'LEISURE', 'TRANSPORT', 'NATURE', 'OTHER_REALM', 'OTHER');

CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "type" "location_type" NOT NULL DEFAULT 'OTHER',
    "parent_id" INTEGER,
    "first_appearance" VARCHAR(200),
    "image_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "locations_slug_format" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT "locations_name_not_blank" CHECK (length(btrim("name")) > 0),
    CONSTRAINT "locations_image_url_https" CHECK ("image_url" LIKE 'https://%'),
    CONSTRAINT "locations_not_own_parent" CHECK ("parent_id" IS NULL OR "parent_id" <> "id")
);

CREATE UNIQUE INDEX "locations_slug_key" ON "locations"("slug");

CREATE INDEX "locations_name_idx" ON "locations"("name");

CREATE INDEX "locations_type_idx" ON "locations"("type");

CREATE INDEX "locations_parent_id_idx" ON "locations"("parent_id");

ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION internal.prevent_location_cycle()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL AND EXISTS (
    WITH RECURSIVE ancestors(id, parent_id) AS (
      SELECT l.id, l.parent_id FROM public.locations l WHERE l.id = NEW.parent_id
      UNION
      SELECT l.id, l.parent_id FROM public.locations l JOIN ancestors a ON l.id = a.parent_id
    )
    SELECT 1 FROM ancestors WHERE id = NEW.id
  ) THEN
    RAISE EXCEPTION 'Location % cannot be placed inside one of its own descendants', NEW.id
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION internal.prevent_location_cycle() FROM PUBLIC, anon, authenticated, gumball_api_reader;

CREATE TRIGGER "locations_prevent_cycle"
BEFORE INSERT OR UPDATE OF "parent_id" ON "locations"
FOR EACH ROW EXECUTE FUNCTION internal.prevent_location_cycle();

CREATE TRIGGER "locations_set_updated_at"
BEFORE UPDATE ON "locations"
FOR EACH ROW EXECUTE FUNCTION internal.set_updated_at();

SELECT internal.apply_public_read_policy('public.locations');

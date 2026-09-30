ALTER TABLE "characters" ADD COLUMN "first_appearance_id" INTEGER;

ALTER TABLE "locations" ADD COLUMN "first_appearance_id" INTEGER;

UPDATE "characters" AS c
SET "first_appearance_id" = e."id"
FROM (
    SELECT DISTINCT ON (lower("title")) lower("title") AS "title", "id"
    FROM "episodes"
    ORDER BY lower("title"), ("status" = 'RELEASED') DESC, "id"
) AS e
WHERE e."title" = lower(btrim(c."first_appearance"));

UPDATE "locations" AS l
SET "first_appearance_id" = e."id"
FROM (
    SELECT DISTINCT ON (lower("title")) lower("title") AS "title", "id"
    FROM "episodes"
    ORDER BY lower("title"), ("status" = 'RELEASED') DESC, "id"
) AS e
WHERE e."title" = lower(btrim(l."first_appearance"));

DO $$
DECLARE
  unmatched_characters integer;
  unmatched_locations integer;
BEGIN
  SELECT count(*) INTO unmatched_characters FROM "characters"
  WHERE "first_appearance" IS NOT NULL AND "first_appearance_id" IS NULL;

  SELECT count(*) INTO unmatched_locations FROM "locations"
  WHERE "first_appearance" IS NOT NULL AND "first_appearance_id" IS NULL;

  IF unmatched_characters > 0 OR unmatched_locations > 0 THEN
    RAISE EXCEPTION 'first_appearance backfill left % characters and % locations without an episode', unmatched_characters, unmatched_locations;
  END IF;
END
$$;

ALTER TABLE "characters" DROP COLUMN "first_appearance";

ALTER TABLE "locations" DROP COLUMN "first_appearance";

CREATE INDEX "characters_first_appearance_id_idx" ON "characters"("first_appearance_id");

CREATE INDEX "locations_first_appearance_id_idx" ON "locations"("first_appearance_id");

ALTER TABLE "characters" ADD CONSTRAINT "characters_first_appearance_id_fkey" FOREIGN KEY ("first_appearance_id") REFERENCES "episodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "locations" ADD CONSTRAINT "locations_first_appearance_id_fkey" FOREIGN KEY ("first_appearance_id") REFERENCES "episodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

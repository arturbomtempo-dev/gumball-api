DELETE FROM "songs" WHERE "type" = 'PROMO';

ALTER TYPE "song_type" RENAME TO "song_type_old";

CREATE TYPE "song_type" AS ENUM ('EPISODE', 'THEME', 'WEB');

ALTER TABLE "songs"
    ALTER COLUMN "type" DROP DEFAULT,
    ALTER COLUMN "type" TYPE "song_type" USING ("type"::text::"song_type"),
    ALTER COLUMN "type" SET DEFAULT 'EPISODE';

DROP TYPE "song_type_old";

SELECT setval(pg_get_serial_sequence('songs', 'id'), COALESCE((SELECT max("id") FROM "songs"), 0) + 1, false);

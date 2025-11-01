/*
  Warnings:

  - The values [MINE_GOLD] on the enum `MissionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."MissionType_new" AS ENUM ('MEDITATION', 'SPIRIT_PATH', 'MINE', 'MINE_STONE');
ALTER TABLE "public"."missions" ALTER COLUMN "type" TYPE "public"."MissionType_new" USING ("type"::text::"public"."MissionType_new");
ALTER TYPE "public"."MissionType" RENAME TO "MissionType_old";
ALTER TYPE "public"."MissionType_new" RENAME TO "MissionType";
DROP TYPE "public"."MissionType_old";
COMMIT;

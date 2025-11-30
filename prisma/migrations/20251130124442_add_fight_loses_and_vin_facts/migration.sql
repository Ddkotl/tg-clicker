/*
  Warnings:

  - The values [FIGHT] on the enum `FactsType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FactsType_new" AS ENUM ('MEDITATION', 'MINE', 'SPIRIT_PATH', 'MISSION', 'FIGHTS_WIN', 'FIGHTS_LOSE');
ALTER TABLE "facts" ALTER COLUMN "type" TYPE "FactsType_new" USING ("type"::text::"FactsType_new");
ALTER TYPE "FactsType" RENAME TO "FactsType_old";
ALTER TYPE "FactsType_new" RENAME TO "FactsType";
DROP TYPE "public"."FactsType_old";
COMMIT;

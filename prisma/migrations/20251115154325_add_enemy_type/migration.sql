/*
  Warnings:

  - The values [NPC] on the enum `EnemyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EnemyType_new" AS ENUM ('DEMONIC_BEAST', 'PLAYER');
ALTER TABLE "public"."fights" ALTER COLUMN "enemyType" TYPE "public"."EnemyType_new" USING ("enemyType"::text::"public"."EnemyType_new");
ALTER TYPE "public"."EnemyType" RENAME TO "EnemyType_old";
ALTER TYPE "public"."EnemyType_new" RENAME TO "EnemyType";
DROP TYPE "public"."EnemyType_old";
COMMIT;

/*
  Warnings:

  - Made the column `enemyType` on table `fights` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."fights" ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "enemyType" SET NOT NULL,
ALTER COLUMN "fightLog" DROP NOT NULL;

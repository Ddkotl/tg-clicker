/*
  Warnings:

  - Added the required column `status` to the `Facts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."FactsStatus" AS ENUM ('CHECKED', 'NO_CHECKED');

-- AlterTable
ALTER TABLE "public"."Facts" ADD COLUMN     "status" "public"."FactsStatus" NOT NULL;

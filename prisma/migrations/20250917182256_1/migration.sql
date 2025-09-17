/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telegramId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telegram_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telegram_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."User_telegramId_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "telegramId",
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "language_code" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "photo_url" TEXT,
ADD COLUMN     "telegram_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_telegram_id_key" ON "public"."User"("telegram_id");

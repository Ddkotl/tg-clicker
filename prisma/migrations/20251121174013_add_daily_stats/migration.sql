/*
  Warnings:

  - You are about to drop the column `demonic_beasts_wins` on the `user_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `fights_loses` on the `user_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `loses` on the `user_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `pve_shadow_wins` on the `user_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `user_statistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_statistics" DROP COLUMN "demonic_beasts_wins",
DROP COLUMN "fights_loses",
DROP COLUMN "loses",
DROP COLUMN "pve_shadow_wins",
DROP COLUMN "wins";

-- CreateTable
CREATE TABLE "user_daily_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "meditated_hours" INTEGER NOT NULL DEFAULT 0,
    "spirit_path_minutes" INTEGER NOT NULL DEFAULT 0,
    "mined_qi_stone" INTEGER NOT NULL DEFAULT 0,
    "mined_count" INTEGER NOT NULL DEFAULT 0,
    "fights_total" INTEGER NOT NULL DEFAULT 0,
    "fights_wins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_stats_userId_key" ON "user_daily_stats"("userId");

-- CreateIndex
CREATE INDEX "user_daily_stats_date_idx" ON "user_daily_stats"("date");

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_stats_userId_date_key" ON "user_daily_stats"("userId", "date");

-- AddForeignKey
ALTER TABLE "user_daily_stats" ADD CONSTRAINT "user_daily_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

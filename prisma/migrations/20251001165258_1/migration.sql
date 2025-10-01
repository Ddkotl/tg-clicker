/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Fraktion" AS ENUM ('ADEPT', 'NOVICE');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "photo_url" TEXT,
    "language_code" TEXT,
    "allows_write_to_pm" BOOLEAN,
    "auth_date" TEXT,
    "referrerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "userId" TEXT NOT NULL,
    "fraktion" "public"."Fraktion",
    "nikname" TEXT,
    "gender" "public"."Gender",
    "color_theme" TEXT,
    "avatar_url" TEXT,
    "lvl" INTEGER NOT NULL DEFAULT 1,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "mana" INTEGER NOT NULL DEFAULT 100,
    "gold" INTEGER NOT NULL DEFAULT 50,
    "diamond" INTEGER NOT NULL DEFAULT 50,
    "fight" INTEGER NOT NULL DEFAULT 30,
    "last_fight_time" TIMESTAMP(3),
    "glory" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "public"."users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_nikname_key" ON "public"."Profile"("nikname");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

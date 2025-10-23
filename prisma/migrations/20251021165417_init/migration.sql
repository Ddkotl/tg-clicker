-- CreateEnum
CREATE TYPE "public"."FactsStatus" AS ENUM ('CHECKED', 'NO_CHECKED');

-- CreateEnum
CREATE TYPE "public"."FactsType" AS ENUM ('MEDITATION', 'MINE');

-- CreateEnum
CREATE TYPE "public"."Fraktion" AS ENUM ('ADEPT', 'NOVICE');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

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
CREATE TABLE "public"."profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fraktion" "public"."Fraktion",
    "nikname" TEXT,
    "gender" "public"."Gender",
    "color_theme" TEXT,
    "avatar_url" TEXT,
    "player_motto" TEXT,
    "lvl" INTEGER NOT NULL DEFAULT 1,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "mana" INTEGER NOT NULL DEFAULT 100,
    "gold" INTEGER NOT NULL DEFAULT 50,
    "diamond" INTEGER NOT NULL DEFAULT 50,
    "fight" INTEGER NOT NULL DEFAULT 30,
    "last_fight_time" TIMESTAMP(3),
    "glory" INTEGER NOT NULL DEFAULT 0,
    "power" INTEGER NOT NULL DEFAULT 1,
    "protection" INTEGER NOT NULL DEFAULT 1,
    "speed" INTEGER NOT NULL DEFAULT 1,
    "skill" INTEGER NOT NULL DEFAULT 1,
    "qi" INTEGER NOT NULL DEFAULT 1,
    "current_hitpoint" INTEGER NOT NULL DEFAULT 100,
    "max_hitpoint" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mines" (
    "userId" TEXT NOT NULL,
    "energy" INTEGER NOT NULL DEFAULT 50,
    "last_mine_at" TIMESTAMP(3),
    "last_energy_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."user_statistics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "loses" INTEGER NOT NULL DEFAULT 0,
    "meditated_hours" INTEGER NOT NULL DEFAULT 0,
    "mined_gold" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meditations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "on_meditation" BOOLEAN NOT NULL DEFAULT false,
    "start_meditation" TIMESTAMP(3),
    "meditation_hours" INTEGER,
    "meditation_revard" INTEGER,

    CONSTRAINT "meditations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."facts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."FactsType" NOT NULL,
    "status" "public"."FactsStatus" NOT NULL,
    "mana_reward" INTEGER,
    "exp_reward" INTEGER,
    "active_hours" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "public"."users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "public"."profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_nikname_key" ON "public"."profiles"("nikname");

-- CreateIndex
CREATE UNIQUE INDEX "mines_userId_key" ON "public"."mines"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_statistics_userId_key" ON "public"."user_statistics"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "meditations_userId_key" ON "public"."meditations"("userId");

-- CreateIndex
CREATE INDEX "facts_userId_idx" ON "public"."facts"("userId");

-- AddForeignKey
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mines" ADD CONSTRAINT "mines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_statistics" ADD CONSTRAINT "user_statistics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meditations" ADD CONSTRAINT "meditations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."facts" ADD CONSTRAINT "facts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

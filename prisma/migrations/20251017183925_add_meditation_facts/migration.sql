-- CreateEnum
CREATE TYPE "public"."FactsType" AS ENUM ('MEDITATION');

-- CreateTable
CREATE TABLE "public"."Facts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."FactsType" NOT NULL,
    "mana_reward" INTEGER,
    "exp_reward" INTEGER,
    "active_hours" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facts_pkey" PRIMARY KEY ("id")
);

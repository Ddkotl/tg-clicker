-- CreateEnum
CREATE TYPE "public"."MissionType" AS ENUM ('MEDITATION', 'SPIRIT_PATH', 'MINE', 'MINE_GOLD');

-- CreateTable
CREATE TABLE "public"."missions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."MissionType" NOT NULL,
    "description" TEXT NOT NULL,
    "reward_exp" INTEGER NOT NULL DEFAULT 0,
    "reward_qi" INTEGER NOT NULL DEFAULT 0,
    "reward_qi_stone" INTEGER NOT NULL DEFAULT 0,
    "reward_spirit_cristal" INTEGER NOT NULL DEFAULT 0,
    "reward_glory" INTEGER NOT NULL DEFAULT 0,
    "target_value" INTEGER NOT NULL DEFAULT 1,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."missions" ADD CONSTRAINT "missions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

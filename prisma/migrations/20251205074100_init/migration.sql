-- CreateEnum
CREATE TYPE "MissionTime" AS ENUM ('DAILY', 'PERMANENT');

-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('MEDITATION', 'SPIRIT_PATH', 'MINE', 'MINE_STONE', 'FIGHTS_WINS', 'ROBBERY_QI_ENERGY', 'GET_GLORY', 'DAMAGE', 'INVITE_FRIEND', 'SUBSCRIBE');

-- CreateEnum
CREATE TYPE "FactsStatus" AS ENUM ('CHECKED', 'NO_CHECKED');

-- CreateEnum
CREATE TYPE "FactsType" AS ENUM ('MEDITATION', 'MINE', 'SPIRIT_PATH', 'MISSION', 'FIGHTS_WIN', 'FIGHTS_LOSE');

-- CreateEnum
CREATE TYPE "Fraktion" AS ENUM ('ADEPT', 'NOVICE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "FightType" AS ENUM ('PVE', 'PVP');

-- CreateEnum
CREATE TYPE "EnemyType" AS ENUM ('DEMONIC_BEAST', 'PLAYER');

-- CreateEnum
CREATE TYPE "FightStatus" AS ENUM ('PENDING', 'FINISHED');

-- CreateEnum
CREATE TYPE "FightResult" AS ENUM ('WIN', 'LOSE', 'DRAW');

-- CreateTable
CREATE TABLE "users" (
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
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fraktion" "Fraktion",
    "nikname" TEXT,
    "gender" "Gender",
    "color_theme" TEXT,
    "avatar_url" TEXT,
    "player_motto" TEXT,
    "lvl" INTEGER NOT NULL DEFAULT 1,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "qi" INTEGER NOT NULL DEFAULT 100,
    "qi_stone" INTEGER NOT NULL DEFAULT 50,
    "spirit_cristal" INTEGER NOT NULL DEFAULT 50,
    "glory" INTEGER NOT NULL DEFAULT 0,
    "fight_charges" INTEGER NOT NULL DEFAULT 30,
    "last_charge_recovery" TIMESTAMP(3),
    "last_fight_time" TIMESTAMP(3),
    "power" INTEGER NOT NULL DEFAULT 1,
    "protection" INTEGER NOT NULL DEFAULT 1,
    "speed" INTEGER NOT NULL DEFAULT 1,
    "skill" INTEGER NOT NULL DEFAULT 1,
    "qi_param" INTEGER NOT NULL DEFAULT 1,
    "current_hitpoint" INTEGER NOT NULL DEFAULT 100,
    "max_hitpoint" INTEGER NOT NULL DEFAULT 100,
    "last_hp_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_qi_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_online_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "path" TEXT,
    "type" "MissionType" NOT NULL,
    "time" "MissionTime" NOT NULL,
    "reward_exp" INTEGER NOT NULL DEFAULT 0,
    "reward_qi" INTEGER NOT NULL DEFAULT 0,
    "reward_qi_stone" INTEGER NOT NULL DEFAULT 0,
    "reward_spirit_cristal" INTEGER NOT NULL DEFAULT 0,
    "reward_glory" INTEGER NOT NULL DEFAULT 0,
    "target_value" INTEGER NOT NULL DEFAULT 1,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mines" (
    "userId" TEXT NOT NULL,
    "energy" INTEGER NOT NULL DEFAULT 25,
    "last_mine_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_energy_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "user_statistics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "glory" INTEGER NOT NULL DEFAULT 0,
    "meditated_hours" INTEGER NOT NULL DEFAULT 0,
    "spirit_path_minutes" INTEGER NOT NULL DEFAULT 0,
    "mined_qi_stone" INTEGER NOT NULL DEFAULT 0,
    "mined_count" INTEGER NOT NULL DEFAULT 0,
    "fights_total" INTEGER NOT NULL DEFAULT 0,
    "fights_wins" INTEGER NOT NULL DEFAULT 0,
    "qi_looted" INTEGER NOT NULL DEFAULT 0,
    "qi_lost" INTEGER NOT NULL DEFAULT 0,
    "qi_stone_looted" INTEGER NOT NULL DEFAULT 0,
    "qi_stone_lost" INTEGER NOT NULL DEFAULT 0,
    "missions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "glory" INTEGER NOT NULL DEFAULT 0,
    "meditated_hours" INTEGER NOT NULL DEFAULT 0,
    "spirit_path_minutes" INTEGER NOT NULL DEFAULT 0,
    "mined_qi_stone" INTEGER NOT NULL DEFAULT 0,
    "mined_count" INTEGER NOT NULL DEFAULT 0,
    "fights_total" INTEGER NOT NULL DEFAULT 0,
    "fights_wins" INTEGER NOT NULL DEFAULT 0,
    "qi_looted" INTEGER NOT NULL DEFAULT 0,
    "qi_lost" INTEGER NOT NULL DEFAULT 0,
    "qi_stone_looted" INTEGER NOT NULL DEFAULT 0,
    "qi_stone_lost" INTEGER NOT NULL DEFAULT 0,
    "missions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_qi_skills" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "qi_veil" INTEGER NOT NULL DEFAULT 0,
    "seal_of_mind" INTEGER NOT NULL DEFAULT 0,
    "circulation_of_life" INTEGER NOT NULL DEFAULT 0,
    "spatial_vault" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_qi_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meditations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "on_meditation" BOOLEAN NOT NULL DEFAULT false,
    "start_meditation" TIMESTAMP(3),
    "meditation_hours" INTEGER,
    "meditation_revard" INTEGER,
    "canceled_meditated_dates" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[],

    CONSTRAINT "meditations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spirit_paths" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "on_spirit_paths" BOOLEAN NOT NULL DEFAULT false,
    "start_spirit_paths" TIMESTAMP(3),
    "spirit_paths_minutes" INTEGER,
    "spirit_paths_reward" INTEGER,
    "minutes_today" INTEGER NOT NULL DEFAULT 0,
    "date_today" TIMESTAMP(3),
    "canceled_paths_dates" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[],

    CONSTRAINT "spirit_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "FactsType" NOT NULL,
    "status" "FactsStatus" NOT NULL,
    "qi_reward" INTEGER,
    "qi_stone_reward" INTEGER,
    "spirit_cristal_reward" INTEGER,
    "exp_reward" INTEGER,
    "glory_reward" INTEGER,
    "active_hours" INTEGER,
    "active_minutes" INTEGER,
    "target_value" INTEGER,
    "mission_type" "MissionType",
    "fight_atacker_id" TEXT,
    "fight_defender_id" TEXT,
    "enemy_type" "EnemyType",
    "fight_id" TEXT,
    "fight_result" "FightResult",
    "fightLog" JSONB,
    "fight_rewards" JSONB,
    "fight_losses" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fights" (
    "id" TEXT NOT NULL,
    "attackerId" TEXT NOT NULL,
    "defenderId" TEXT,
    "type" "FightType" NOT NULL,
    "enemyType" "EnemyType" NOT NULL,
    "enemyNpcId" TEXT,
    "status" "FightStatus" NOT NULL,
    "result" "FightResult",
    "snapshot" JSONB NOT NULL,
    "fightLog" JSONB,
    "rewards" JSONB,
    "loses" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "fights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_nikname_key" ON "profiles"("nikname");

-- CreateIndex
CREATE UNIQUE INDEX "missions_userId_type_key" ON "missions"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "mines_userId_key" ON "mines"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_statistics_userId_key" ON "user_statistics"("userId");

-- CreateIndex
CREATE INDEX "user_statistics_userId_idx" ON "user_statistics"("userId");

-- CreateIndex
CREATE INDEX "user_daily_stats_date_idx" ON "user_daily_stats"("date");

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_stats_userId_date_key" ON "user_daily_stats"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "user_qi_skills_userId_key" ON "user_qi_skills"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "meditations_userId_key" ON "meditations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "spirit_paths_userId_key" ON "spirit_paths"("userId");

-- CreateIndex
CREATE INDEX "facts_userId_idx" ON "facts"("userId");

-- CreateIndex
CREATE INDEX "fights_attackerId_idx" ON "fights"("attackerId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mines" ADD CONSTRAINT "mines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_statistics" ADD CONSTRAINT "user_statistics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_stats" ADD CONSTRAINT "user_daily_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_qi_skills" ADD CONSTRAINT "user_qi_skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meditations" ADD CONSTRAINT "meditations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spirit_paths" ADD CONSTRAINT "spirit_paths_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facts" ADD CONSTRAINT "facts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fights" ADD CONSTRAINT "fights_attackerId_fkey" FOREIGN KEY ("attackerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fights" ADD CONSTRAINT "fights_defenderId_fkey" FOREIGN KEY ("defenderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

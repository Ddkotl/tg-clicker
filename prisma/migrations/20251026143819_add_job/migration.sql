/*
  Warnings:

  - Made the column `last_mine_at` on table `mines` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_energy_at` on table `mines` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."mines" ALTER COLUMN "last_mine_at" SET NOT NULL,
ALTER COLUMN "last_mine_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "last_energy_at" SET NOT NULL,
ALTER COLUMN "last_energy_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "on_job" BOOLEAN NOT NULL DEFAULT false,
    "start_job" TIMESTAMP(3),
    "job_hours" INTEGER,
    "job_revard" INTEGER,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jobs_userId_key" ON "public"."jobs"("userId");

-- AddForeignKey
ALTER TABLE "public"."jobs" ADD CONSTRAINT "jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."UserStatistic" ADD COLUMN     "meditation_hours_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."Meditation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "on_meditation" BOOLEAN NOT NULL DEFAULT false,
    "start_meditation" TIMESTAMP(3),
    "meditation_hours" INTEGER,

    CONSTRAINT "Meditation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Meditation_userId_key" ON "public"."Meditation"("userId");

-- AddForeignKey
ALTER TABLE "public"."Meditation" ADD CONSTRAINT "Meditation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

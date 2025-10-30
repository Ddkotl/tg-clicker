-- AlterTable
ALTER TABLE "public"."spirit_paths" ADD COLUMN     "date_today" TIMESTAMP(3),
ADD COLUMN     "minutes_today" INTEGER NOT NULL DEFAULT 0;

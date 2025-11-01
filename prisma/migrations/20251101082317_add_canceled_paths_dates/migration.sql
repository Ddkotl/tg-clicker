-- AlterTable
ALTER TABLE "public"."spirit_paths" ADD COLUMN     "canceled_paths_dates" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];

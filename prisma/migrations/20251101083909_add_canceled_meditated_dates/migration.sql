-- AlterTable
ALTER TABLE "public"."meditations" ADD COLUMN     "canceled_meditated_dates" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];

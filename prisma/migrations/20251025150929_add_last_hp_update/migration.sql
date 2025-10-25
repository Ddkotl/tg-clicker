-- AlterTable
ALTER TABLE "public"."profiles" ADD COLUMN     "last_hp_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

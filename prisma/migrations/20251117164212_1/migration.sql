-- AlterTable
ALTER TABLE "public"."fights" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."user_statistics" ADD COLUMN     "demonic_beasts_wins" INTEGER NOT NULL DEFAULT 0;

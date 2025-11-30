/*
  Warnings:

  - You are about to drop the column `rewards` on the `facts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "facts" DROP COLUMN "rewards",
ADD COLUMN     "fight_losses" JSONB,
ADD COLUMN     "fight_rewards" JSONB;

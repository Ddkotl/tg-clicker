/*
  Warnings:

  - A unique constraint covering the columns `[userId,type,chanel_id]` on the table `missions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "missions_userId_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "missions_userId_type_chanel_id_key" ON "missions"("userId", "type", "chanel_id");

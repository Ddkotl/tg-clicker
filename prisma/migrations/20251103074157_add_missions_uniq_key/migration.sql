/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `missions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "missions_userId_type_key" ON "public"."missions"("userId", "type");

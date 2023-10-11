/*
  Warnings:

  - A unique constraint covering the columns `[userId,happeningSlug]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Registration_userId_happeningSlug_key" ON "Registration"("userId", "happeningSlug");

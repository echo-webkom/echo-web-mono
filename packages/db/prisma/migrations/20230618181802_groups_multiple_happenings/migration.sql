/*
  Warnings:

  - You are about to drop the column `happeningSlug` on the `StudentGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentGroup" DROP CONSTRAINT "StudentGroup_happeningSlug_fkey";

-- DropIndex
DROP INDEX "Happening_type_idx";

-- AlterTable
ALTER TABLE "StudentGroup" DROP COLUMN "happeningSlug";

-- CreateTable
CREATE TABLE "_HappeningToStudentGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HappeningToStudentGroup_AB_unique" ON "_HappeningToStudentGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_HappeningToStudentGroup_B_index" ON "_HappeningToStudentGroup"("B");

-- CreateIndex
CREATE INDEX "Happening_type_date_idx" ON "Happening"("type", "date");

-- CreateIndex
CREATE INDEX "Question_happeningSlug_idx" ON "Question"("happeningSlug");

-- AddForeignKey
ALTER TABLE "_HappeningToStudentGroup" ADD CONSTRAINT "_HappeningToStudentGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Happening"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HappeningToStudentGroup" ADD CONSTRAINT "_HappeningToStudentGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `groups` on the `Happening` table. All the data in the column will be lost.
  - You are about to drop the column `studentGroups` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[minDegreeYear,maxDegreeYear,happeningSlug]` on the table `SpotRange` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'COMPANY', 'ADMIN');

-- AlterTable
ALTER TABLE "Happening" DROP COLUMN "groups";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "studentGroups",
ADD COLUMN     "studentGroupId" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "UserType" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Group";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "StudentGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "happeningSlug" TEXT,

    CONSTRAINT "StudentGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentGroupToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StudentGroupToUser_AB_unique" ON "_StudentGroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentGroupToUser_B_index" ON "_StudentGroupToUser"("B");

-- CreateIndex
CREATE INDEX "Happening_type_idx" ON "Happening"("type");

-- CreateIndex
CREATE INDEX "Registration_happeningSlug_idx" ON "Registration"("happeningSlug");

-- CreateIndex
CREATE UNIQUE INDEX "SpotRange_minDegreeYear_maxDegreeYear_happeningSlug_key" ON "SpotRange"("minDegreeYear", "maxDegreeYear", "happeningSlug");

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_happeningSlug_fkey" FOREIGN KEY ("happeningSlug") REFERENCES "Happening"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentGroupToUser" ADD CONSTRAINT "_StudentGroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "StudentGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentGroupToUser" ADD CONSTRAINT "_StudentGroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

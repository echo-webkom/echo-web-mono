/*
  Warnings:

  - You are about to drop the column `groups` on the `Happening` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `studentGroups` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'COMPANY', 'ADMIN');

-- AlterTable
ALTER TABLE "Happening" DROP COLUMN "groups";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
DROP COLUMN "studentGroups",
ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Group";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "StudentGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "StudentGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentGroupMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_StudentGroupLeader" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_HappeningToStudentGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StudentGroupMembers_AB_unique" ON "_StudentGroupMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentGroupMembers_B_index" ON "_StudentGroupMembers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentGroupLeader_AB_unique" ON "_StudentGroupLeader"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentGroupLeader_B_index" ON "_StudentGroupLeader"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HappeningToStudentGroup_AB_unique" ON "_HappeningToStudentGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_HappeningToStudentGroup_B_index" ON "_HappeningToStudentGroup"("B");

-- AddForeignKey
ALTER TABLE "_StudentGroupMembers" ADD CONSTRAINT "_StudentGroupMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "StudentGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentGroupMembers" ADD CONSTRAINT "_StudentGroupMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentGroupLeader" ADD CONSTRAINT "_StudentGroupLeader_A_fkey" FOREIGN KEY ("A") REFERENCES "StudentGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentGroupLeader" ADD CONSTRAINT "_StudentGroupLeader_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HappeningToStudentGroup" ADD CONSTRAINT "_HappeningToStudentGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Happening"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HappeningToStudentGroup" ADD CONSTRAINT "_HappeningToStudentGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

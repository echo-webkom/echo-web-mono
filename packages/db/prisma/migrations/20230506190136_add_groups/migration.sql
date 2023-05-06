/*
  Warnings:

  - You are about to drop the column `comment` on the `SiteFeedback` table. All the data in the column will be lost.
  - You are about to drop the `StudentGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StudentGroupToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Group" AS ENUM ('MAKERSPACE', 'BOARD', 'TILDE', 'GNIST', 'BEDKOM', 'ESC', 'HYGGKOM', 'WEBKOM', 'PROGBAR', 'SQUASH');

-- DropForeignKey
ALTER TABLE "_StudentGroupToUser" DROP CONSTRAINT "_StudentGroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentGroupToUser" DROP CONSTRAINT "_StudentGroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "Happening" ADD COLUMN     "groups" "Group"[];

-- AlterTable
ALTER TABLE "SiteFeedback" DROP COLUMN "comment";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "studentGroups" "Group"[];

-- DropTable
DROP TABLE "StudentGroup";

-- DropTable
DROP TABLE "_StudentGroupToUser";

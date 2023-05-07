-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'COMPANY', 'ADMIN');

-- CreateEnum
CREATE TYPE "Degree" AS ENUM ('DTEK', 'DSIK', 'DVIT', 'BINF', 'IMO', 'INF', 'PROG', 'DSC', 'ARMNINF', 'POST', 'MISC');

-- CreateEnum
CREATE TYPE "HappeningType" AS ENUM ('BEDPRES', 'EVENT');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'WAITLISTED', 'DEREGISTERED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'CHOICE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "alternativeEmail" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "degree" "Degree",
    "year" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "StudentGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotRange" (
    "id" TEXT NOT NULL,
    "minDegreeYear" INTEGER NOT NULL,
    "maxDegreeYear" INTEGER NOT NULL,
    "spots" INTEGER NOT NULL,
    "happeningSlug" TEXT,

    CONSTRAINT "SpotRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "userId" TEXT NOT NULL,
    "happeningSlug" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL,
    "type" "QuestionType" NOT NULL,
    "options" TEXT[],
    "happeningSlug" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Happening" (
    "slug" TEXT NOT NULL,
    "type" "HappeningType" NOT NULL,
    "date" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "registrationStart" TIMESTAMP(3),
    "registrationEnd" TIMESTAMP(3),

    CONSTRAINT "Happening_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "SiteFeedback" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "comment" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SiteFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentGroupToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_userId_happeningSlug_key" ON "Registration"("userId", "happeningSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Happening_slug_key" ON "Happening"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentGroupToUser_AB_unique" ON "_StudentGroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentGroupToUser_B_index" ON "_StudentGroupToUser"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotRange" ADD CONSTRAINT "SpotRange_happeningSlug_fkey" FOREIGN KEY ("happeningSlug") REFERENCES "Happening"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_happeningSlug_fkey" FOREIGN KEY ("happeningSlug") REFERENCES "Happening"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_happeningSlug_fkey" FOREIGN KEY ("happeningSlug") REFERENCES "Happening"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentGroupToUser" ADD CONSTRAINT "_StudentGroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "StudentGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentGroupToUser" ADD CONSTRAINT "_StudentGroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

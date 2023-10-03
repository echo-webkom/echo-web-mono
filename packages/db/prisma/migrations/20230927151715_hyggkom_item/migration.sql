-- CreateTable
CREATE TABLE "HyggkomItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "HyggkomItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HyggkomItem" ADD CONSTRAINT "HyggkomItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

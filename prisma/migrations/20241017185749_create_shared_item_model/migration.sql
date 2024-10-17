-- CreateEnum
CREATE TYPE "ShareType" AS ENUM ('FILE', 'FOLDER');

-- CreateTable
CREATE TABLE "SharedItem" (
    "id" SERIAL NOT NULL,
    "shareToken" TEXT NOT NULL,
    "type" "ShareType" NOT NULL,
    "fileId" INTEGER,
    "folderId" INTEGER,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedItem_shareToken_key" ON "SharedItem"("shareToken");

-- AddForeignKey
ALTER TABLE "SharedItem" ADD CONSTRAINT "SharedItem_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedItem" ADD CONSTRAINT "SharedItem_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

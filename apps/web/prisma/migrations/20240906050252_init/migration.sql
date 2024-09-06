/*
  Warnings:

  - You are about to drop the column `mint` on the `TokenMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TokenMetadata_mint_key";

-- DropIndex
DROP INDEX "User_publicKey_key";

-- AlterTable
ALTER TABLE "TokenMetadata" DROP COLUMN "mint";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "publicKey";

-- CreateIndex
CREATE INDEX "TokenMetadata_ownerId_idx" ON "TokenMetadata"("ownerId");

-- CreateIndex
CREATE INDEX "TokenMetadata_ownerId_updatedAt_idx" ON "TokenMetadata"("ownerId", "updatedAt");

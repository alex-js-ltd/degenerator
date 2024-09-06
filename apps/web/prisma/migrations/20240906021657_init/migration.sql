-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenMetadata" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "TokenMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TokenMetadata_ownerId_idx" ON "TokenMetadata"("ownerId");

-- CreateIndex
CREATE INDEX "TokenMetadata_ownerId_updatedAt_idx" ON "TokenMetadata"("ownerId", "updatedAt");

-- AddForeignKey
ALTER TABLE "TokenMetadata" ADD CONSTRAINT "TokenMetadata_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

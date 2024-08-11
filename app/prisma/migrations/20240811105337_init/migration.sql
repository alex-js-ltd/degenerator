-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenMetadata" (
    "id" TEXT NOT NULL,
    "mint" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "User_publicKey_key" ON "User"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "TokenMetadata_mint_key" ON "TokenMetadata"("mint");

-- AddForeignKey
ALTER TABLE "TokenMetadata" ADD CONSTRAINT "TokenMetadata_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

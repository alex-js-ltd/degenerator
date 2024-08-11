-- CreateTable
CREATE TABLE "TokenMetadata" (
    "id" TEXT NOT NULL,
    "mint" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenMetadata_pkey" PRIMARY KEY ("id")
);

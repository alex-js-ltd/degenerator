-- CreateTable
CREATE TABLE "TokenMetaData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,

    CONSTRAINT "TokenMetaData_pkey" PRIMARY KEY ("id")
);

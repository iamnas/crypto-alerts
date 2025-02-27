-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "targetPrice" DECIMAL(65,30) NOT NULL,
    "email" TEXT NOT NULL,
    "isTriggered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwapRate" (
    "id" TEXT NOT NULL,
    "ethAmount" DECIMAL(65,30) NOT NULL,
    "btcReceived" DECIMAL(65,30) NOT NULL,
    "feeEth" DECIMAL(65,30) NOT NULL,
    "feeUsd" DECIMAL(65,30) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SwapRate_pkey" PRIMARY KEY ("id")
);

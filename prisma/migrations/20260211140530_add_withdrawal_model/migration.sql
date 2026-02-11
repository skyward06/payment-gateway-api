-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'PROCESSING', 'BROADCAST', 'CONFIRMED', 'FAILED');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "isWithdrawn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "withdrawnAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "fee" BIGINT NOT NULL,
    "network" "PaymentNetwork" NOT NULL,
    "currency" "PaymentCurrency" NOT NULL,
    "txHash" TEXT,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "isManual" BOOLEAN NOT NULL DEFAULT false,
    "broadcastAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "withdrawals_merchantId_idx" ON "withdrawals"("merchantId");

-- CreateIndex
CREATE INDEX "withdrawals_paymentId_idx" ON "withdrawals"("paymentId");

-- CreateIndex
CREATE INDEX "withdrawals_status_idx" ON "withdrawals"("status");

-- CreateIndex
CREATE INDEX "withdrawals_txHash_idx" ON "withdrawals"("txHash");

-- CreateIndex
CREATE INDEX "payments_merchantId_isWithdrawn_idx" ON "payments"("merchantId", "isWithdrawn");

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

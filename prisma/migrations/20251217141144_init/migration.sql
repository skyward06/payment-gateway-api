-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MERCHANT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'DETECTED', 'CONFIRMING', 'UNDERPAID', 'OVERPAID', 'COMPLETED', 'EXPIRED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentNetwork" AS ENUM ('TXC', 'ETH', 'BASE', 'BSC', 'POLYGON');

-- CreateEnum
CREATE TYPE "PaymentCurrency" AS ENUM ('TXC', 'ETH', 'USDC', 'USDT');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "website" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "webhookUrl" TEXT,
    "webhookSecret" TEXT,
    "defaultExpirationMinutes" INTEGER NOT NULL DEFAULT 30,
    "autoConfirmations" INTEGER NOT NULL DEFAULT 1,
    "allowPartialPayments" BOOLEAN NOT NULL DEFAULT false,
    "collectCustomerEmail" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "description" TEXT,
    "permissions" TEXT[] DEFAULT ARRAY['payments:read', 'payments:create']::TEXT[],
    "allowedIPs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rateLimit" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "merchantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant_networks" (
    "id" TEXT NOT NULL,
    "network" "PaymentNetwork" NOT NULL,
    "currency" "PaymentCurrency" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "walletAddress" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchant_networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "amountRequested" BIGINT NOT NULL,
    "amountPaid" BIGINT NOT NULL DEFAULT 0,
    "fiatAmount" BIGINT,
    "fiatCurrency" TEXT DEFAULT 'USD',
    "exchangeRate" BIGINT,
    "network" "PaymentNetwork" NOT NULL,
    "currency" "PaymentCurrency" NOT NULL,
    "paymentAddress" TEXT NOT NULL,
    "paymentAddressPrivateKey" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "requiredConfirmations" INTEGER NOT NULL DEFAULT 1,
    "currentConfirmations" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "detectedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "customerEmail" TEXT,
    "customerName" TEXT,
    "metadata" JSONB,
    "successUrl" TEXT,
    "cancelUrl" TEXT,
    "merchantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "network" "PaymentNetwork" NOT NULL,
    "fromAddress" TEXT,
    "toAddress" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "confirmations" INTEGER NOT NULL DEFAULT 0,
    "blockNumber" BIGINT,
    "blockHash" TEXT,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMP(3),
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_logs" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "url" TEXT NOT NULL,
    "httpStatus" INTEGER,
    "response" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "nextRetryAt" TIMESTAMP(3),
    "merchantId" TEXT NOT NULL,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "merchants_email_key" ON "merchants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_publicKey_key" ON "api_keys"("publicKey");

-- CreateIndex
CREATE INDEX "api_keys_publicKey_idx" ON "api_keys"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "merchant_networks_merchantId_network_currency_key" ON "merchant_networks"("merchantId", "network", "currency");

-- CreateIndex
CREATE INDEX "payments_externalId_idx" ON "payments"("externalId");

-- CreateIndex
CREATE INDEX "payments_paymentAddress_idx" ON "payments"("paymentAddress");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_merchantId_status_idx" ON "payments"("merchantId", "status");

-- CreateIndex
CREATE INDEX "payments_expiresAt_idx" ON "payments"("expiresAt");

-- CreateIndex
CREATE INDEX "payment_transactions_paymentId_idx" ON "payment_transactions"("paymentId");

-- CreateIndex
CREATE INDEX "payment_transactions_txHash_idx" ON "payment_transactions"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_txHash_network_key" ON "payment_transactions"("txHash", "network");

-- CreateIndex
CREATE INDEX "webhook_logs_merchantId_isDelivered_idx" ON "webhook_logs"("merchantId", "isDelivered");

-- CreateIndex
CREATE INDEX "webhook_logs_nextRetryAt_idx" ON "webhook_logs"("nextRetryAt");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_networks" ADD CONSTRAINT "merchant_networks_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_logs" ADD CONSTRAINT "webhook_logs_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_logs" ADD CONSTRAINT "webhook_logs_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

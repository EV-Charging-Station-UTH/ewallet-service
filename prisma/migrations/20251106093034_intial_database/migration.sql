-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'PROCESSING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('PERSONAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TOPUP', 'WITHDRAWAL', 'PAYMENT', 'REFUND', 'P2P_TRANSFER_IN', 'P2P_TRANSFER_OUT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "IdempotencyStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('NATIONAL_ID', 'PASSPORT', 'DRIVER_LICENSE');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'CARD', 'QR_CODE', 'ATM');

-- CreateEnum
CREATE TYPE "BankVerifyStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED');

-- CreateTable
CREATE TABLE "kyc_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "id_number" VARCHAR(20) NOT NULL,
    "id_type" "IdType" NOT NULL,
    "id_front_image_url" TEXT,
    "id_back_image_url" TEXT,
    "selfie_image_url" TEXT,
    "verification_status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "verified_at" TIMESTAMP(3),
    "verified_by" VARCHAR(100),
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kyc_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_creation_requests" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "kyc_id" UUID NOT NULL,
    "request_status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "wallet_type" "WalletType" NOT NULL DEFAULT 'PERSONAL',
    "rejection_reason" TEXT,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_creation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "otp" TEXT NOT NULL,
    "wallet_number" VARCHAR(50) NOT NULL,
    "wallet_type" "WalletType" NOT NULL DEFAULT 'PERSONAL',
    "currency" VARCHAR(3) NOT NULL DEFAULT 'VND',
    "balance" BIGINT NOT NULL DEFAULT 0,
    "status" "WalletStatus" NOT NULL DEFAULT 'PENDING',
    "daily_limit" BIGINT DEFAULT 50000000,
    "monthly_limit" BIGINT DEFAULT 500000000,
    "activated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "transaction_ref" VARCHAR(100) NOT NULL,
    "wallet_id" UUID NOT NULL,
    "related_wallet_id" UUID,
    "transaction_type" "TransactionType" NOT NULL,
    "amount_bigint" BIGINT NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'VND',
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linked_bank_accounts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "bank_code" VARCHAR(20) NOT NULL,
    "account_number" VARCHAR(50) NOT NULL,
    "account_holder_name" VARCHAR(255) NOT NULL,
    "verification_status" "BankVerifyStatus" NOT NULL DEFAULT 'PENDING',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "linked_bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" UUID NOT NULL,
    "transaction_id" UUID NOT NULL,
    "wallet_id" UUID,
    "entry_type" "EntryType" NOT NULL,
    "amount_bigint" BIGINT NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'VND',
    "balance_before_bigint" BIGINT,
    "balance_after_bigint" BIGINT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "idempotency_key" VARCHAR(100) NOT NULL,
    "transaction_id" UUID,
    "request_hash" VARCHAR(64) NOT NULL,
    "response_data" JSONB,
    "status" "IdempotencyStatus" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("idempotency_key")
);

-- CreateTable
CREATE TABLE "external_payments" (
    "id" UUID NOT NULL,
    "transaction_id" UUID NOT NULL,
    "bank_account_id" UUID,
    "provider" VARCHAR(50) NOT NULL,
    "provider_transaction_id" VARCHAR(100),
    "payment_method" "PaymentMethod" NOT NULL,
    "amount_bigint" BIGINT NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'VND',
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "callback_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kyc_profiles_user_id_key" ON "kyc_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_profiles_id_number_key" ON "kyc_profiles"("id_number");

-- CreateIndex
CREATE INDEX "kyc_profiles_user_id_idx" ON "kyc_profiles"("user_id");

-- CreateIndex
CREATE INDEX "kyc_profiles_verification_status_idx" ON "kyc_profiles"("verification_status");

-- CreateIndex
CREATE INDEX "wallet_creation_requests_user_id_idx" ON "wallet_creation_requests"("user_id");

-- CreateIndex
CREATE INDEX "wallet_creation_requests_request_status_idx" ON "wallet_creation_requests"("request_status");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_wallet_number_key" ON "wallets"("wallet_number");

-- CreateIndex
CREATE INDEX "wallets_user_id_idx" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "wallets_status_idx" ON "wallets"("status");

-- CreateIndex
CREATE INDEX "wallets_wallet_number_idx" ON "wallets"("wallet_number");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_ref_key" ON "transactions"("transaction_ref");

-- CreateIndex
CREATE INDEX "transactions_wallet_id_idx" ON "transactions"("wallet_id");

-- CreateIndex
CREATE INDEX "transactions_related_wallet_id_idx" ON "transactions"("related_wallet_id");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_transaction_type_idx" ON "transactions"("transaction_type");

-- CreateIndex
CREATE INDEX "transactions_created_at_idx" ON "transactions"("created_at");

-- CreateIndex
CREATE INDEX "transactions_transaction_ref_idx" ON "transactions"("transaction_ref");

-- CreateIndex
CREATE INDEX "linked_bank_accounts_user_id_idx" ON "linked_bank_accounts"("user_id");

-- CreateIndex
CREATE INDEX "linked_bank_accounts_wallet_id_idx" ON "linked_bank_accounts"("wallet_id");

-- CreateIndex
CREATE INDEX "linked_bank_accounts_verification_status_idx" ON "linked_bank_accounts"("verification_status");

-- CreateIndex
CREATE INDEX "ledger_entries_transaction_id_idx" ON "ledger_entries"("transaction_id");

-- CreateIndex
CREATE INDEX "ledger_entries_wallet_id_idx" ON "ledger_entries"("wallet_id");

-- CreateIndex
CREATE INDEX "ledger_entries_entry_type_idx" ON "ledger_entries"("entry_type");

-- CreateIndex
CREATE INDEX "ledger_entries_created_at_idx" ON "ledger_entries"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_transaction_id_key" ON "idempotency_keys"("transaction_id");

-- CreateIndex
CREATE INDEX "idempotency_keys_transaction_id_idx" ON "idempotency_keys"("transaction_id");

-- CreateIndex
CREATE INDEX "idempotency_keys_status_idx" ON "idempotency_keys"("status");

-- CreateIndex
CREATE INDEX "idempotency_keys_expires_at_idx" ON "idempotency_keys"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "external_payments_transaction_id_key" ON "external_payments"("transaction_id");

-- CreateIndex
CREATE INDEX "external_payments_transaction_id_idx" ON "external_payments"("transaction_id");

-- CreateIndex
CREATE INDEX "external_payments_provider_idx" ON "external_payments"("provider");

-- CreateIndex
CREATE INDEX "external_payments_provider_transaction_id_idx" ON "external_payments"("provider_transaction_id");

-- CreateIndex
CREATE INDEX "external_payments_status_idx" ON "external_payments"("status");

-- AddForeignKey
ALTER TABLE "wallet_creation_requests" ADD CONSTRAINT "wallet_creation_requests_kyc_id_fkey" FOREIGN KEY ("kyc_id") REFERENCES "kyc_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_related_wallet_id_fkey" FOREIGN KEY ("related_wallet_id") REFERENCES "wallets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linked_bank_accounts" ADD CONSTRAINT "linked_bank_accounts_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idempotency_keys" ADD CONSTRAINT "idempotency_keys_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_payments" ADD CONSTRAINT "external_payments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_payments" ADD CONSTRAINT "external_payments_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "linked_bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

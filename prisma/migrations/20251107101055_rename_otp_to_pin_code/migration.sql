/*
  Warnings:

  - You are about to drop the column `otp` on the `wallets` table. All the data in the column will be lost.
  - Added the required column `pin_code` to the `wallets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "otp",
ADD COLUMN     "pin_code" TEXT NOT NULL;

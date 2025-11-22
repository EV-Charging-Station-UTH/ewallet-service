/*
  Warnings:

  - Changed the type of `session_id` on the `invoices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "session_id",
ADD COLUMN     "session_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "invoices_session_id_idx" ON "invoices"("session_id");

import { InvoiceStatus } from '@prisma/client';

export type CreateInvoiceType = {
  sessionId: string;
  userId: string;
  walletId: string;
  amountBigint: bigint;
  currency?: string; // default: 'VND'
  status?: InvoiceStatus; // default: InvoiceStatus.PENDING
  description?: string;
};

export type UpdateInvoiceType = {
  sessionId?: string;
  walletId?: string
  userId?: string;
  amountBigint?: string;
  currency?: string;
  status?: InvoiceStatus;
  description?: string;
  transactionId?: string;
};

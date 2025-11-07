import { IdempotencyStatus } from 'src/common/enums/wallet.enum';

export type CreateIdempotencyDataType = {
  idempotencyKey: string;
  transactionId?: string;
  requestHash: string;
  status: IdempotencyStatus;
  responseData?: Record<string, any>;
  expiresAt: Date;
};

export enum WalletStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum WalletType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
}

export const IdempotencyStatus = {
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type IdempotencyStatus =
  (typeof IdempotencyStatus)[keyof typeof IdempotencyStatus];

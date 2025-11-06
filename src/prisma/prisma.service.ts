import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Database disconnected');
  }

  /**
   * Execute a transaction with automatic retry on version conflict
   */
  async executeTransaction<T>(
    callback: (prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => Promise<T>,
    maxRetries = 3,
  ): Promise<T> {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        return await this.$transaction(callback);
      } catch (error) {
        attempt++;
        
        // Check if it's a version conflict (optimistic locking)
        if (error.code === 'P2034' || error.message?.includes('version')) {
          if (attempt < maxRetries) {
            console.warn(`Version conflict detected. Retry attempt ${attempt}/${maxRetries}`);
            await this.delay(100 * attempt); // Exponential backoff
            continue;
          }
        }
        
        throw error;
      }
    }

    throw new Error('Transaction failed after maximum retries');
  }

  /**
   * Clean up expired idempotency keys
   */
  async cleanupExpiredIdempotencyKeys(): Promise<number> {
    const result = await this.idempotencyKey.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        status: {
          in: ['COMPLETED', 'FAILED'],
        },
      },
    });

    return result.count;
  }

  /**
   * Verify ledger balance for a transaction
   */
  async verifyLedgerBalance(transactionId: string): Promise<boolean> {
    const entries = await this.ledgerEntry.findMany({
      where: { transactionId },
    });

    const debitSum = entries
      .filter(e => e.entryType === 'DEBIT')
      .reduce((sum, e) => sum + e.amountBigint, BigInt(0));

    const creditSum = entries
      .filter(e => e.entryType === 'CREDIT')
      .reduce((sum, e) => sum + e.amountBigint, BigInt(0));

    return debitSum === creditSum;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
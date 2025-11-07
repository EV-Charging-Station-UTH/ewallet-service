import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { IdempotencyRepository } from './idempotency.repository';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository, IdempotencyRepository],
  exports: [TransactionService, TransactionRepository, IdempotencyRepository],
})
export class TransactionModule {}

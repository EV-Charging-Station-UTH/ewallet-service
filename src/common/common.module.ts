import { Global, Module } from '@nestjs/common';
import { HashService } from './libs/hash/hash.service';
import { IdempotencyRepository } from './repositories/idempotency.repository';

@Global()
@Module({
  imports: [],
  providers: [HashService, IdempotencyRepository],
  exports: [HashService, IdempotencyRepository],
})
export class CommonModule {}

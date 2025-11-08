import { Global, Module } from '@nestjs/common';
import { HashService } from './libs/hash/hash.service';
import { IdempotencyRepository } from './repositories/idempotency.repository';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Global()
@Module({
  imports: [],
  providers: [HashService, IdempotencyRepository, RabbitmqModule],
  exports: [HashService, IdempotencyRepository, RabbitmqModule],
})
export class CommonModule {}

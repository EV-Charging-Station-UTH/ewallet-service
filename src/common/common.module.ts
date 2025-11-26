import { Global, Module } from '@nestjs/common';
import { HashService } from './libs/hash/hash.service';
import { IdempotencyRepository } from './repositories/idempotency.repository';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { KafkaModule } from './kafka/kafka.module';

@Global()
@Module({
  imports: [],
  providers: [
    HashService,
    IdempotencyRepository,
    RabbitmqModule,
    KafkaModule,
  ],
  exports: [
    HashService,
    IdempotencyRepository,
    RabbitmqModule,
    KafkaModule,
  ],
})
export class CommonModule {}

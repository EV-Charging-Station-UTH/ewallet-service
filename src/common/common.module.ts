import { Global, Module } from '@nestjs/common';
import { HashService } from './libs/hash/hash.service';
import { IdempotencyRepository } from './repositories/idempotency.repository';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { KafkaModule } from './kafka/kafka.module';
import { InvoiceRepository } from './repositories/invoice.repository';

@Global()
@Module({
  imports: [],
  providers: [
    HashService,
    IdempotencyRepository,
    InvoiceRepository,
    RabbitmqModule,
    KafkaModule,
  ],
  exports: [
    HashService,
    IdempotencyRepository,
    InvoiceRepository,
    RabbitmqModule,
    KafkaModule,
  ],
})
export class CommonModule {}

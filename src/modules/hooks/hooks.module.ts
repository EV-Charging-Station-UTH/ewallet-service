import { Module } from '@nestjs/common';
import { SepayConsumer } from './sepay.consumer';
import { HookController } from './hooks.controller';
import { PaymentService } from './payment.service';
import { SepayProducer } from './sepay.producer';
import { RabbitmqModule } from 'src/common/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  controllers: [HookController],
  providers: [PaymentService, SepayConsumer, SepayProducer],
  exports: [PaymentService, SepayConsumer, SepayProducer],
})
export class HooksModule {}

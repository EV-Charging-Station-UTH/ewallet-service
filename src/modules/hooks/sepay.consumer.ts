import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from 'src/common/rabbitmq/rabbitmq.service';
import { PaymentService } from './payment.service';

@Injectable()
export class SepayConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitmq: RabbitmqService,
    private readonly paymentService: PaymentService,
  ) {}

  async onModuleInit() {
    await this.rabbitmq.consume(
      'topup_queue',
      async (msg) => {
        await this.paymentService.receiver(msg);
      },
      'topup_exchange',
      'topup.webhook',
      'topic',
    );
  }
}

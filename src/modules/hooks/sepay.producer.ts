import { Injectable } from '@nestjs/common';
import { WebhookSepayBodyDto } from './dto/webhook-sepay-body.dto';
import { RabbitmqService } from 'src/common/rabbitmq/rabbitmq.service';

@Injectable()
export class SepayProducer {
  constructor(private readonly rabbitmq: RabbitmqService) {}

  async publishTopupEvent(body: WebhookSepayBodyDto) {
    await this.rabbitmq.publish('topup_exchange', 'topup.webhook', body, 'topic');
  }
}

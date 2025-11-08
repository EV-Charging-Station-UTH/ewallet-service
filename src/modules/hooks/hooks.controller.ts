import { Body, Controller, Post, Req } from '@nestjs/common';
import { WebhookSepayBodyDto } from './dto/webhook-sepay-body.dto';
import { SepayProducer } from './sepay.producer';

@Controller('hooks')
export class HookController {
  constructor(private readonly sepayProducer: SepayProducer) {}

  @Post('sepay-payment')
  receiver(@Body() body: WebhookSepayBodyDto) {
    return this.sepayProducer.publishTopupEvent(body);
  }
}

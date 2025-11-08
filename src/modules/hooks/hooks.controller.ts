import { Body, Controller, Post, Req } from '@nestjs/common';
import { WebhookSepayBodyDto } from './dto/webhook-sepay-body.dto';
import { SepayWebhookService } from './payment.service';

@Controller('hooks')
export class WebhookController {
  constructor(private readonly sepayWebhookService: SepayWebhookService) {}

  @Post('sepay-payment')
  receiver(@Body() body: WebhookSepayBodyDto) {
    return this.sepayWebhookService.receiver(body);
  }
}

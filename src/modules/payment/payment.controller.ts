import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import { ManualDto } from './dto/manual.dto';
import { PaymentService } from './payment.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { EventPaymentDto } from './dto/event-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('payment_events')

  // payment consumer
  async handleEventPayment(@Payload() message: EventPaymentDto) {
    switch (message.type) {
      case 'checkout':
        await this.paymentService.checkout(message.payload);
        console.log('checkout processed', message);
        return;

      case 'manual':
        await this.paymentService.manual(message.payload);
        console.log('manual processed', message);
        return;

      default:
        console.warn('Unknown event type', message);
        return null;
    }
  }

  @Post('checkout')
  checkout(@Body() body: CheckoutDto) {
    return this.paymentService.checkout({
      pinCode: body.pinCode,
      walletId: body.walletId,
      sessionId: body.sessionId,
      idempotencyKey: body.idempotencyKey,
      userId: body.userId,
    });
  }

  @Post('manual')
  manual(@Body() body: ManualDto, @Req() req) {
    const userId = req.user?.id;
    return this.paymentService.manual({ ...body, userId });
  }
}

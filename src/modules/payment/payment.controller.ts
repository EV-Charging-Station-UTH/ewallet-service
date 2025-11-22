import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { CheckoutDto } from './dtos/checkout.dto';
import { ManualDto } from './dtos/manual.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

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

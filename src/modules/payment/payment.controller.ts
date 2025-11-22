import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { CheckoutDto } from './dtos/checkout.dto';
import { ManualDto } from './dtos/manual.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  checkout(@Body() dto: CheckoutDto) {
    return this.paymentService.checkout(dto.sessionId);
  }

  @Post('manual')
  manual(@Body() dto: ManualDto) {
    return this.paymentService.checkout(dto.sessionId);
  }

  @Get('invoices')
  getInvoices(@Req() req) {
    const userId = req.user?.id;
    return this.paymentService.listInvoicesForUser(userId);
  }
}

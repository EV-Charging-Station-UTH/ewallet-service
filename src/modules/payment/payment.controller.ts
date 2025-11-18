import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { CheckoutDto } from '../dto/checkout.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  async checkout(@Body() dto: CheckoutDto) {
    return this.paymentService.checkout(dto.sessionId);
  }

  @Get('invoices')
  @UseGuards(JwtAuthGuard)
  async getInvoices(@Req() req) {
    const userId = req.user?.id;
    return this.paymentService.listInvoicesForUser(userId);
  }
}

import { Body, Controller, Post, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateTopupDto } from './dto/create-topup.dto';
import type { EventTransactionDto } from './dto/event-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly txService: TransactionService) {}

  // transaction consumer
  @EventPattern('transaction_events')
  async handleEventTransaction(@Payload() message: EventTransactionDto) {
    switch (message.type) {
      case 'transfer':
        await this.txService.transfer(message.payload);
        console.log('Transfer processed', message);
        return;

      case 'topup':
        await this.txService.topup(message.payload);
        console.log('Topup processed', message);
        return;

      default:
        console.warn('Unknown event type', message);
        return null;
    }
  }

  @Post('/transfer')
  async handleTransferRest(@Body() data: CreateTransferDto) {
    try {
      console.log('Transfer processed:', data.idempotencyKey);
      return await this.txService.transfer(data);
    } catch (err) {
      console.error('Transfer failed:', err.message);
      // Có thể push vào Dead-Letter Queue nếu cần
    }
  }
  @Post('/topup')
  topupRest(@Body() data: CreateTopupDto) {
    return this.txService.topup(data);
  }
}

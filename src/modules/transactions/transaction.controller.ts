import { Body, Controller, Post, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateTopupDto } from './dto/create-topup.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly txService: TransactionService) {}

  @EventPattern('transaction.transfer')
  async handleTransfer(@Payload() data: CreateTransferDto) {
    try {
      await this.txService.transfer(data);
      console.log('Transfer processed:', data.idempotencyKey);
    } catch (err) {
      console.error('Transfer failed:', err.message);
      // Có thể push vào Dead-Letter Queue nếu cần
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
  @EventPattern('transaction.topup')
  topup(@Payload() data: CreateTopupDto) {
    return this.txService.topup(data);
  }

  @Post('/topup')
  topupRest(@Body() data: CreateTopupDto) {
    return this.txService.topup(data);
  }
}

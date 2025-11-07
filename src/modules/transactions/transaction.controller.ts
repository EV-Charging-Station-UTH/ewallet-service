import { Body, Controller, Post, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly txService: TransactionService) {}

  @Post('transfer')
  transfer(@Body() dto: CreateTransferDto) {
    return this.txService.transfer(dto);
  }
}

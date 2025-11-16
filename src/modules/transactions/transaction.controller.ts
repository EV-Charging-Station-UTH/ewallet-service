import { Body, Controller, Post, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateTopupDto } from './dto/create-topup.dto';

@Controller()
export class TransactionController {
  constructor(private readonly txService: TransactionService) {}

  @EventPattern('transaction.transfer')
  transfer(@Payload() data: CreateTransferDto) {
    return this.txService.transfer(data);
  }
  @EventPattern('transaction.topup')
  topup(@Payload() data: CreateTopupDto) {
    return this.txService.topup(data);
  }
}

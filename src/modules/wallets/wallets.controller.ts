import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

class ChangeBalanceDto {
  walletId!: string;
  amount!: string;
  transactionId?: string;
  description?: string;
}

@ApiTags('wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly WalletsService: WalletsService) {}

  @Post()
  async create(@Body() body: CreateWalletDto) {
    const wallet = await this.WalletsService.create(body);
    return wallet;
  }

  // @Get(':id/balance')
  // async balance(@Param('id') id: string) {
  //   return this.service.getBalance(id);
  // }

  // @Get('by-number/:number')
  // async byNumber(@Param('number') number: string) {
  //   const w = await this.service.repo.findByWalletNumber(number);
  //   if (!w) return { data: null };
  //   return this.service['mapToResponse'](w);
  // }

  // // Credit wallet (top-up) — normally this would be called by Transaction Service after external payment success
  // @Post('credit')
  // @HttpCode(HttpStatus.OK)
  // async credit(@Body() body: ChangeBalanceDto) {
  //   return this.service.credit({
  //     walletId: body.walletId,
  //     amount: body.amount,
  //     transactionId: body.transactionId,
  //     description: body.description,
  //   });
  // }

  // // Debit wallet (charge) — normally used by Transaction Service
  // @Post('debit')
  // @HttpCode(HttpStatus.OK)
  // async debit(@Body() body: ChangeBalanceDto) {
  //   return this.service.debit({
  //     walletId: body.walletId,
  //     amount: body.amount,
  //     transactionId: body.transactionId,
  //     description: body.description,
  //   });
  // }
}

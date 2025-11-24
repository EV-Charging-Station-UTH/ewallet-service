import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { KycService } from './kyc.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { EventWalletDto } from './dto/event-wallet.dto';

@Controller('wallet')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly kycService: KycService,
  ) {}

  // wallet consumer
  @EventPattern('wallet_events')
  async handleEventWallet(@Payload() message: EventWalletDto) {
    switch (message.type) {
      case 'create_wallet':
        await this.walletsService.create(message.payload);
        console.log('create_wallet processed', message);
        return;

      case 'update_otp':
        await this.walletsService.updateOtp(message.payload);
        console.log('update_otp processed', message);
        return;
      case 'kyc_approve':
        await this.kycService.approveKyc(message.payload);
        console.log('kyc_approve processed', message);
        return;

      default:
        console.warn('Unknown event type', message);
        return null;
    }
  }

  @Get('kyc/:userId')
  getKycByUserId(@Param() param: { userId: string }) {
    return this.kycService.getKycByUserId(param.userId);
  }

  @Get('/:userId')
  getWallet(@Param() param: { userId: string }) {
    return this.walletsService.getWallet(param.userId);
  }
}

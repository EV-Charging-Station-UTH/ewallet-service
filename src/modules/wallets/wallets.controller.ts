import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletKycDto } from './dto/create-wallet-kyc.dto';
import { KycService } from './kyc.service';
import { ApproveKycDto } from './dto/approve-kyc.dto';
import { updatePinCodeDto } from './dto/update-otp.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('wallet')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly kycService: KycService,
  ) {}

  // ===== Wallet =====
  @EventPattern('wallet.create')
  createWallet(@Payload() data: CreateWalletKycDto) {
    return this.walletsService.createWalletKyc(data);
  }

  @Get('/:userId')
  getWallet(@Param() param: { userId: string }) {
    return this.walletsService.getWallet(param.userId);
  }

  @EventPattern('wallet.updateOtp')
  updateOTP(@Payload() data: { id: string } & updatePinCodeDto) {
    const { id, ...rest } = data;
    return this.walletsService.updateOtp({
      id: id,
      ...rest,
    });
  }

  // ===== KYC =====
  @EventPattern('kyc.approve')
  approveKyc(@Payload() approveKycDto: ApproveKycDto) {
    return this.kycService.approveKyc(approveKycDto);
  }

  @Get('kyc/:userId')
  getKycByUserId(@Param() param: { userId: string }) {
    return this.kycService.getKycByUserId(param.userId);
  }
}

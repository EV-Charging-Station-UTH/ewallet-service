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

  @EventPattern('wallet.findOne')
  getWallet(@Payload() data: { userId: string }) {
    return this.walletsService.getWallet(data.userId);
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

  @EventPattern('kyc.findOne')
  getKycByUserId(@Payload() data: { userId: string }) {
    return this.kycService.getKycByUserId(data.userId);
  }
}

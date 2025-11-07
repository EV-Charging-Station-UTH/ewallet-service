import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import {
  CreateWalletKycDto,
} from './dto/create-wallet-kyc.dto';
import { KycService } from './kyc.service';
import { ApproveKycDto } from './dto/approve-kyc.dto';
import { updatePinCodeDto } from './dto/update-otp.dto';

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly kycService: KycService,
  ) {}

  // ===== Wallet =====
  @Post()
  createWallet(@Body() body: CreateWalletKycDto) {
    return this.walletsService.createWalletKyc(body);
  }

  @Get('/:userId')
  getWallet(@Param('userId') userId: string) {
    return this.walletsService.getWallet(userId);
  }

  @Put('/:id/otp')
  updateOTP(@Param('id') id: string, @Body() body: updatePinCodeDto) {
    return this.walletsService.updateOtp({ id, ...body });
  }

  // ===== KYC =====
  @Post('/kyc/approve')
  approveKyc(@Body() approveKycDto: ApproveKycDto) {
    return this.kycService.approveKyc(approveKycDto);
  }

  @Get('/kyc/:userId')
  getKycByUserId(@Param('userId') userId: string) {
    return this.kycService.getKycByUserId(userId);
  }
}

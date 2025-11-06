// src/modules/kyc/kyc.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { KycService } from './kyc.service';
import { ApproveKycDto } from './dto/approve-kyc.dto';
import { SubmitKycDto } from './dto/submit-kyc.dto';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('submit')
  submitKyc(@Body() submitKycDto: SubmitKycDto) {
    return this.kycService.submitKyc(submitKycDto);
  }

  // Admin
  @Post('approve')
  approveKyc(@Body() approveKycDto: ApproveKycDto) {
    return this.kycService.approveKyc(approveKycDto);
  }

  // Admin
  @Get('user/:userId')
  getKycByUserId(@Param('userId') userId: string) {
    return this.kycService.getKycByUserId(userId);
  }
}

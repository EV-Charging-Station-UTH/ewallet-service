// src/modules/kyc/dtos/approve-kyc.dto.ts
import { IsString, IsEnum } from 'class-validator';
import { KycStatus } from '@prisma/client';

export class ApproveKycDto {
  @IsString()
  kycId: string;

  @IsEnum(KycStatus)
  verificationStatus: KycStatus;

  @IsString()
  verifiedBy: string;
}

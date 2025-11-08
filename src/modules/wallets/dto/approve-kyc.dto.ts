// src/modules/kyc/dtos/approve-kyc.dto.ts
import { IsString, IsEnum } from 'class-validator';
import { KycStatus } from 'src/common/enums/wallet.enum';

export class ApproveKycDto {
  @IsString()
  kycId: string;

  @IsEnum(KycStatus)
  verificationStatus: KycStatus;

  @IsString()
  verifiedBy: string;
}

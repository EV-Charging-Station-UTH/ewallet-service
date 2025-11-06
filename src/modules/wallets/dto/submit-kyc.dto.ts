// src/modules/kyc/dtos/submit-kyc.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class SubmitKycDto {
  @IsString()
  userId: string;

  @IsString()
  idNumber: string;

  @IsString()
  idType: string;

  @IsString()
  idFrontImageUrl: string;

  @IsString()
  idBackImageUrl: string;

  @IsString()
  selfieImageUrl: string;
}

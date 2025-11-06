import {
  IsOptional,
  IsString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { WalletType } from 'src/common/enums/wallet.enum';

export class CreateWalletKycDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNumber()
  otp: number;

  @IsNumber()
  confirmOtp: number;

  @IsEnum(WalletType)
  walletType: WalletType = WalletType.PERSONAL;

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

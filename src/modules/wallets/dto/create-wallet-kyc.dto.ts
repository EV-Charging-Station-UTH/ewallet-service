import {
  IsOptional,
  IsString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsEnum,
  Max,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';
import { WalletType } from 'src/common/enums/wallet.enum';

export class CreateWalletKycDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsInt()
  @Min(0)
  @Max(999999)
  pinCode: number;

  @IsInt()
  @Min(0)
  @Max(999999)
  confirmPinCode: number;

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

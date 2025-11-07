import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { WalletType } from 'src/common/enums/wallet.enum';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNumber()
  @Type(() => Number)
  pinCode!: number;

  @IsNumber()
  @Type(() => Number)
  confirmPinCode!: number;

  @IsEnum(WalletType)
  @Transform(({ value }) => value || WalletType.PERSONAL)
  walletType: WalletType;
}

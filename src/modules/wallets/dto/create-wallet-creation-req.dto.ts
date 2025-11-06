import { IsNotEmpty, IsString, IsUUID, IsEnum } from 'class-validator';
import { WalletType } from 'src/common/enums/wallet.enum';

export class CreateWalletCreationReqDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  kycId!: string;

  @IsEnum(WalletType)
  walletType!: WalletType;
}

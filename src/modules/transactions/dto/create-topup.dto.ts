import { IsUUID, IsString, IsInt, Min } from 'class-validator';

export class CreateTopupDto {
  @IsUUID()
  fromWalletId: string;

  @IsString()
  fromWalletNumber: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsInt()
  pinCode;

  @IsString()
  idempotencyKey: string;
}

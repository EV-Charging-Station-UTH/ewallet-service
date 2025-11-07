import { IsUUID, IsString, IsInt, Min } from 'class-validator';

export class CreateTransferDto {
  @IsUUID()
  fromWalletId: string;

  @IsString()
  fromWalletNumber: string;

  @IsString()
  toWalletNumber: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  description;

  @IsInt()
  pinCode;

  @IsString()
  idempotencyKey: string;
}

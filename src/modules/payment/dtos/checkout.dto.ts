import { IsInt, IsString, IsUUID, Max } from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsUUID()
  sessionId: string;

  @IsString()
  @IsUUID()
  idempotencyKey: string;

  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  @IsUUID()
  walletId: string;

  @IsInt()
  @Max(999999)
  pinCode;
}

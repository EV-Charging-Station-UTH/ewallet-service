import { IsOptional, IsString, IsIn, IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  userId!: string; // userId comes from external User Service

  @IsOptional()
  @IsString()
  currency?: string = 'VND';

  @IsOptional()
  @IsString()
  @IsIn(['PERSONAL', 'BUSINESS'])
  walletType?: 'PERSONAL' | 'BUSINESS' = 'PERSONAL';

  @IsOptional()
  @IsString()
  walletNumber?: string;
}

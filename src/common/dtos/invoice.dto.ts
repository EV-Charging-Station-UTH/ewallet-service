import {
  IsInt,
  IsUUID,
  IsOptional,
  IsString,
  IsEnum,
  IsNumberString,
  IsNotEmpty,
} from 'class-validator';
import { InvoiceStatus } from '@prisma/client';

export class CreateInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  sessionId: number;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  walletId: string;

  @IsNotEmpty()
  amountBigint: string;

  @IsString()
  @IsOptional()
  currency?: string = 'VND';

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus = InvoiceStatus.PENDING;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateInvoiceDto {
  @IsInt()
  @IsOptional()
  sessionId?: number;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  walletId?: string;

  @IsNumberString()
  @IsOptional()
  amountBigint?: string;

  @IsString()
  @IsOptional()
  currency?: string; // 'VND' / 'USD'

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  transactionId?: string;
}

import {
  IsString,
  IsOptional,
  IsObject,
  IsDate,
  IsEnum,
} from 'class-validator';
import { IdempotencyStatus } from 'src/common/enums/wallet.enum';

export class CreateIdempotencyDto {
  @IsString()
  idempotencyKey: string;

  @IsString()
  transactionId: string;

  @IsString()
  requestHash: string;

  @IsEnum(IdempotencyStatus)
  status: IdempotencyStatus;

  @IsObject()
  @IsOptional()
  responseData?: Record<string, any>;

  @IsDate()
  expiresAt: Date;
}

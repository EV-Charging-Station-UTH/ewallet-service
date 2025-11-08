import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class WebhookSepayBodyDto {
  @IsNumber()
  id: number;

  @IsString()
  gateway: string;

  @IsDateString()
  transactionDate: string;

  @IsString()
  @IsOptional()
  accountNumber: string | null;

  @IsString()
  @IsOptional()
  code: string | null;

  @IsString()
  @IsOptional()
  content: string | null;

  @IsEnum(['in', 'out'])
  transferType: 'in' | 'out';

  @IsNumber()
  transferAmount: number;

  @IsNumber()
  accumulated: number;

  @IsString()
  @IsOptional()
  subAccount: string | null;

  @IsString()
  @IsOptional()
  referenceCode: string | null;

  @IsString()
  description: string;
}

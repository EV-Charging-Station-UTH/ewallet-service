import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class updateOTPDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNumber()
  @Type(() => Number)
  otpOld!: number;

  @IsNumber()
  @Type(() => Number)
  newOtp!: number;

  @IsNumber()
  @Type(() => Number)
  comfirmNewOtp!: number;
}

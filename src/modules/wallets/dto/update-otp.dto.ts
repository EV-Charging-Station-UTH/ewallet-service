import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class updatePinCodeDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNumber()
  @Type(() => Number)
  pinCodeOld!: number;

  @IsNumber()
  @Type(() => Number)
  newPinCode!: number;

  @IsNumber()
  @Type(() => Number)
  comfirmNewPinCode!: number;
}

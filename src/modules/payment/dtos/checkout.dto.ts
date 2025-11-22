import {
  IsString,
  IsUUID,
} from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsUUID()
  sessionId: string;
}

import { IsNumber, IsString, IsUUID } from 'class-validator';

export class ManualDto {
  @IsString()
  @IsUUID()
  sessionId: string;

  @IsNumber()
  amount: number;
}

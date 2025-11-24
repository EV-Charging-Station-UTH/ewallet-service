import { BaseEventDto } from 'src/common/dto/base-event.dto';
import { CheckoutDto } from './checkout.dto';
import { ManualDto } from './manual.dto';
import { IsString, IsUUID } from 'class-validator';
class ManualConsumerDto extends ManualDto {
  @IsString()
  @IsUUID()
  userId: string;
}
export type EventPaymentMap = {
  checkout: CheckoutDto;
  manual: ManualConsumerDto;
};

export type EventPaymentDto = {
  [K in keyof EventPaymentMap]: BaseEventDto<K, EventPaymentMap[K]>;
}[keyof EventPaymentMap];

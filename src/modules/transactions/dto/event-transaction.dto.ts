import { BaseEventDto } from 'src/common/dto/base-event.dto';
import { CreateTransferDto } from './create-transfer.dto';
import { CreateTopupDto } from './create-topup.dto';

export type EventTransactionMap = {
  transfer: CreateTransferDto;
  topup: CreateTopupDto;
};

export type EventTransactionDto = {
  [K in keyof EventTransactionMap]: BaseEventDto<K, EventTransactionMap[K]>;
}[keyof EventTransactionMap];

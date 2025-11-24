import { BaseEventDto } from 'src/common/dto/base-event.dto';
import { ApproveKycDto } from './approve-kyc.dto';
import { CreateWalletKycDto } from './create-wallet-kyc.dto';
import { updatePinCodeDto } from './update-otp.dto';
import { IsString, IsUUID } from 'class-validator';

class updatePinCodeConsumnerDto extends updatePinCodeDto {
  @IsString()
  @IsUUID()
  id: string;
}

export type EventWalletMap = {
  create_wallet: CreateWalletKycDto;
  update_otp: updatePinCodeConsumnerDto;
  kyc_approve: ApproveKycDto;
};

export type EventWalletDto = {
  [K in keyof EventWalletMap]: BaseEventDto<K, EventWalletMap[K]>;
}[keyof EventWalletMap];

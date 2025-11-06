import { Injectable } from '@nestjs/common';
import { WalletsRepository } from './wallets.repository';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class WalletsService {
  constructor(private readonly walletsRepository: WalletsRepository) {}

  create(body: CreateWalletDto) {}
}

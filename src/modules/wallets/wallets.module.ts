import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { WalletsRepository } from './wallets.repository';
import { KycRepository } from './kyc.repository';
import { KycService } from './kyc.service';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService, WalletsRepository, KycRepository, KycService],
  exports: [WalletsService, WalletsRepository, KycRepository, KycService],
})
export class WalletsModule {}

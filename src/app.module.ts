import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletsModule } from './modules/wallets/wallets.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { CommonModule } from './common/common.module';
import { TransactionModule } from './modules/transactions/transaction.module';

@Module({
  imports: [
    WalletsModule,
    PrismaModule,
    WalletsModule,
    TransactionModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletsModule } from './modules/wallets/wallets.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { CommonModule } from './common/common.module';

@Module({
  imports: [WalletsModule, PrismaModule, WalletsModule, CommonModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

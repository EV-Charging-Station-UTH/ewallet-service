import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletsModule } from './modules/wallets/wallets.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { CommonModule } from './common/common.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { NotificationModule } from './modules/notifications/notifications.module';
import { FirebaseModule } from './firebase/firebase.module';
import { HooksModule } from './modules/hooks/hooks.module';
import { KafkaModule } from './common/kafka/kafka.module';
import { IdempotencyModule } from './modules/idempotency/idempotency.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    WalletsModule,
    PrismaModule,
    WalletsModule,
    TransactionModule,
    NotificationModule,
    HooksModule,
    CommonModule,
    IdempotencyModule,
    KafkaModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

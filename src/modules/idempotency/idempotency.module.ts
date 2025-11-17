import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { IdempotencyKeyService } from './idempotency.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [IdempotencyKeyService],
})
export class IdempotencyModule {}

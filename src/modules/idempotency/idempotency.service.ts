import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IdempotencyKeyService {
  private readonly logger = new Logger(IdempotencyKeyService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Cronjob run when every day at midnight to clean up expired idempotency keys
  @Cron('0 0 * * *')
  async handleCron() {
    this.logger.log('Starting cleanup of expired idempotency keys');

    const now = new Date();

    const deleted = await this.prisma.idempotencyKey.deleteMany({
      where: {
        expiresAt: { lt: now },
        status: { in: ['COMPLETED', 'FAILED'] },
      },
    });

    this.logger.log(`Deleted ${deleted.count} expired idempotency keys`);
  }
}

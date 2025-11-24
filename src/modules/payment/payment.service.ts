import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IdempotencyStatus } from 'src/common/enums/wallet.enum';
import { HashService } from 'src/common/libs/hash/hash.service';
import { IdempotencyRepository } from 'src/common/repositories/idempotency.repository';
import { PrismaService } from 'src/prisma/prisma.service';

type ManualBodyType = {
  sessionId: string;
  userId: string;
  amount: number;
};
@Injectable()
export class PaymentService {
  private readonly urlChargingService = process.env.URL_CHARGING_SERVICE;
  constructor(
    private readonly prisma: PrismaService,
    private readonly idempotencyRepository: IdempotencyRepository,
    private readonly hashService: HashService,
    private readonly http: HttpService,
  ) {}

  private async getDetailSession(sessionId: string) {
    try {
      return await this.http.axiosRef.get(
        `${this.urlChargingService}/sessions/${sessionId}`,
      );
    } catch (error) {
      throw new error();
    }
  }

  async checkout(data: {
    sessionId: string;
    idempotencyKey: string;
    userId: string;
    walletId: string;
    pinCode: number;
  }) {
    const { idempotencyKey, sessionId, walletId, pinCode } = data;
    if (!sessionId) {
      throw new BadRequestException('sessionId is required');
    }
    const response = await this.getDetailSession(sessionId);
    const session = response.data.data;

    if (!session) throw new NotFoundException('Session not found');

    if (session.status !== 'stop') throw new ForbiddenException();

    if (session.cost <= 0)
      throw new BadRequestException('Cost must be greater than 0');

    const existingIdempotencyKey =
      await this.idempotencyRepository.findUniqueIdempotencyKey({
        idempotencyKey,
      });
    if (existingIdempotencyKey) {
      if (existingIdempotencyKey.status === 'COMPLETED') {
        return existingIdempotencyKey.responseData;
      }
      if (existingIdempotencyKey.status === 'PROCESSING') {
        throw new BadRequestException('Transaction is processing');
      }
    }

    // hash req and create idempotency
    const reqHash = await this.hashService.hash(JSON.stringify(data));
    await this.idempotencyRepository.create({
      idempotencyKey,
      requestHash: reqHash,
      status: IdempotencyStatus.PROCESSING,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    });

    // Gọi charging-service để kiểm tra và lấy ra amount
    const amount = session.cost;

    try {
      // BEGIN
      const result = await this.prisma.$transaction(async (tx) => {
        // Lock wallets theo version để tránh race condition

        const sender = await tx.wallet.findUnique({
          where: { id: walletId },
        });

        if (!sender) throw new BadRequestException('Wallet not found');

        // Check pin code
        const isPinValid = await this.hashService.compare({
          hashed: sender.pinCode,
          plainText: String(pinCode),
        });
        if (!isPinValid) {
          throw new BadRequestException('Invalid PIN code');
        }

        if (sender.balance < amount)
          throw new BadRequestException('Insufficient balance');
        if (amount > sender.dailyLimit!)
          throw new BadRequestException('Exceeds daily limit');

        // STEP 4: Create transaction
        const transaction = await tx.transaction.create({
          data: {
            walletId: walletId,
            amountBigint: BigInt(amount),
            transactionType: 'PAYMENT',
            description: `Thanh toán trạm ${sessionId}`,
            status: 'PENDING',
          },
        });

        // Update sender (optimistic locking)
        await tx.wallet.update({
          where: {
            id: walletId,
            version: sender.version, // dùng version để lock
          },
          data: {
            balance: sender.balance - BigInt(amount),
            version: { increment: 1 },
          },
        });

        // STEP 5: Ledger entries
        await tx.ledgerEntry.create({
          data: {
            walletId: walletId,
            transactionId: transaction.id,
            entryType: 'DEBIT',
            amountBigint: BigInt(amount),
            currency: 'VND',
          },
        });

        // Update transaction status
        const completed = await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        });

        return completed;
      });

      // STEP 6: update idempotency → COMPLETED
      await this.prisma.idempotencyKey.update({
        where: { idempotencyKey },
        data: {
          status: 'COMPLETED',
          responseData: {},
        },
      });

      return {
        message: 'Checkout success',
      };
    } catch (error) {
      // if Error => rollback
      await this.idempotencyRepository.update({
        idempotencyKey,
        status: 'FAILED',
      });
      console.log('ERROR', error);
      throw error;
    }
  }

  async manual(data: ManualBodyType) {
    const { amount, sessionId } = data;
    try {
      if (!sessionId) {
        throw new BadRequestException('sessionId is required');
      }

      const response = await this.getDetailSession(sessionId);
      const session = response.data.data;

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      const { status, cost } = session;

      if (status !== 'stop') {
        throw new ForbiddenException('Session is not stopped');
      }

      if (cost <= 0) {
        throw new BadRequestException('Cost must be greater than 0');
      }

      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }

      if (cost !== amount) {
        throw new BadRequestException('Amount does not match session cost');
      }

      return {
        message: 'Manual payment created – waiting for admin approval',
      };
    } catch (error) {
      throw new error();
    }
  }
}

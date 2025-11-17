// src/modules/kyc/kyc.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IdempotencyRepository } from '../../common/repositories/idempotency.repository';
import { TransactionRepository } from './transaction.repository';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { HashService } from 'src/common/libs/hash/hash.service';
import { IdempotencyStatus } from 'src/common/enums/wallet.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTopupDto } from './dto/create-topup.dto';
import { generateTransactionCode } from 'src/common/helpers/generate-transaction-code';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly idempotencyRepository: IdempotencyRepository,
    private readonly hashService: HashService,
    private prisma: PrismaService,
  ) {}

  async transfer(data: CreateTransferDto) {
    const {
      amount,
      fromWalletId,
      fromWalletNumber,
      idempotencyKey,
      pinCode,
      toWalletNumber,
      description,
    } = data;
    // STEP 1. Kiểm tra idempotencyKey đã tồn tại chưa
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

    try {
      // BEGIN
      const result = await this.prisma.$transaction(async (tx) => {
        // Lock wallets theo version để tránh race condition

        const sender = await tx.wallet.findUnique({
          where: { id: fromWalletId },
        });
        const receiver = await tx.wallet.findUnique({
          where: { walletNumber: toWalletNumber },
        });

        if (!sender || !receiver)
          throw new BadRequestException('Wallet not found');

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
            walletId: fromWalletId,
            relatedWalletId: receiver.id,
            amountBigint: BigInt(amount),
            transactionType: 'P2P_TRANSFER_OUT',
            description,
            status: 'PENDING',
          },
        });

        // Update sender (optimistic locking)
        await tx.wallet.update({
          where: {
            id: fromWalletId,
            version: sender.version, // dùng version để lock
          },
          data: {
            balance: sender.balance - BigInt(amount),
            version: { increment: 1 },
          },
        });

        // Update receiver
        await tx.wallet.update({
          where: {
            id: receiver.id,
            version: receiver.version,
          },
          data: {
            balance: receiver.balance + BigInt(amount),
            version: { increment: 1 },
          },
        });

        // STEP 5: Ledger entries
        await tx.ledgerEntry.createMany({
          data: [
            {
              walletId: fromWalletId,
              transactionId: transaction.id,
              entryType: 'DEBIT',
              amountBigint: BigInt(amount),
              currency: 'VND',
            },
            {
              walletId: receiver.id,
              transactionId: transaction.id,
              entryType: 'CREDIT',
              amountBigint: BigInt(amount),
              currency: 'VND',
            },
          ],
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

      // COMMIT
      console.log('RESULT TRANSFER', result);
      return {
        message: `${fromWalletNumber} transfer to ${toWalletNumber} with ${amount} VND`,
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

  async topup(data: CreateTopupDto) {
    const { amount, fromWalletId, fromWalletNumber, pinCode, idempotencyKey } =
      data;
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
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    const transactionCode = generateTransactionCode();
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const sender = await tx.wallet.findUnique({
          where: { id: fromWalletId },
        });
        if (!sender) throw new BadRequestException('Wallet not found');
        const isPinValid = await this.hashService.compare({
          hashed: sender.pinCode,
          plainText: String(pinCode),
        });
        if (!isPinValid) {
          throw new BadRequestException('Invalid PIN code');
        }

        const transaction = await tx.transaction.create({
          data: {
            walletId: fromWalletId,
            transactionRef: transactionCode,
            amountBigint: BigInt(amount),
            transactionType: 'TOPUP',
            description: `Top up wallet from default source with ${transactionCode}`,
            status: 'PENDING',
          },
        });

        await this.prisma.idempotencyKey.update({
          where: { idempotencyKey },
          data: {
            transactionId: transaction.id,
          },
        });
      });
      return {
        data: {
          qrCode: `https://qr.sepay.vn/img?acc=22012051822&bank=MBBank&amount=${amount}&des=${transactionCode}`,
          transactionCode,
        },
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
}

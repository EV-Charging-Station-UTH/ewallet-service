import { BadRequestException, Injectable } from '@nestjs/common';
import { WebhookSepayBodyDto } from './dto/webhook-sepay-body.dto';
import { parse } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { IdempotencyRepository } from 'src/common/repositories/idempotency.repository';

@Injectable()
export class SepayWebhookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly idempotencyRepository: IdempotencyRepository,
  ) {}

  async receiver(body: WebhookSepayBodyDto) {
    const {
      transferType,
      transferAmount,
      code,
      gateway,
      transactionDate,
      accountNumber,
      subAccount,
      accumulated,
      content,
      referenceCode,
      description,
    } = body;

    // Validate
    if (!code) throw new BadRequestException('Missing transaction code');

    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionRef: code },
    });
    if (!transaction) throw new BadRequestException('Transaction not found');

    // Determine transfer direction
    const isInbound = transferType === 'in';
    const amountIn = isInbound ? transferAmount : 0;
    const amountOut = isInbound ? 0 : transferAmount;

    // Handle in a single DB transaction for atomicity
    try {
      await this.prisma.$transaction(async (tx) => {
        // Save payment transaction record
        await tx.paymentTransaction.create({
          data: {
            id: body.id,
            gateway,
            transactionDate: parse(
              transactionDate,
              'yyyy-MM-dd HH:mm:ss',
              new Date(),
            ),
            accountNumber,
            subAccount,
            amountIn,
            amountOut,
            accumulated,
            code,
            transactionContent: content,
            referenceNumber: referenceCode,
            body: description,
          },
        });

        // Save external payment record
        await tx.externalPayment.create({
          data: {
            transactionId: transaction.id,
            provider: gateway,
            providerTransactionId: referenceCode,
            paymentMethod: 'BANK_TRANSFER',
            amountBigint: amountIn,
            currency: 'VND',
            status: 'COMPLETED',
            callbackData: JSON.stringify(body),
          },
        });
        await tx.idempotencyKey.update({
          where: {
            transactionId: transaction.id,
          },
          data: {
            status: 'COMPLETED',
          },
        });
        const walletSender = await tx.wallet.findUnique({
          where: {
            id: transaction.walletId,
          },
        });
        if (!walletSender) {
          throw new BadRequestException('wallet not found');
        }
        await tx.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: 'COMPLETED',
          },
        });
        await tx.ledgerEntry.create({
          data: {
            walletId: transaction.walletId,
            transactionId: transaction.id,
            entryType: 'DEBIT',
            amountBigint: BigInt(amountIn),
            currency: 'VND',
            balanceBeforeBigint: walletSender.balance,
            balanceAfterBigint: walletSender.balance + BigInt(amountIn),
          },
        });
        // Update wallet balance (only if inbound)
        if (isInbound && amountIn > 0) {
          await tx.wallet.update({
            where: { id: transaction.walletId },
            data: {
              balance: { increment: amountIn },
              version: { increment: 1 },
            },
          });
        }
      });

      return { message: 'Webhook processed successfully' };
    } catch (error) {
      await this.prisma.idempotencyKey.update({
        where: {
          transactionId: transaction.id,
        },
        data: {
          status: 'FAILED',
        },
      });
      await this.prisma.transaction.update({
        where: {
          id: transaction.id,
        },
        data: {
          status: 'FAILED',
        },
      });
      console.log('ERROR', error);
      throw error;
    }
  }
}

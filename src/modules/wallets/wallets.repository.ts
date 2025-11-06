import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createWallet(data: {
    userId: string;
    walletNumber?: string;
    currency?: string;
    walletType?: 'PERSONAL' | 'BUSINESS';
  }) {
    const walletNumber =
      data.walletNumber ??
      `WAL-${Date.now()}-${randomBytes(4).toString('hex')}`;

    return this.prisma.wallet.create({
      data: {
        userId: BigInt(data.userId),
        walletNumber,
        currency: data.currency ?? 'VND',
        walletType: data.walletType ?? 'PERSONAL',
        status: 'ACTIVE',
        activatedAt: new Date(),
      },
    });
  }

  findByWalletNumber(walletNumber: string) {
    return this.prisma.wallet.findFirst({
      where: { walletNumber },
    });
  }
}

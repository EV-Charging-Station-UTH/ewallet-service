import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createWallet(data: {
    userId: string;
    walletNumber: string;
    otp: string;
    walletType?: 'PERSONAL' | 'BUSINESS';
  }) {
    const walletNumber = `WAL-${Date.now()}-${randomBytes(4).toString('hex')}`;

    return this.prisma.wallet.create({
      data: {
        userId: data.userId,
        otp: '2121',
        walletNumber,
        currency: 'VND',
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

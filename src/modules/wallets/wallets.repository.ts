import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWalletCreationReqDto } from './dto/create-wallet-creation-req.dto';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { WalletStatus, WalletType } from 'src/common/enums/wallet.enum';

type WalletUpdateData = Partial<{
  id: string;
  otp: string;
  walletType: WalletType;
  currency: string;
  status: WalletStatus;
  activatedAt: Date;
}>;
@Injectable()
export class WalletsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createWallet(data: {
    userId: string;
    walletNumber: string;
    otp: string;
    walletType?: WalletType;
  }) {
    return this.prisma.wallet.create({
      data: {
        id: uuidv4(),
        userId: data.userId,
        otp: data.otp,
        walletNumber: data.walletNumber,
        currency: 'VND',
        walletType: data.walletType ?? 'PERSONAL',
        status: 'ACTIVE',
        activatedAt: new Date(),
      },
    });
  }

  update(data: WalletUpdateData) {
    const { id, ...rest } = data;
    return this.prisma.wallet.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
  }

  createWalletCreationReq(data: CreateWalletCreationReqDto) {
    const { kycId, userId, walletType } = data;
    return this.prisma.walletCreationRequest.create({
      data: {
        id: uuidv4(),
        userId,
        kycId,
        requestStatus: 'PENDING',
        walletType,
      },
    });
  }

  findUniqueWallet(where: Prisma.WalletWhereUniqueInput) {
    return this.prisma.wallet.findUnique({
      where,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import {  Prisma } from '@prisma/client';
import { ApproveKycDto } from './dto/approve-kyc.dto';
import { v4 as uuidv4 } from 'uuid';
import { KycStatus } from 'src/common/enums/wallet.enum';

@Injectable()
export class KycRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: SubmitKycDto) {
    const {
      userId,
      idNumber,
      idType,
      idFrontImageUrl,
      idBackImageUrl,
      selfieImageUrl,
    } = dto;
    return this.prisma.kycProfile.create({
      data: {
        id: uuidv4(),
        userId,
        idNumber,
        idType: 'NATIONAL_ID',
        idFrontImageUrl,
        idBackImageUrl,
        selfieImageUrl,
        verificationStatus: KycStatus.PENDING,
      },
    });
  }

  findUniqueKyc(where: Prisma.KycProfileWhereUniqueInput) {
    return this.prisma.kycProfile.findUnique({ where });
  }

  update(dto: ApproveKycDto) {
    const { kycId, verificationStatus, verifiedBy } = dto;
    return this.prisma.kycProfile.update({
      where: { id: kycId },
      data: {
        verificationStatus,
        verifiedBy,
        verifiedAt: new Date(),
      },
    });
  }
}

// src/modules/kyc/kyc.service.ts
import { Injectable } from '@nestjs/common';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ApproveKycDto } from './dto/approve-kyc.dto';
import { KycRepository } from './kyc.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KycService {
  constructor(private readonly kycRepository: KycRepository) {}

  async submitKyc(dto: SubmitKycDto) {
    const { userId, idNumber } = dto;
    console.log(uuidv4())
    

    const [existingKycIdNumber, existingKycUserId] = await Promise.all([
      this.kycRepository.findUniqueKyc({ idNumber }),
      this.kycRepository.findUniqueKyc({ userId }),
    ]);

    if (existingKycUserId) {
      throw new Error('KYC profile already exists for this user');
    }

    if (existingKycIdNumber) {
      throw new Error('KYC idNumber already exists for this user');
    }

    return await this.kycRepository.create(dto);
  }

  async approveKyc(dto: ApproveKycDto) {
    const { kycId } = dto;

    const kycProfile = await this.kycRepository.findUniqueKyc({
      id: kycId,
      verificationStatus: 'PENDING',
    });

    if (!kycProfile) {
      throw new Error('KYC profile not found');
    }

    return await this.kycRepository.update(dto);
  }

  async getKycByUserId(userId: string) {
    return await this.kycRepository.findUniqueKyc({ userId });
  }
}

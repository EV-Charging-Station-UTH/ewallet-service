import { Injectable } from '@nestjs/common';
import { WalletsRepository } from './wallets.repository';
import { CreateWalletKycDto } from './dto/create-wallet-kyc.dto';
import { HashService } from 'src/common/libs/hash/hash.service';
import { randomBytes } from 'crypto';
import { updateOTPDto } from './dto/update-otp.dto';
import { KycService } from './kyc.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class WalletsService {
  constructor(
    private readonly walletsRepository: WalletsRepository,
    private readonly kycService: KycService,
    private readonly hashService: HashService,
  ) {}

  private async generateUniqueWalletNumber() {
    let walletNumber: string;
    let exists = true;

    while (exists) {
      walletNumber = `WAL-${Date.now()}-${randomBytes(4).toString('hex')}`;

      const walletNumberExist = await this.walletsRepository.findUniqueWallet({
        walletNumber,
      });

      if (!walletNumberExist) {
        exists = false;
      }
    }

    return walletNumber!;
  }

  async create(body: CreateWalletDto) {
    const { otp, confirmOtp, userId, walletType } = body;
    if (otp !== confirmOtp) {
      throw new Error("OTP don't match!");
    }
    const otpHash = await this.hashService.hash(String(otp));
    const walletNumber = await this.generateUniqueWalletNumber();

    return await this.walletsRepository.createWallet({
      otp: otpHash,
      walletNumber,
      userId,
      walletType,
    });
  }

  async createWalletKyc(body: CreateWalletKycDto) {
    const {
      confirmOtp,
      idBackImageUrl,
      idFrontImageUrl,
      idNumber,
      idType,
      otp,
      selfieImageUrl,
      userId,
      walletType,
    } = body;
    const [kyc, _] = await Promise.all([
      this.kycService.submitKyc({
        idBackImageUrl,
        idFrontImageUrl,
        idNumber,
        idType,
        selfieImageUrl,
        userId,
      }),
      this.create({
        confirmOtp,
        otp,
        userId,
        walletType,
      }),
    ]);
    await this.walletsRepository.createWalletCreationReq({
      kycId: kyc.id,
      userId,
      walletType,
    });

    return {
      message: 'Create wallet succfully!',
    };
  }

  async getWallet(userId: string) {
    return await this.walletsRepository.findUniqueWallet({ userId });
  }

  async updateOtp(body: updateOTPDto & { id: string }) {
    const { id, comfirmNewOtp, newOtp, otpOld, userId } = body;
    const walletExit = await this.walletsRepository.findUniqueWallet({ id });
    if (!walletExit) {
      throw new Error('Wallet not found!');
    }
    if (newOtp !== comfirmNewOtp) {
      throw new Error("OTP and confirm OTP don't match!");
    }
    const oldOtpDecode = await this.hashService.compare({
      hashed: walletExit.otp,
      plainText: String(otpOld),
    });
    if (!oldOtpDecode) {
      throw new Error("OTP don't match!");
    }
    const otpHash = await this.hashService.hash(String(newOtp));
    await this.walletsRepository.update({
      id,
      otp: otpHash,
    });
    return {
      message: "Update OTP wallet successfully"
    }
  }
}

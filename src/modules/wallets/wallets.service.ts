import { BadRequestException, Injectable } from '@nestjs/common';
import { WalletsRepository } from './wallets.repository';
import { CreateWalletKycDto } from './dto/create-wallet-kyc.dto';
import { HashService } from 'src/common/libs/hash/hash.service';
import { randomBytes } from 'crypto';
import { KycService } from './kyc.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { updatePinCodeDto } from './dto/update-otp.dto';

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
      const bytes = randomBytes(8);
      const num = BigInt('0x' + bytes.toString('hex'))
        .toString()
        .slice(0, 12);
      walletNumber = `WAL-${num}`;

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
    const { confirmPinCode, pinCode, userId, walletType } = body;
    if (pinCode !== confirmPinCode) {
      throw new Error("OTP don't match!");
    }
    const pinCodeHash = await this.hashService.hash(String(pinCode));
    const walletNumber = await this.generateUniqueWalletNumber();

    return await this.walletsRepository.createWallet({
      pinCode: pinCodeHash,
      walletNumber,
      userId,
      walletType,
    });
  }

  async createWalletKyc(body: CreateWalletKycDto) {
    try {
      const {
        confirmPinCode,
        pinCode,
        idBackImageUrl,
        idFrontImageUrl,
        idNumber,
        idType,
        selfieImageUrl,
        userId,
        walletType,
      } = body;

      // Gửi KYC
      const kyc = await this.kycService.submitKyc({
        idBackImageUrl,
        idFrontImageUrl,
        idNumber,
        idType,
        selfieImageUrl,
        userId,
      });

      // Tạo wallet (đã check duplicate)
      const wallet = await this.create({
        confirmPinCode,
        pinCode,
        userId,
        walletType,
      });

      // Ghi log tạo wallet
      await this.walletsRepository.createWalletCreationReq({
        kycId: kyc.id,
        userId,
        walletType,
      });

      return {
        message: 'Create wallet successfully!',
        walletId: wallet.id,
      };
    } catch (err) {
      console.error('[createWalletKyc] Error:', err);
      throw new BadRequestException(err.message || 'Failed to create wallet');
    }
  }

  async getWallet(userId: string) {
    return await this.walletsRepository.findUniqueWallet({ userId });
  }

  async updateOtp(body: updatePinCodeDto & { id: string }) {
    const { id, comfirmNewPinCode, newPinCode, pinCodeOld } = body;
    const walletExit = await this.walletsRepository.findUniqueWallet({ id });
    if (!walletExit) {
      throw new Error('Wallet not found!');
    }
    if (newPinCode !== comfirmNewPinCode) {
      throw new Error("OTP and confirm OTP don't match!");
    }
    const oldOtpDecode = await this.hashService.compare({
      hashed: walletExit.pinCode,
      plainText: String(pinCodeOld),
    });
    if (!oldOtpDecode) {
      throw new Error("OTP don't match!");
    }
    const otpHash = await this.hashService.hash(String(newPinCode));
    await this.walletsRepository.update({
      id,
      otp: otpHash,
    });
    return {
      message: 'Update OTP wallet successfully',
    };
  }
}

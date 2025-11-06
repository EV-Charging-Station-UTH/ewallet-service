export class WalletResponseDto {
  id!: string;
  userId!: string;
  walletNumber!: string;
  currency!: string;
  balance!: string;
  status!: string;
  walletType!: string;
  createdAt!: Date;
  activatedAt?: Date | null;
}

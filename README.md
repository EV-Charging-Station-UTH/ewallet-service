<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description 📜

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. This microservice is responsible for core financial functions, handling **Wallet**, **KYC (Know Your Customer)**, and **Transaction** operations via **Kafka**.

---

## Kafka Microservice Topics Guide

External services should use the following Kafka topics to communicate with this service. All message payloads must be sent as **JSON**.

### 1. Wallet Operations (`WalletsController`)

| Topic | Description | Expected Payload (DTO) | Controller Method |
| :--- | :--- | :--- | :--- |
| `wallet.create` | Creates a new Wallet and initial KYC record for a user. | `CreateWalletKycDto` | `createWallet` |
| `wallet.findOne` | Retrieves detailed Wallet information based on the user ID. | `{ "userId": string }` | `getWallet` |
| `wallet.updateOtp` | Updates the Wallet's PIN/OTP code. | `{ "id": string } & updatePinCodeDto` | `updateOTP` |

### 2. KYC Operations (`WalletsController`)

| Topic | Description | Expected Payload (DTO) | Controller Method |
| :--- | :--- | :--- | :--- |
| `kyc.approve` | Approves the user's KYC status. | `ApproveKycDto` | `approveKyc` |
| `kyc.findOne` | Retrieves detailed KYC information based on the user ID. | `{ "userId": string }` | `getKycByUserId` |

### 3. Transaction Operations (`TransactionController`)

| Topic | Description | Expected Payload (DTO) | Controller Method |
| :--- | :--- | :--- | :--- |
| `transaction.transfer` | Executes a money transfer transaction. | `CreateTransferDto` | `transfer` |
| `transaction.topup` | Executes a top-up/deposit transaction. | `CreateTransferDto` | `topup` |

### 4. Notification Outgoing Event (Producer)

This service **produces** events to the Notification service. This topic is consumed by the external Notification service.

| Topic | Description | Payload Structure |
| :--- | :--- | :--- |
| `notifications.device` | Request to send a push notification to a specific device. | `{ "token": string; "title": string; "body": string }` |

---

### 5. DTO
#### CreateWalletKycDto

```typescript
{
  userId: string; // UUID
  pinCode: number; // 0-999999
  confirmPinCode: number; // 0-999999
  walletType?: WalletType; // default: PERSONAL enum: PERSONAL | BUSINESS
  idNumber: string;
  idType: string;
  idFrontImageUrl: string;
  idBackImageUrl: string;
  selfieImageUrl: string;
}
```

#### updatePinCodeDto
```typescript
{
  userId: string;         // UUID
  pinCodeOld: number;
  newPinCode: number;
  comfirmNewPinCode: number;
}
```

#### ApproveKycDto
```typescript
// KycStatus {
// PENDING = 'PENDING',
// APPROVED = 'APPROVED',
// REJECTED = 'REJECTED',
// }
{
  kycId: string;
  verificationStatus: KycStatus;
  verifiedBy: string;
}
```

#### CreateTransferDto
```typescript
{
  fromWalletId: string;        // UUID
  fromWalletNumber: string;
  toWalletNumber: string;
  amount: number;              // integer >= 1
  description: string;
  pinCode: number;             // integer
  idempotencyKey: string;
}
```

#### CreateTopupDto
```typescript
{
  fromWalletId: string;        // UUID
  fromWalletNumber: string;
  amount: number;              // integer, min 1
  pinCode: number;             // integer
  idempotencyKey: string;
}
```


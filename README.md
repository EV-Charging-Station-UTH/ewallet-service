
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


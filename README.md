
---

## Kafka Microservice Topics Guide

External services should use the following Kafka topics to communicate with this service. All message payloads must be sent as **JSON**.

### 1. Wallet Operations (`WalletsController`)

#### Topic (`wallet_events`)

**Create Wallet Example:**
```json
{
  "type": "create_wallet",
  "payload": {
    "userId": "uuid",
    "pinCode": 123456,
    "confirmPinCode": 123456,
    "walletType": "PERSONAL",
    "idNumber": "123456789",
    "idType": "CCCD",
    "idFrontImageUrl": "url",
    "idBackImageUrl": "url",
    "selfieImageUrl": "url"
  }
}
```

**Update OTP Example:**
```json
{
  "type": "update_otp",
  "payload": {
    "id": "uuid",
    "userId": "uuid",
    "pinCodeOld": 123456,
    "newPinCode": 654321,
    "comfirmNewPinCode": 654321
  }
}
```

**KYC Approve Example:**
```json
{
  "type": "kyc_approve",
  "payload": {
    "kycId": "uuid",
    "verificationStatus": "APPROVED",
    "verifiedBy": "admin-uuid"
  }
}
```

### 2. Payment Operations (`PaymentController`)

#### Topic (`payment_events`)

**Checkout Example:**
```json
{
  "type": "checkout",
  "payload": {
    "sessionId": "uuid",
    "idempotencyKey": "uuid",
    "userId": "uuid",
    "walletId": "uuid",
    "pinCode": 123456
  }
}
```

**Manual Payment Example:**
```json
{
  "type": "manual",
  "payload": {
    "sessionId": "uuid",
    "amount": 50000,
    "userId": "uuid"
  }
}
```

### 3. Transaction Operations (`TransactionController`)

#### Topic (`transaction_events`)

**Transfer Example:**
```json
{
  "type": "transfer",
  "payload": {
    "fromWalletId": "uuid",
    "toWalletNumber": "0987654321",
    "amount": 50000,
    "description": "Chuyen tien",
    "pinCode": 123456,
    "idempotencyKey": "unique-key"
  }
}
```

**Topup Example:**
```json
{
  "type": "topup",
  "payload": {
    "fromWalletId": "uuid",
    "amount": 100000,
    "pinCode": 123456,
    "idempotencyKey": "unique-key"
  }
}
```




# Feature Plan: Batch Creation Endpoint

## Summary
API endpoint for batch creation with transactions and DB persistence. Controller in transaction module, separate batch module. Prisma schema with Transaction and Batch models.

---

## User Story
As a user, I want to upload a list of transactions via API with an optional batch name, so the system can start processing them.

---

## Acceptance Criteria
1. Endpoint accepts POST request with transaction array
2. Optional field `batchName` — if empty, generates `Batch (May 2, 2026 2:30 PM)`
3. Returns **201** with batchId, batchName, status, counters
4. Persists batch to DB (status = PROCESSING)
5. Persists transactions to DB (status = PENDING, currentStep = VALIDATE)
6. **Does NOT** create jobs in queue yet

---

## Scope (MVP)

### In scope
- Prisma schema with Transaction and Batch models
- DTO for input validation
- Transaction controller with endpoint
- Batch service (batch business logic)
- Batch module
- Transaction module (no controller — service + model only)

### Out of scope
- BullMQ Integration

---

## Technical Plan

### Prisma Schema (`transaction-service/prisma/schema.prisma`)

Create file with models:
- **Batch**: id, name, status, total, processed, failed, createdAt, updatedAt
- **Transaction**: id, userId, amount, currency, timestamp, merchant, category, batchId, status, currentStep, processingStartedAt, createdAt, updatedAt

### Files to create

```
transaction-service/
├── prisma/
│   └── schema.prisma
└── src/
    ├── batch/
    │   ├── dto/
    │   │   └── create-batch.dto.ts
    │   ├── batch.controller.ts
    │   ├── batch.module.ts
    │   └── batch.service.ts
    └── transaction/
        ├── dto/
        │   └── transaction.dto.ts
        ├── transaction.module.ts
        └── transaction.service.ts
```

### Modify
- `src/app.module.ts` — import BatchModule + TransactionModule
- `src/main.ts` — add ValidationPipe

---

## Contracts

**POST /batches**

Request:
```json
{
  "transactions": [
    {
      "transactionId": "uuid (optional)",
      "userId": "uuid",
      "amount": 100.00,
      "currency": "USD",
      "timestamp": "2024-01-01T00:00:00Z",
      "merchant": "Store",
      "category": "shopping"
    }
  ],
  "batchName": "optional string"
}
```

Response (201):
```json
{
  "batchId": "cuid1abc234",
  "batchName": "Batch (May 2, 2026 2:30 PM)",
  "status": "PROCESSING",
  "total": 1,
  "processed": 0,
  "failed": 0
}
```

Notes:
- Transaction statuses: `PENDING | PROCESSING | COMPLETED | FAILED | FAILED_FINAL`
- Transaction currentStep: `VALIDATE | ENRICH | ANALYZE | null`
- Batch statuses: `PROCESSING | COMPLETED | FAILED`
- batchId generated via `cuid()`
- batchName: `Batch (${date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })})` e.g., "Batch (May 2, 2026 2:30 PM)"

---

## Execution Tasks (6)

1. **Create Prisma schema**
   - `transaction-service/prisma/schema.prisma` with Batch and Transaction models
   - Enums for status/step

2. **Create batch module**
   - `src/batch/batch.module.ts`
   - `src/batch/batch.service.ts`
   - `src/batch/batch.controller.ts`
   - `src/batch/dto/create-batch.dto.ts`

3. **Create transaction module**
   - `src/transaction/transaction.module.ts`
   - `src/transaction/transaction.service.ts`
   - `src/transaction/dto/transaction.dto.ts`

4. **Add Prisma to project**
   - Install `@prisma/client`, `prisma` (dev)
   - Create `src/prisma.service.ts`

5. **Integrate modules in AppModule**
   - Add imports BatchModule, TransactionModule in `src/app.module.ts`
   - Add ValidationPipe in `src/main.ts`

6. **Run prisma generate + build**
   - `npx prisma generate`
   - `npm run build`

---

## Risk Notes
No significant risks identified.

---

## Definition of Done
- [ ] Endpoint `/batches` exists
- [ ] Accepts JSON array of transactions
- [ ] batchName auto-generated if not provided
- [ ] Returns 201 with batchId
- [ ] Batch persisted to DB
- [ ] Transactions persisted to DB (status = PENDING, currentStep = VALIDATE)
- [ ] Code compiles
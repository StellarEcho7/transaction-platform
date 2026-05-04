# Feature Plan: BullMQ Integration for Transaction Processing

## Summary
Integration of BullMQ into transaction-service: create jobs in queue after saving transactions and implement workers for processing steps VALIDATE → ENRICH → ANALYZE.

## User Story
As a developer, I want transactions to automatically enter the processing queue after a batch is created, so the system can asynchronously validate, enrich, and analyze each transaction.

## Acceptance Criteria
1. After saving transactions to DB, a job is created in BullMQ queue for each transaction
2. Job contains transactionId and current step
3. VALIDATE worker checks required fields (userId, amount, timestamp), types, amount > 0
4. ENRICH worker adds computed fields (region, operationType)
5. ANALYZE worker calculates riskScore and fraudFlags using rules
6. Workers update status and currentStep in DB after each step
7. Before processing, worker checks if transaction is already being processed (duplicates)
8. On error - retry with exponential backoff, after exhausting attempts - FAILED_FINAL

## Scope

**MVP**
- QueueModule with QueueService for job creation
- WorkersModule with worker logic for all three steps
- Idempotency protection (status + processingStartedAt check)
- Batch counters (processed/failed) update on transaction completion

**Out of scope**
- Recovery worker (separate feature)
- UI for queue monitoring
- Dead Letter Queue handling
- Metrics/observability
- Worker scaling beyond 2 instances

## Technical Plan

### Files to create:
```
transaction-service/src/
├── queue/
│   ├── queue.module.ts           # BullModule.forFeature
│   └── queue.service.ts          # addTransactionJobs()
├── workers/
│   ├── workers.module.ts         # NestJS module, registers BullModule processors
│   ├── workers.service.ts        # processValidate(), processEnrich(), processAnalyze()
│   ├── validate.worker.ts        # VALIDATE step logic
│   ├── enrich.worker.ts          # ENRICH step logic
│   └── analyze.worker.ts         # ANALYZE step logic
```

### Files to modify:
- `src/batch/batch.service.ts` — call queueService.createJobs() after saving transactions
- `src/app.module.ts` — import QueueModule and WorkersModule

### Database:
No changes - using existing Transaction and Batch models with status/currentStep fields.

### Environment variables:
Use existing `REDIS_HOST`, `REDIS_PORT` from .env.example — no new vars needed.

## Contracts

### Queue Job Creation
```typescript
await queueService.addTransactionJobs(transactions, batchId);
```

### Job Data
```typescript
{
  transactionId: string,
  step: "VALIDATE" | "ENRICH" | "ANALYZE"
}
```

### Job Options
```typescript
{
  jobId: transactionId,
  attempts: 5,
  backoff: { type: "exponential", delay: 2000 },
  removeOnComplete: false,
  removeOnFail: false
}
```

### Worker Logic (each step)
```
1. Get transaction by transactionId
2. If currentStep === null → skip (already processed)
3. If status === PROCESSING && processingStartedAt > now() - 60s → skip (duplicate)
4. Update: status = PROCESSING, processingStartedAt = now()
5. Execute step logic
6. Update: status = PENDING, currentStep = nextStep (or COMPLETED)
7. Create next job (except after ANALYZE)
8. Update batch counters if COMPLETED/FAILED
```

## Tasks

1. **Create QueueModule and QueueService**  
   - Create `src/queue/queue.module.ts` with BullModule configuration  
   - Create `src/queue/queue.service.ts` with `addTransactionJobs()` method  
   - Files: `queue.module.ts`, `queue.service.ts`

2. **Integrate queue into BatchService**  
   - Add call to queueService in batch creation flow after transactions are saved  
   - File: `batch.service.ts`

3. **Create WorkersModule and WorkersService**  
   - Create `src/workers/workers.module.ts`  
   - Create `src/workers/workers.service.ts` with process methods for each step  
   - Files: `workers.module.ts`, `workers.service.ts`

4. **Implement VALIDATE step**  
   - Check required fields, types, amount > 0  
   - Advance to ENRICH on success, mark FAILED_FINAL on validation error  
   - File: `validate.worker.ts`

5. **Implement ENRICH step**  
   - Add region (derived from merchant), operationType (purchase/refund)  
   - Advance to ANALYZE on success  
   - File: `enrich.worker.ts`

6. **Implement ANALYZE step**  
   - Calculate riskScore (0-1) based on rules: high amount, velocity, suspicious merchant  
   - Generate fraudFlags array  
   - Mark transaction as COMPLETED on finish  
   - File: `analyze.worker.ts`

7. **Update batch counters on completion**  
   - In WorkersService, increment processed on COMPLETED, failed on FAILED_FINAL  
   - Update batch status to COMPLETED when processed + failed == total  
   - File: `workers.service.ts` or `batch.service.ts`

## Risk Notes
- **Data inconsistency**: if job created but DB not updated, transaction stays PENDING. Solution: Recovery worker in next feature.
- **Duplicate processing**: without processingStartedAt check, duplicates possible. Solution: 60s deduplication guard in each worker.
- **Missing job**: if queue.add fails, transaction won't process. Solution: best-effort, recovery worker will restart.

## Definition of Done
- [ ] POST /batches creates jobs for all transactions
- [ ] VALIDATE worker validates and advances to ENRICH
- [ ] ENRICH worker enriches and advances to ANALYZE
- [ ] ANALYZE worker analyzes and completes transaction
- [ ] Deduplication works (checks PROCESSING + 60s window)
- [ ] Batch counters update on transaction completion
- [ ] Retry works with exponential backoff on errors
- [ ] Code compiles and passes linter
- [ ] All Acceptance Criteria satisfied
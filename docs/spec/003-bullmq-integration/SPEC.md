# Feature Plan: BullMQ Integration for Transaction Processing

## Summary
Integration of BullMQ into transaction-service: implement outbox pattern for reliable job delivery and workers for processing steps VALIDATE → ENRICH → ANALYZE.

## User Story
As a developer, I want transactions to automatically enter the processing queue after a batch is created, so the system can asynchronously validate, enrich, and analyze each transaction.

## Acceptance Criteria
1. After saving transactions to DB, an outbox event is created for each transaction (atomically in same DB transaction)
2. A separate OutboxReader worker continuously reads unprocessed outbox events and publishes jobs to BullMQ
3. Outbox events are marked as processed only after successful delivery to the queue
4. Job contains transactionId and current step
5. VALIDATE worker checks required fields (userId, amount, timestamp), types, amount > 0
6. ENRICH worker adds computed fields (region, operationType)
7. ANALYZE worker calculates riskScore and fraudFlags using rules (not pre-labeled by generator)
8. Workers update status and currentStep in DB after each step
9. Before processing, worker checks if transaction is already being processed (duplicates)
10. On error - retry with exponential backoff, after exhausting attempts - FAILED_FINAL
11. Recovery worker periodically re-enqueues transactions where currentStep != null and updatedAt is outdated

## Scope

**MVP**
- QueueModule with QueueService for job creation
- OutboxReaderModule for reading outbox events and publishing to queue
- WorkersModule with worker logic for all three steps
- Idempotency protection (status + processingStartedAt check)
- Batch counters (processed/failed) update on transaction completion
- RecoveryWorker for re-enqueueing stuck transactions

**Out of scope**
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
├── outbox/
│   ├── outbox.module.ts          # OutboxReader module
│   ├── outbox.reader.ts          # Reads unprocessed events, publishes to queue
│   └── outbox.service.ts         # Manages outbox table
├── recovery/
│   ├── recovery.module.ts        # RecoveryWorker module
│   └── recovery.worker.ts        # Re-enqueues stuck transactions
├── workers/
│   ├── workers.module.ts         # NestJS module, registers BullModule processors
│   ├── workers.service.ts        # processValidate(), processEnrich(), processAnalyze()
│   ├── validate.worker.ts        # VALIDATE step logic
│   ├── enrich.worker.ts          # ENRICH step logic
│   └── analyze.worker.ts         # ANALYZE step logic
```

### Files to modify:
- `src/batch/batch.service.ts` — create outbox events for first step (VALIDATE) in same DB transaction as transactions
- `src/app.module.ts` — import QueueModule, OutboxModule, RecoveryModule and WorkersModule

### Database:
No changes - using existing Transaction and Batch models with status/currentStep fields.

### Environment variables:
Use existing `REDIS_HOST`, `REDIS_PORT` from .env.example — no new vars needed.

## Contracts

### Outbox Event Creation (in BatchService)
When batch is created, within same DB transaction:
- Transaction records are created with status = PENDING, currentStep = VALIDATE
- Outbox events are created for each transaction describing next step
```typescript
{
  transactionId: string,
  step: "VALIDATE" | "ENRICH" | "ANALYZE",
  status: "PENDING"
}
```

### Outbox Reader Logic
- Continuously polls unprocessed outbox events
- For each event: creates BullMQ job, marks event as processed (only after successful delivery)
- Decouples DB writes from queue operations

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
6. Update: status = PENDING, currentStep = nextStep (or COMPLETED for ANALYZE)
7. Create new outbox event for next step (except after ANALYZE)
8. Update batch counters if COMPLETED/FAILED
```

### Recovery Worker Logic
```
- Periodically query transactions where currentStep != null AND updatedAt is stale
- For each stuck transaction: create outbox event if needed, re-enqueue
- Handles cases where job was not created or was lost
```

## Tasks

1. **Create QueueModule and QueueService**  
   - Create `src/queue/queue.module.ts` with BullModule configuration  
   - Create `src/queue/queue.service.ts` with `addTransactionJobs()` method  
   - Files: `queue.module.ts`, `queue.service.ts`

2. **Create OutboxModule and OutboxService**  
   - Create `src/outbox/outbox.module.ts`  
   - Create `src/outbox/outbox.service.ts` for managing outbox table  
   - Create `src/outbox/outbox.reader.ts` - background worker that reads unprocessed events and publishes to queue  
   - Files: `outbox.module.ts`, `outbox.service.ts`, `outbox.reader.ts`

3. **Integrate outbox into BatchService**  
   - Modify batch creation to create outbox events for first step (VALIDATE) in same DB transaction  
   - File: `batch.service.ts`

4. **Create WorkersModule and WorkersService**  
   - Create `src/workers/workers.module.ts`  
   - Create `src/workers/workers.service.ts` with process methods for each step  
   - Files: `workers.module.ts`, `workers.service.ts`

5. **Implement VALIDATE step**  
   - Check required fields, types, amount > 0  
   - Advance to ENRICH on success, mark FAILED_FINAL on validation error  
   - Create outbox event for next step  
   - File: `validate.worker.ts`

6. **Implement ENRICH step**  
   - Add region (derived from merchant), operationType (purchase/refund)  
   - Advance to ANALYZE on success  
   - Create outbox event for next step  
   - File: `enrich.worker.ts`

7. **Implement ANALYZE step**  
   - Calculate riskScore (0-1) based on rules: high amount, velocity, suspicious merchant  
   - Generate fraudFlags array  
   - Mark transaction as COMPLETED (currentStep = null)  
   - File: `analyze.worker.ts`

8. **Update batch counters on completion**  
   - In WorkersService, increment processed on COMPLETED, failed on FAILED_FINAL  
   - Update batch status to COMPLETED when processed + failed == total  
   - File: `workers.service.ts` or `batch.service.ts`

9. **Create RecoveryModule and RecoveryWorker**  
   - Create `src/recovery/recovery.module.ts`  
   - Create `src/recovery/recovery.worker.ts` - periodically re-enqueues stuck transactions  
   - Query: currentStep != null AND updatedAt is stale  
   - Files: `recovery.module.ts`, `recovery.worker.ts`

## Risk Notes
- **Outbox delivery**: if outbox event is marked processed but queue job fails, transaction stays PENDING. Solution: Recovery worker re-enqueues.
- **Duplicate processing**: without processingStartedAt check, duplicates possible. Solution: 60s deduplication guard in each worker.
- **Atomicity**: outbox events are created in same DB transaction as transactions, guaranteeing consistency.

## Definition of Done
- [ ] POST /batches creates transactions + outbox events atomically
- [ ] OutboxReader continuously publishes jobs to queue
- [ ] VALIDATE worker validates and advances to ENRICH
- [ ] ENRICH worker enriches and advances to ANALYZE
- [ ] ANALYZE worker analyzes (using rules, not pre-labeled data) and completes transaction
- [ ] Deduplication works (checks PROCESSING + 60s window)
- [ ] Batch counters update on transaction completion
- [ ] Batch status = COMPLETED when processed + failed == total
- [ ] Retry works with exponential backoff on errors
- [ ] RecoveryWorker re-enqueues stuck transactions
- [ ] Code compiles and passes linter
- [ ] All Acceptance Criteria satisfied
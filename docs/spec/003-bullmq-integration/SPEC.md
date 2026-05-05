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
- QueueModule + QueueService (low-level transport, no domain knowledge)
- OutboxModule + OutboxService + OutboxProcessor (reads events, publishes to queue)
- WorkersModule with 3 processors (validate, enrich, analyze) - each contains step logic
- Idempotency protection (status + processingStartedAt check)
- Batch counters (processed/failed) update on transaction completion
- RecoveryWorker - recreates MISSING outbox events (NOT direct queue publish)

**Out of scope**
- UI for queue monitoring
- Dead Letter Queue handling
- Metrics/observability
- Worker scaling beyond 2 instances

**Architecture Constraint**
- ONLY OutboxProcessor writes to queue
- ALL other components (API, workers, recovery) go through outbox
- This guarantees consistency between DB and queue

## Technical Plan

### Files to create:
```
transaction-service/src/
├── queue/
│   ├── queue.module.ts           # BullModule.forFeature
│   └── queue.service.ts          # low-level publish(), no domain knowledge
├── outbox/
│   ├── outbox.module.ts          # Outbox module
│   ├── outbox.processor.ts       # Reads unprocessed events → publishes to queue
│   └── outbox.service.ts         # createEvent() for creating outbox records
├── recovery/
│   ├── recovery.module.ts        # RecoveryWorker module
│   └── recovery.worker.ts        # Recreates missing outbox events for stuck transactions
├── workers/
│   ├── workers.module.ts         # NestJS module, registers BullModule processors
│   ├── validate.processor.ts     # VALIDATE step - listens to queue, contains logic
│   ├── enrich.processor.ts       # ENRICH step - listens to queue, contains logic
│   └── analyze.processor.ts     # ANALYZE step - listens to queue, contains logic
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

### Outbox Processor Logic
- Continuously polls unprocessed outbox events
- For each event: calls queueService.publish() with job data, marks event as processed (only after successful delivery)
- Decouples DB writes from queue operations
- The ONLY component that writes to queue (besides tests)

### Queue Service (low-level transport)
```typescript
await queueService.publish({ type: string, payload: object });
```
- No knowledge of transactions or steps
- Simple transport layer

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

### Worker/Processor Logic (each step)
Each processor file (validate.processor.ts, enrich.processor.ts, analyze.processor.ts):
- Listens to queue for its step
- Contains full step logic (no separate service layer)
- On success: updates transaction, creates outbox event for next step (except ANALYZE)
- On failure: marks FAILED_FINAL after retry exhaustion
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
- For each stuck transaction: recreate missing outbox event (if none exists for currentStep)
- Creates outbox event → outbox processor will pick it up and publish to queue
- This maintains consistency: ALL paths go through outbox
- Does NOT directly publish to queue (that would break the outbox pattern)
```

## Tasks

1. **Create QueueModule and QueueService** (low-level transport)  
   - Create `src/queue/queue.module.ts` with BullModule configuration  
   - Create `src/queue/queue.service.ts` with `publish({ type, payload })` method  
   - NO domain knowledge (no transaction/step constants)  
   - Files: `queue.module.ts`, `queue.service.ts`

2. **Create OutboxModule and OutboxService**  
   - Create `src/outbox/outbox.module.ts`  
   - Create `src/outbox/outbox.service.ts` with `createEvent()` method  
   - Create `src/outbox/outbox.processor.ts` - polls unprocessed events, publishes to queue  
   - Files: `outbox.module.ts`, `outbox.service.ts`, `outbox.processor.ts`

3. **Integrate outbox into BatchService**  
   - Modify batch creation to create outbox events for first step (VALIDATE) in same DB transaction  
   - File: `batch.service.ts`

4. **Create WorkersModule**  
   - Create `src/workers/workers.module.ts` - registers all processor handlers

5. **Implement VALIDATE processor**  
   - Create `src/workers/validate.processor.ts` - listens to queue, contains step logic  
   - Check required fields, types, amount > 0  
   - On success: advance to ENRICH, create outbox event  
   - On failure: mark FAILED_FINAL after retries  

6. **Implement ENRICH processor**  
   - Create `src/workers/enrich.processor.ts` - listens to queue, contains step logic  
   - Add region (derived from merchant), operationType (purchase/refund)  
   - On success: advance to ANALYZE, create outbox event  

7. **Implement ANALYZE processor**  
   - Create `src/workers/analyze.processor.ts` - listens to queue, contains step logic  
   - Calculate riskScore (0-1) based on rules: high amount, velocity, suspicious merchant  
   - Generate fraudFlags array  
   - On finish: mark COMPLETED (currentStep = null)  

8. **Update batch counters on completion**  
   - In processors, increment processed on COMPLETED, failed on FAILED_FINAL  
   - Update batch status to COMPLETED when processed + failed == total  
   - Files: processors call BatchService

9. **Create RecoveryModule and RecoveryWorker**  
   - Create `src/recovery/recovery.module.ts`  
   - Create `src/recovery/recovery.worker.ts` - recreates MISSING outbox events (not direct queue publish)  
   - Query: currentStep != null AND updatedAt is stale AND no outbox event exists  
   - Creates outbox event → outbox processor picks it up → maintains consistency  
   - Files: `recovery.module.ts`, `recovery.worker.ts`

## Risk Notes
- **Outbox delivery**: if outbox event is marked processed but queue job fails, transaction stays PENDING. Solution: Recovery worker recreates outbox event.
- **Duplicate processing**: without processingStartedAt check, duplicates possible. Solution: 60s deduplication guard in each processor.
- **Atomicity**: outbox events are created in same DB transaction as transactions, guaranteeing consistency.
- **Bypassing outbox**: recovery MUST create outbox event, not directly publish to queue — otherwise outbox pattern is broken.

## Definition of Done
- [ ] POST /batches creates transactions + outbox events atomically
- [ ] OutboxProcessor continuously reads events and publishes to queue (ONLY component that writes to queue)
- [ ] QueueService is low-level transport with no domain knowledge
- [ ] VALIDATE processor validates and advances to ENRICH
- [ ] ENRICH processor enriches and advances to ANALYZE
- [ ] ANALYZE processor analyzes (using rules, not pre-labeled data) and completes transaction
- [ ] Deduplication works (checks PROCESSING + 60s window)
- [ ] Batch counters update on transaction completion
- [ ] Batch status = COMPLETED when processed + failed == total
- [ ] Retry works with exponential backoff on errors
- [ ] RecoveryWorker recreates MISSING outbox events (NOT direct queue publish)
- [ ] ALL paths to queue go through outbox (maintains consistency)
- [ ] Code compiles and passes linter
- [ ] All Acceptance Criteria satisfied
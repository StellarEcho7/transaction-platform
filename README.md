# Transaction Platform

## Key idea
This is not just a "transaction service".

It is a fault-tolerant processing system that guarantees every piece of data
will pass through a defined sequence of steps — without being lost,
even under failures.

## Core principles
The system ensures that:

- every transaction is eventually processed
- no step is lost due to crashes or partial failures
- processing is fully asynchronous and horizontally scalable
- each step is explicitly controlled via a state machine (status + currentStep)
- consistency between database and queue is guaranteed via the outbox pattern

## What makes it reliable
Even if:
- workers crash mid-processing  
- queue delivery fails  
- invalid or partial data is received  
- the system is under high load  

→ transactions are not lost and will be recovered and continued automatically


# Technology stack

Backend:
  NestJS + TypeScript
  class-validator + class-transformer
  Prisma


Frontend:
  Next.js + TypeScript
    MUI
    tailwindcss
    next-auth (Auth.js)
    Prisma


Data & storage:
  PostgreSQL (Prisma)
  Redis (cache + queue)


Messaging / queue:
  BullMQ (Redis-based queue)

docker-compose

Infrastructure concepts:
  microservices architecture
  event-driven processing
  background workers
  distributed job processing

Observability (optional):
  OpenTelemetry
  logging + metrics + tracing


# Domain: Transaction

Base entity (Transaction)

Each transaction is an atomic financial event.
Initial structure (raw input)
```
{
  "transactionId": "uuid",
  "userId": "uuid",
  "amount": 120.50,
  "currency": "USD",
  "timestamp": "ISO-8601",
  "merchant": "string",
  "category": "string",
  "metadata": {
    "source": "api|batch|generator",
    "batchId": "uuid"
  }
}
```

Internal extension of the entity within the system
As it moves through the pipeline, the transaction is enriched with additional data and statuses:
```
{
  "transactionId": "...",
  "userId": "...",
  "amount": 120.50,
  "currency": "USD",
  "timestamp": "...",

  "merchant": "Amazon",
  "category": "shopping",

  "region": "US",

  "riskScore": 0.82,
  "fraudFlags": ["HIGH_AMOUNT", "VELOCITY_ANOMALY"],

  "status": "PENDING | PROCESSING | COMPLETED | FAILED | FAILED_FINAL",
  "currentStep": "VALIDATE | ENRICH | ANALYZE | null",

  "batchId": "uuid",

  "processingStartedAt": "timestamp | null",

  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

# Batch

PROCESSING → there are unfinished transactions
COMPLETED → all finished (processed + failed = total)
FAILED → optional (if you want a separate state for “everything is bad”)
```
{
  "id": "uuid",
  "name": "string",

  "status": "PROCESSING | COMPLETED | FAILED",

  "total": 1000,
  "processed": 800,
  "failed": 200,

  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
When batch is updated

only in worker:
transaction COMPLETED → processed++
transaction FAILED → failed++

When a batch is considered completed
processed + failed == total
then:
status = COMPLETED




The system is a web application with a UI in which a user can generate or upload a JSON with transactions, optionally specifying a batch name (optional; if not specified, it is generated automatically). Generation can occur directly in the UI (for example, in Next.js), where the user sets parameters (number of transactions, proportion of invalid data, patterns of suspicious operations, seed for reproducibility), after which a JSON for upload is formed. At the same time, generation is used only for demonstration and testing of the system, and is not part of the real production flow. After submitting the data, the frontend calls the API, with the Next.js layer acting as a BFF/API Gateway (using Auth.js to work with the user), proxying requests to the backend and adding user context.

The API creates a batch record in the database (with status PROCESSING, the number of expected transactions, and metadata), then accepts an array of transactions. For each transaction, the provided id is used (or generated on the server), after which each transaction is saved in the database as a separate record with a reference to batchId, initial fields, status = PENDING and currentStep = VALIDATE. At the database level, a uniqueness constraint on id is enforced, which ensures idempotency — duplicates are not created.

Within the same database transaction, for each transaction an outbox event is created describing the next processing step (e.g., VALIDATE). This guarantees that both the transaction data and the corresponding processing intent are persisted atomically.

After the transaction is committed, the API immediately returns a response to the user (“batch accepted for processing”) with batchId, without waiting for execution.

A separate background worker continuously reads unprocessed records from the outbox table, publishes corresponding jobs to the queue (via Redis/BullMQ), and marks those outbox records as processed. This decouples database writes from queue operations and ensures reliable delivery of jobs even in case of partial failures.

Then the system operates asynchronously. Workers process transactions, relying on the status and currentStep fields. Before starting processing, the worker sets the transaction to status = PROCESSING and records processingStartedAt.

Processing occurs as a state machine:

At the VALIDATE step, required fields and basic rules are checked. If the check fails, the transaction is moved to status = FAILED or FAILED_FINAL (if the retry limit is exceeded), currentStep = null, and further processing stops. If successful — currentStep changes to ENRICH, status returns to PENDING, and a new outbox event is created for the next step, which will later be picked up and converted into a job.

At the ENRICH step, computed data is added to the transaction (for example, region). After successful execution, currentStep changes to ANALYZE, status = PENDING, and a new outbox event is created for the next step.

At the ANALYZE step, riskScore is calculated and fraudFlags are formed. At the same time, anomaly detection is based on processing rules, not on data “pre-labeled” by the generator, which makes the analysis independent and realistic. After that, the transaction is moved to status = COMPLETED, currentStep = null.

Each step is executed as a separate job, which allows transactions to be processed independently and in parallel. Re-execution is safe due to idempotency and state checks (status/currentStep).

If an error occurs during step execution, BullMQ automatically performs retry with backoff. If the retry limit is exceeded, the transaction is moved to FAILED_FINAL and is no longer processed.

To ensure reliability, a recovery worker is used, which periodically finds transactions where currentStep != null and updatedAt is outdated, and re-enqueues them (by creating corresponding outbox events if necessary). This covers cases where a job was not created or was lost.

As processing progresses, the aggregated state of the batch (processed/failed/total) is updated, which allows the UI to display processing progress. The user can open a batch and see the list of transactions, their current statuses, processing steps, and analysis results.

As a result, the system implements asynchronous, fault-tolerant transaction processing with a clear state machine model (status + currentStep), idempotency, a retry mechanism, and recovery. The outbox pattern guarantees consistency between the database and the queue, ensuring that every persisted transaction will eventually be processed, even in the presence of failures.


# Project structure

transaction-platform
├─ transaction-hub
└─ transaction-service


# Full transaction processing flow

1. **Ingestion**
   - User submits a batch of transactions via API
   - The system creates:
     - batch record (PROCESSING)
     - transaction records (PENDING, currentStep = VALIDATE)
     - outbox events for the first step (VALIDATE)
   - All operations are executed atomically in a single database transaction

2. **Outbox delivery**
   - A background worker continuously reads unprocessed outbox events
   - Each event is converted into a queue job
   - Events are marked as processed only after successful delivery

3. **Step execution (state machine)**

   Each transaction is processed independently through a fixed sequence of steps:

   **VALIDATE → ENRICH → ANALYZE**

   For each step:
   - Worker picks up a job from the queue
   - Atomically claims the transaction (status = PROCESSING)
   - Executes the step logic

   **On success:**
   - transaction state is updated (next step)
   - a new outbox event is created for the next step

   **On failure:**
   - automatic retry is triggered (with backoff)
   - if retry limit is exceeded → transaction marked as FAILED_FINAL

4. **Completion**
   - After ANALYZE step:
     - transaction → COMPLETED
     - currentStep → null

5. **Recovery guarantees**
   - If a job is not delivered → it remains in outbox and will be retried
   - If a worker crashes → transaction remains in a recoverable state
   - A recovery worker periodically re-enqueues stuck transactions

6. **Observability**
   - Batch progress is aggregated (processed / failed / total)
   - Each transaction exposes:
     - current status
     - current step
     - processing results

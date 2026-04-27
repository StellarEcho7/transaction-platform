Distributed Transaction Processing Platform
Transaction Platform


💬 Key idea
This is not a "transaction service".
This is: a system that reliably runs data through a sequence of steps and does not lose it in case of failures.

🎯 The purpose of the whole system
The system guarantees that:
each transaction will be processed
even if workers crash
even if the data is partially bad
even if the load is high



Technology stack

Backend:

NestJS + TypeScript
class-validator + class-transformer
Prisma


Frontend:

Next.js
  MUI
  next-auth (Auth.js)


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




Domain: Transaction

📦 Base entity (Transaction)

Each transaction is an atomic financial event.

Initial structure (raw input)

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

🔄 Internal extension of the entity within the system

As it moves through the pipeline, the transaction is enriched with additional data and statuses:

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



Batch

PROCESSING → there are unfinished transactions
COMPLETED → all finished (processed + failed = total)
FAILED → optional (if you want a separate state for “everything is bad”)

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

When batch is updated

👉 only in worker:

transaction COMPLETED → processed++
transaction FAILED → failed++

💥 When a batch is considered completed

processed + failed == total

👉 then:

status = COMPLETED




The system is a web application with a UI in which a user can generate or upload a JSON with transactions, optionally specifying a batch name (optional; if not specified, it is generated automatically). Generation can occur directly in the UI (for example, in Next.js), where the user sets parameters (number of transactions, proportion of invalid data, patterns of suspicious operations, seed for reproducibility), after which a JSON for upload is formed. At the same time, generation is used only for demonstration and testing of the system, and is not part of the real production flow. After submitting the data, the frontend calls the API, with the Next.js layer acting as a BFF/API Gateway (using Auth.js to work with the user), proxying requests to the backend and adding user context. The API creates a batch record in the database (with status PROCESSING, the number of expected transactions, and metadata), then accepts an array of transactions. For each transaction, the provided id is used (or generated on the server), after which each transaction is saved in the database as a separate record with a reference to batchId, initial fields, status = PENDING and currentStep = VALIDATE. At the database level, a uniqueness constraint on id is enforced, which ensures idempotency — duplicates are not created.

After saving, for each transaction an attempt is made to create a job in the queue (via Redis/BullMQ), after which the API immediately returns a response to the user “batch accepted for processing” with batchId, without waiting for execution.

Then the system operates asynchronously. Workers process transactions, relying on the status and currentStep fields. Before starting processing, the worker sets the transaction to status = PROCESSING and records processingStartedAt.

Processing occurs as a state machine:

At the VALIDATE step, required fields and basic rules are checked. If the check fails, the transaction is moved to status = FAILED or FAILED_FINAL (if the retry limit is exceeded), currentStep = null, and further processing stops. If successful — currentStep changes to ENRICH, status returns to PENDING, and the next job is created.
At the ENRICH step, computed data is added to the transaction (for example, region). After successful execution, currentStep changes to ANALYZE, status = PENDING, and the next job is created.
At the ANALYZE step, riskScore is calculated and fraudFlags are formed. At the same time, anomaly detection is based on processing rules, not on data “pre-labeled” by the generator, which makes the analysis independent and realistic. After that, the transaction is moved to status = COMPLETED, currentStep = null.

Each step is executed as a separate job, which allows transactions to be processed independently and in parallel. Re-execution is safe due to idempotency and state checks (status/currentStep).

If an error occurs during step execution, BullMQ automatically performs retry with backoff. If the retry limit is exceeded, the transaction is moved to FAILED_FINAL and is no longer processed.

To ensure reliability, a recovery worker is used, which periodically finds transactions where currentStep != null and updatedAt is outdated, and re-enqueues them. This covers cases where a job was not created or was lost.

As processing progresses, the aggregated state of the batch (processed/failed/total) is updated, which allows the UI to display processing progress. The user can open a batch and see the list of transactions, their current statuses, processing steps, and analysis results.

As a result, the system implements asynchronous, fault-tolerant transaction processing with a clear state machine model (status + currentStep), idempotency, a retry mechanism, and recovery, in which each transaction goes through a fixed lifecycle, and the user can observe progress in real time.


# Project structure


transaction-platform/
├── transaction-hub/
└── transaction-service/




Full transaction processing flow

0. System entry (Batch ingestion)

A batch of transactions enters the system (via API or generator).

Format:

JSON array or CSV
each record = one transaction

At this stage:

a batchId is created
each transaction receives a transactionId
all transactions are saved in the database in RAW state

Additionally:

for each transaction a queue job is created for the first processing step

Transaction state:

status = PENDING
step = VALIDATE

1. Validate (data validation)

A worker picks up the job from the queue and validates the transaction.

Checks:

required fields (userId, amount, timestamp)
data types
amount > 0
valid date format

Result:

If valid:
status is updated:
status = VALIDATED
step = ENRICH
a new queue job is created (next step)

If invalid:
status:
status = FAILED
error = VALIDATION_ERROR
no further processing is performed

2. Enrich (data enrichment)

A worker processes the job and adds computed fields to the transaction.

Added data:

region (e.g. based on merchant or userId)
operationType (purchase / refund)
simple derived fields

The transaction is updated in the database.

State:

status = ENRICHED
step = ANALYZE

Next queue job is created.

3. Analyze (anomaly detection)

A worker analyzes the transaction.

Simple rules are applied:

transaction amount too high
too frequent operations (per userId)
suspicious merchant

Result:

riskScore is calculated
flags are generated

Example:

{
  "riskScore": 0.9,
  "flags": ["HIGH_AMOUNT"]
}

State:

status = ANALYZED
step = COMPLETE

Next job is created.

4. Complete (finalization)

Final worker:

locks in the final state of the transaction
marks it as completed

State:

status = COMPLETED

At this point the pipeline ends.

🔁 System behavior on failures
Retry

If a worker crashes or a step fails:

job is retried automatically
retry count is limited (e.g. 3 attempts)

DLQ (Dead Letter Queue)

If the job keeps failing after retries:

it is moved to a DLQ
transaction is marked:
status = FAILED

Idempotency

If a job runs twice (e.g. due to crash recovery):

execution is safe
updates are guarded by transactionId

⚙️ Concurrent processing

each transaction is processed independently
multiple workers can run in parallel
workers pull jobs from the same queue

💾 Data persistence

Transaction is stored:

1. On ingestion (RAW)

original input data

2. After each step

status updates
new derived fields added

3. At the end

final state
analysis result

🧩 Final lifecycle

PENDING → VALIDATED → ENRICHED → ANALYZED → COMPLETED
	      ↓
          FAILED (at any stage)







WORKER_CONCURRENCY=10
WORKER_COUNT=2

Reminder: the cases you handle

to ensure two workers do not take the same task
to ensure the task is not lost
to ensure that if a worker dies — the task is restored
to ensure there are no duplicate executions

1. save to DB (status = pending)

2. worker:
   - atomically takes the task (and marks it processing)
   - processes it
   - sets status = done

3. separate process:
   - returns stuck processing tasks → pending





💥 1. Database (minimum)

id
status: PENDING | PROCESSING | COMPLETED | FAILED
currentStep: VALIDATE | ENRICH | ANALYZE | null
updated_at
processing_started_at (nullable)

💥 2. API

save transaction:
status = PENDING
currentStep = VALIDATE
try to enqueue job (best effort)
return 200

💥 3. Queue

Redis + BullMQ

queue.add("process-transaction", { transactionId }, {
  jobId: transactionId,
  attempts: 5,
  backoff: { type: "exponential", delay: 2000 }
});

💥 4. Worker

const tx = getTransaction(id);

if (!tx || tx.currentStep === null) return;

// protection against duplicates
if (tx.status === "PROCESSING" &&
    tx.processing_started_at > now() - 60s) return;

update:
  status = PROCESSING
  processing_started_at = now()

switch (tx.currentStep):

  VALIDATE:
    → validate
    → update:
        currentStep = ENRICH
        status = PENDING

    → enqueue next job
    break;

  ENRICH:
    → enrich
    → update:
        currentStep = ANALYZE
        status = PENDING

    → enqueue next job
    break;

  ANALYZE:
    → analyze
    → update:
        currentStep = null
        status = COMPLETED
    break;

💥 5. Recovery worker (single)

every N seconds:

SELECT * FROM transactions
WHERE currentStep IS NOT NULL
AND updated_at < now() - interval '30 seconds'

for each:

queue.add("process-transaction", { transactionId }, {
  jobId: transactionId
});

💥 6. What is covered

enqueue didn’t happen → recovery fixes it
worker crashed → BullMQ retry
step stuck → recovery restarts it
duplicates → jobId + worker checks

💥 7. Core rule

DB = source of truth (currentStep)
Redis = transport
Worker = moves steps
Recovery = fixes gaps

















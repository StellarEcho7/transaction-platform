# Feature Plan: Batch Transaction Read API

## 1. Summary

Add REST API endpoints to transaction-service for reading batch and transaction data:
- GET /batches — list all batches
- GET /batches/:id — batch details with progress
- GET /batches/:id/transactions — transactions for a batch
- GET /transactions/:id — single transaction by ID

## 2. User Story

**Who**: Frontend developer / UI application
**What**: Need API endpoints to fetch batch and transaction data
**Why**: UI must display processing progress and transaction lists (README line 178)

## 3. Acceptance Criteria

- [ ] GET /batches returns array of all batches with fields: id, name, status, total, processed, failed, createdAt
- [ ] GET /batches/:id returns batch with transactions (paginated)
- [ ] GET /batches/:id/transactions returns array of batch transactions with status filter
- [ ] GET /transactions/:id returns full transaction information
- [ ] Support query params: page, limit for pagination; status for filtering

## 4. Scope (MVP / Out of scope)

**MVP**:
- All 4 GET endpoints
- Pagination (page, limit)
- Filtering by status

**Out of scope**:
- POST/PUT/DELETE (read-only)
- Sorting, advanced filtering

## 5. Technical Plan

### BatchController — add endpoints
- `GET /batches` — find all batches
- `GET /batches/:id` — batch with transactions
- `GET /batches/:id/transactions` — batch transactions

### BatchService — add methods
- `findAll(query)` — paginated list of batches
- `findById(id)` — batch with transactions

### TransactionController — create new controller
- `GET /transactions/:id` — transaction by ID

### TransactionService — add methods
- `findById(id)` — get transaction by ID
- `findByBatchId(batchId, query)` — paginated transactions for batch

### DTOs to create
- `BatchListQueryDto` (page, limit, status)
- `BatchDetailDto` (includes transactions)
- `TransactionListQueryDto` (page, limit, status)
- `TransactionDetailDto`

## 6. Contracts

### GET /batches
**Request**: `GET /batches?page=1&limit=10&status=PROCESSING`
**Response**:
```json
{
  "data": [{ "id": "batch_123", "name": "...", "status": "PROCESSING", "total": 100, "processed": 45, "failed": 5, "createdAt": "..." }],
  "pagination": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

### GET /batches/:id
**Request**: `GET /batches/:id?page=1&limit=20`
**Response**: Batch + transactions array + pagination

### GET /batches/:id/transactions
**Request**: `GET /batches/:id/transactions?page=1&limit=20&status=PENDING`
**Response**: Transactions array + pagination

### GET /transactions/:id
**Request**: `GET /transactions/:id`
**Response**: Full transaction object with all fields

## 7. Tasks

1. **Add DTOs** — BatchListQueryDto, TransactionListQueryDto, PaginationResponseDto, BatchDetailDto, TransactionDetailDto
2. **Extend BatchService** — findAll(query), findById(id)
3. **Extend TransactionService** — findById(id), findByBatchId(batchId, query)
4. **Add BatchController endpoints** — GET /batches, /batches/:id, /batches/:id/transactions
5. **Create TransactionController** — GET /transactions/:id
6. **Run quality-gate** — build, lint, typecheck

## 8. Risk Notes

No significant risks — read-only endpoints, no schema changes.

## 9. Definition of Done

- All 4 endpoints exist and return data matching contracts
- Build passes
- Types correct
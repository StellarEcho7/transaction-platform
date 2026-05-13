# 1. Summary

Implementation of the batch details page with a list of transactions and automatic status updates in real-time (polling).

---

# 2. User Story

**Who:** System user  
**What:** Viewing details of a specific batch with a list of transactions and their statuses  
**Why:** To track transaction processing progress in detail within the batch, see analysis results (region, riskScore, fraudFlags)

---

# 3. Acceptance Criteria

## Batch Details Page (`/batches/[id]`)
- [ ] Tile (card) with batch information:
  - name, status, total, processed, failed, source, createdAt
- [ ] Progress bar (processed + failed / total)
- [ ] "Back" button to return to list
- [ ] Transactions table with pagination
- [ ] For each transaction, display:
  - transactionId
  - amount
  - currency
  - timestamp
  - merchant
  - category
  - status (PENDING, PROCESSING, COMPLETED, FAILED, FAILED_FINAL)
  - currentStep (VALIDATE, ENRICH, ANALYZE, null)
  - region
  - riskScore
  - fraudFlags
- [ ] Polling for transaction data updates:
  - Start polling when batch is in PROCESSING status
  - Poll interval: 3-5 seconds
  - Stop polling when batch is in COMPLETED or FAILED status
- [ ] Loading states during data fetching
- [ ] Error states on API errors
- [ ] Empty state (no transactions)

---

# 4. Scope

## MVP
- Implementation of batch details page with Tile and progress bar
- Transactions table with pagination
- Polling for real-time transaction status updates
- Adding GET endpoints to `/api/batches/[id]` and `/api/batches/[id]/transactions`

## Out of scope
- Transaction editing
- Transaction deletion
- Data export
- Real-time via WebSockets

---

# 5. Technical Plan

## Backend (no changes required)
- `GET /batches/:id` already exists in transaction-service
- `GET /batches/:id/transactions` already exists

## Frontend

### API Route (add GET)
- `GET /api/batches/[id]` - proxies to `GET /batches/:id`
- `GET /api/batches/[id]/transactions` - proxies to `GET /batches/:id/transactions?page=&limit=`

### Server Actions (create)
- `getBatch(id)` - fetch batch details
- `getBatchTransactions(batchId, page, limit)` - fetch batch transactions

### Page
- `(app)/batches/[id]/page.tsx` - batch details component with transactions and polling

### Polling Logic
```
const [batch, setBatch] = useState(null)
const [transactions, setTransactions] = useState([])

useEffect(() => {
  const interval = setInterval(async () => {
    const [newBatch, newTransactions] = await Promise.all([
      getBatch(id),
      getBatchTransactions(id, page, limit)
    ])
    setBatch(newBatch)
    setTransactions(newTransactions)

    // Stop polling if batch is completed
    if (newBatch.status === 'COMPLETED' || newBatch.status === 'FAILED') {
      clearInterval(interval)
    }
  }, 3000)

  return () => clearInterval(interval)
}, [id, page, limit])
```

---

# 6. Contracts

## GET /api/batches/[id]

Request:
```
GET /api/batches/cm123abc
```

Response:
```json
{
  "id": "string",
  "name": "string",
  "status": "PROCESSING",
  "total": 100,
  "processed": 50,
  "failed": 10,
  "source": "MANUAL",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## GET /api/batches/[id]/transactions

Request:
```
GET /api/batches/cm123abc/transactions?page=1&limit=20
```

Response:
```json
{
  "data": [
    {
      "id": "string",
      "transactionId": "string",
      "userId": "string",
      "amount": 120.50,
      "currency": "USD",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "merchant": "Amazon",
      "category": "shopping",
      "status": "COMPLETED",
      "currentStep": null,
      "region": "US",
      "operationType": "online",
      "riskScore": 0.25,
      "fraudFlags": null,
      "batchId": "string",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

# 7. Tasks

1. **Add GET endpoints to `/api/batches` route**
   - Add GET method for batch details (`[id]`)
   - Add GET method for batch transactions (`[id]/transactions`)
   - Forward query params to backend

2. **Create Server Actions for batch**
   - `getBatch(id)`
   - `getBatchTransactions(batchId, page, limit)`

3. **Implement batch details page (`/batches/[id]`)**
   - Tile with batch information + progress bar
   - "Back" button
   - Transactions table with pagination
   - Polling logic (start/stop based on batch status)
   - Loading/error/empty states

4. **Run quality-gate**
   - Verify build, lint, types

---

# 8. Risk Notes

- **Polling may put load on server** - 3-5 second interval is reasonable for a single batch
- **Dependency on backend API** — frontend relies on existing endpoints in transaction-service
- **Pagination** — need to correctly handle pagination response from backend

---

# 9. Definition of Done

- [ ] Page `/batches/[id]` displays Tile with batch information
- [ ] Progress bar displays correctly
- [ ] Transactions table displays all required fields (including region, riskScore, fraudFlags)
- [ ] Pagination works for transactions
- [ ] Polling starts when status is PROCESSING
- [ ] Polling stops when status is COMPLETED or FAILED
- [ ] "Back" button works correctly
- [ ] Loading and error states are implemented
- [ ] Empty states are handled
- [ ] quality-gate passes (build, lint, types)
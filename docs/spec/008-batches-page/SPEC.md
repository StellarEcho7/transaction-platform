# 1. Summary

Implementation of the batches list page with a progress bar display and automatic status updates in real-time (polling).

---

# 2. User Story

**Who:** System user  
**What:** Viewing the list of batches with transaction processing progress tracking  
**Why:** To see the current state of all batches in real-time

---

# 3. Acceptance Criteria

## Batches List Page (`/batches`)
- [ ] Display a table/list of all batches
- [ ] Show: name, status, total, processed, failed, createdAt
- [ ] Pagination (10/20/50 records per page)
- [ ] Filter by status (PROCESSING, COMPLETED, FAILED)
- [ ] Click on batch → navigate to details page
- [ ] Progress bar for each batch (processed + failed / total)
- [ ] Polling for data updates:
  - Start polling when there is at least one batch with PROCESSING status
  - Poll interval: 3-5 seconds
  - Stop polling when all batches are in COMPLETED or FAILED status (or no PROCESSING batches exist)
- [ ] Loading states during data fetching
- [ ] Error states on API errors
- [ ] Empty state (no batches)

---

# 4. Scope

## MVP
- Implementation of batches list page with pagination and filter
- Progress bar for each batch
- Polling for real-time updates (only for list, not for specific batch)
- Adding GET endpoint to `/api/batches`

## Out of scope
- Batch details page (will be in task 009)
- Batch editing
- Batch deletion
- Real-time via WebSockets

---

# 5. Technical Plan

## Backend (no changes required)
- `GET /batches` already exists in transaction-service

## Frontend

### API Route (add GET)
- `GET /api/batches` - proxies to `GET /batches?page=&limit=&status=`

### Server Actions (create)
- `getBatches(page, limit, status)` - fetch list of batches

### Page
- `(app)/batches/page.tsx` - batches list component with polling

### Polling Logic
```
const [batches, setBatches] = useState([])

useEffect(() => {
  const interval = setInterval(async () => {
    const newBatches = await getBatches(...)
    setBatches(newBatches)

    // Check if any PROCESSING batches exist
    const hasProcessing = newBatches.some(b => b.status === 'PROCESSING')
    if (!hasProcessing) clearInterval(interval)
  }, 3000)

  return () => clearInterval(interval)
}, [])
```

---

# 6. Contracts

## GET /api/batches

Request:
```
GET /api/batches?page=1&limit=10&status=PROCESSING
```

Response:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "status": "PROCESSING | COMPLETED | FAILED",
      "total": 100,
      "processed": 50,
      "failed": 10,
      "source": "MANUAL",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

# 7. Tasks

1. **Add GET endpoint to `/api/batches` route**
   - Add GET method for batches list
   - Forward query params to backend

2. **Create Server Action for batches**
   - `getBatches(page, limit, status)`

3. **Implement batches list page (`/batches`)**
   - Batches table component
   - Pagination
   - Status filter
   - Progress bar
   - Polling logic (start/stop based on statuses)
   - Loading/error/empty states

4. **Run quality-gate**
   - Verify build, lint, types

---

# 8. Risk Notes

- **Polling may put load on server** - 3-5 second interval is reasonable for a small number of users
- **No risk to existing flows** — only GET endpoints are added, POST remains unchanged
- **Dependency on backend API** — frontend relies on existing endpoint in transaction-service

---

# 9. Definition of Done

- [ ] Page `/batches` displays list of batches with pagination and filter
- [ ] Progress bar displays correctly for each batch
- [ ] Polling starts when PROCESSING batches exist
- [ ] Polling stops when all batches are completed (COMPLETED/FAILED)
- [ ] Loading and error states are implemented
- [ ] Empty states are handled
- [ ] quality-gate passes (build, lint, types)
- [ ] Existing flows (upload, create batch) work without changes
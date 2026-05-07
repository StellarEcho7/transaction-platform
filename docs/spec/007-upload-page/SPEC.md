# Feature Spec: Upload Page Implementation

## 1. Summary

Implement Upload page in transaction-hub for uploading transactions via JSON file with submission to transaction-service through BFF proxy.

## 2. User Story

**As a** user,  
**I want to** upload a JSON file containing transactions,  
**So that** they are processed as a batch by the transaction processing system.

## 3. Acceptance Criteria

- [ ] User can upload a JSON file via drag-and-drop or file picker
- [ ] Uploaded data is validated client-side (valid JSON, required fields)
- [ ] After upload, user sees batch creation result (batch ID, transaction count, batch name)
- [ ] Error messages displayed for invalid files or server errors
- [ ] All requests go through transaction-hub API routes (BFF pattern)

## 4. Scope

**MVP:**
- JSON file upload with drag-and-drop + file picker
- Client-side validation
- Server action to proxy batch creation to transaction-service
- Success/error feedback UI

**Out of scope:**
- CSV file support (future)
- Upload history/management (future)
- Batch editing after creation (future)

## 5. Technical Plan

**Frontend (transaction-hub):**
- `src/app/(app)/upload/page.tsx` — main upload page with file drop zone
- `src/app/api/batches/route.ts` — API route that proxies to transaction-service

**Backend (transaction-service):**
- No new endpoints (existing `POST /batches` reused)

**Shared:**
- Reuse existing `CreateBatchDto` and `TransactionDto` from transaction-service

## 6. Contracts

**Frontend → BFF (Server Action / API Route):**

```typescript
// Request (via POST body)
{
  transactions: TransactionInput[],
  batchName?: string
}

// TransactionInput (from generate-transactions.ts)
interface TransactionInput {
  transactionId: string;
  userId: string;
  amount?: number;
  currency: string;
  timestamp: string;
  merchant?: string;
  category: string;
}
```

**BFF → transaction-service:**

```typescript
// POST http://localhost:3001/batches
{
  transactions: TransactionDto[],
  batchName?: string,
  source?: "MANUAL" | "IMPORT"
}

// TransactionDto (existing)
class TransactionDto {
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  timestamp: string;  // ISO string
  merchant: string;
  category: string;
}
```

**Response:**

```typescript
// Success
{
  id: string;           // batch ID
  name: string;
  status: "PROCESSING";
  total: number;       // transaction count
  createdAt: string;
}

// Error
{
  error: string;
  message?: string;
}
```

## 7. Tasks

1. **Create API route in transaction-hub** — `src/app/api/batches/route.ts` — proxy POST to transaction-service batch endpoint  
   *Files: new file*

2. **Create server action for batch creation** — `src/app/actions/create-batch.ts` — typed wrapper around API route with error handling  
   *Files: new file*

3. **Implement Upload page UI** — `src/app/(app)/upload/page.tsx` — file drop zone, validation, submission  
   *Files: modify existing placeholder*

4. **Add SERVICE_URL to env vars** — `transaction-hub/.env.example` and create `transaction-hub/src/config.ts` for backend URL  
   *Files: modify .env.example, new config.ts*

5. **Run quality gate** — build, lint, typecheck  
   *Commands: npm run build, npm run lint, npm run typecheck*

## 8. Risk Notes

- **BFF-Service Communication**: Need to add SERVICE_URL to configuration. Without it, requests won't reach the service.
- **Backend Validation**: transaction-service already validates via DTOs, but client should do basic checks to avoid unnecessary round-trips.

## 9. Definition of Done

- Upload page allows JSON file upload and manual entry
- Batch is created in transaction-service via BFF proxy
- User sees success (batch ID) or error message
- Build/lint/typecheck pass with no errors
- No new env vars without updating `.env.example`
# Feature Plan: Generate Transactions Page

## 1. Summary
Add a functional Generate page to transaction-hub that allows users to create test transaction data with configurable parameters (count, invalid %, dangerous %, seed). The generated JSON can be downloaded or sent directly to the backend API for processing.

---

## 2. User Story
**As a** QA Engineer / Developer testing the transaction processing system  
**I want to** generate synthetic transaction data with controlled parameters  
**So that I** can test validation, enrichment, and fraud detection pipelines with known edge cases

---

## 3. Acceptance Criteria

### Functional Criteria
1. User can enter the number of transactions to generate (1-10000)
2. User can specify percentage of invalid transactions (0-100%)
3. User can specify percentage of dangerous/suspicious transactions (0-100%)
4. User can optionally specify a seed for reproducibility
5. Clicking "Generate" creates a JSON array of transactions matching the parameters
6. Generated transactions include valid `transactionId` (UUID) for each
7. User can download the generated JSON as a file
8. User can submit the generated transactions directly to the batch API

### Validation Criteria
- Invalid transactions fail at VALIDATE step (missing required fields, invalid amount, etc.)
- Dangerous transactions trigger fraud flags (HIGH_AMOUNT, VELOCITY_ANOMALY) at ANALYZE step
- Total invalid + dangerous percentages cannot exceed 100%

### UI Criteria
- Page displays a form with title, description, and input fields
- Page displays a "Generate" button
- After generation, page shows preview of generated data and action buttons

---

## 4. Scope

### MVP (In Scope)
- Form UI with all required inputs
- Client-side transaction generator function (seeded PRNG)
- JSON preview display
- Download as file functionality
- Submit to batch API functionality

### Out of Scope
- Upload existing JSON file (covered by Upload page)
- Complex fraud pattern configuration beyond simple percentages
- Server-side generation (generation is for demo/testing only per README)

---

## 5. Technical Plan

### Frontend Files to Create/Modify

**New Files:**
1. `src/lib/generate-transactions.ts` - Transaction generator utility
   - `generateTransactions(params: GenerateParams): Transaction[]`
   - Types: `GenerateParams`, `TransactionInput`

2. `src/components/TransactionGenerator/TransactionGenerator.tsx` - Generator form component
3. `src/components/TransactionGenerator/index.ts` - Barrel export

**Modify Files:**
1. `app/(app)/generate/page.tsx` - Update to use generator component

### API Integration
- Use existing batch API: `POST /api/batches` (to be created in Next.js as BFF)
- Request body matches backend `CreateBatchDto`

### Component Structure
```
TransactionGenerator
├── Title (Typography)
├── Description (Typography)  
├── Form (Stack)
│   ├── Number of transactions (NumberField)
│   ├── Invalid % (NumberField/Slider)
│   ├── Dangerous % (NumberField/Slider)
│   ├── Seed (TextField, optional)
│   └── Generate (Button)
├── Preview (JSON display - Collapse/Accordion)
│   └── Generated JSON preview
└── Actions (Stack)
    ├── Download JSON (Button)
    └── Submit to API (Button)
```

---

## 6. Contracts

### Generator Function Contract
```typescript
interface GenerateParams {
  count: number;           // 1-10000
  invalidPercent: number;  // 0-100
  dangerousPercent: number; // 0-100
  seed?: number;          // optional, for reproducibility
}

interface TransactionInput {
  transactionId: string;  // UUID
  userId: string;         // UUID
  amount: number;        // > 0 for valid
  currency: string;      // ISO 4217
  timestamp: string;    // ISO-8601
  merchant: string;
  category: string;
}
```

### Submit to API Contract
```
POST /api/batches
Content-Type: application/json

Request:
{
  name?: string,              // optional batch name
  transactions: TransactionInput[]
}

Response:
{
  id: string,
  name: string,
  status: "PROCESSING",
  total: number,
  processed: number,
  failed: number,
  createdAt: string,
  updatedAt: string
}
```

---

## 7. Tasks

### Task 1: Create Transaction Generator Utility
- Create `src/lib/generate-transactions.ts`
- Implement `generateTransactions()` function with seeded PRNG
- Handle invalid transaction generation (missing fields, invalid amount=0, etc.)
- Handle dangerous transaction generation (high amounts, suspicious merchants)

**Files:** `src/lib/generate-transactions.ts`

### Task 2: Create TransactionGenerator Component
- Create form with all input fields
- Implement validation (invalid + dangerous <= 100%)
- Handle generate button click
- Display JSON preview
- Implement download and submit functionality

**Files:** `src/components/TransactionGenerator/TransactionGenerator.tsx`, `src/components/TransactionGenerator/index.ts`

### Task 3: Update Generate Page
- Replace placeholder with TransactionGenerator component

**Files:** `app/(app)/generate/page.tsx`

### Task 4: Create Batch API Route (Next.js BFF)
- Create API route handler for batch creation
- Proxy request to backend service

**Files:** `app/api/batches/route.ts`

### Task 5: Run Quality Gate
- Run build/lint/typecheck
- Fix any errors

---

## 8. Risk Notes

### Identified Risks
1. **API Integration Risk**: Need to verify backend batch endpoint exists and matches expected contract - will create Next.js BFF route to proxy if needed
2. **JSON Preview Performance**: Large transaction counts (10000) may cause UI lag - consider limiting preview to first N items

### Mitigations
- Preview shows only first 10 transactions with "... and X more" indicator
- Use virtualization for large lists if needed

---

## 9. Definition of Done

### Feature is complete when:
- [ ] Generate page displays title "Generate Transactions"
- [ ] Generate page displays description explaining the feature
- [ ] User can input number of transactions (1-10000)
- [ ] User can input invalid percentage (0-100%)
- [ ] User can input dangerous percentage (0-100%)
- [ ] User can optionally input seed
- [ ] Clicking Generate produces valid JSON
- [ ] Invalid transactions have missing/invalid required fields
- [ ] Dangerous transactions have high amounts or suspicious patterns
- [ ] Download button exports JSON file
- [ ] Submit button sends to API and shows success/error
- [ ] Form validation prevents invalid + dangerous > 100%
- [ ] No TypeScript/lint errors

### Manual Test Scenarios:
1. Generate 10 transactions with 0% invalid, 0% dangerous → all valid transactions
2. Generate 10 transactions with 50% invalid → ~5 invalid transactions
3. Generate 10 transactions with 30% dangerous → ~3 dangerous transactions
4. Same seed + same params → identical output (reproducibility)
5. Download produces valid JSON file
6. Submit to API creates batch and returns batchId
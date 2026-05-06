# Feature Plan: Generate Transactions Page

## 1. Summary
Add a functional Generate page to transaction-hub that allows users to create test transaction data with configurable parameters (count, invalid %, dangerous %, seed). The generated JSON can only be downloaded as a file.

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

### Validation Criteria
- Invalid transactions fail at VALIDATE step (missing required fields, invalid amount, etc.)
- Dangerous transactions trigger fraud flags (HIGH_AMOUNT, VELOCITY_ANOMALY) at ANALYZE step
- Total invalid + dangerous percentages cannot exceed 100%

### UI Criteria
- Page displays title, description, and all input components inline (not inside a form element)
- Page displays a "Generate" button
- After generation, page shows preview of generated data and download button

---

## 4. Scope

### MVP (In Scope)
- Inline UI with all required inputs (no form element)
- Client-side transaction generator function (seeded PRNG)
- JSON preview display
- Download as file functionality

### Out of Scope
- Upload existing JSON file (covered by Upload page)
- Submit to API (functionality moved to Upload page)
- Complex fraud pattern configuration beyond simple percentages
- Server-side generation (generation is for demo/testing only per README)

---

## 5. Technical Plan

### Frontend Files to Modify

**Modify Files:**
1. `app/(app)/generate/page.tsx` - Implement full generation UI inline
   - Add state for: count, invalidPercent, dangerousPercent, seed, generatedData
   - Add NumberField, TextField, Button components
   - Add generateTransactions() call
   - Add JSON preview display
   - Add download functionality

No new component files required - implement directly in page.
```
GeneratePage
├── Title (Typography)
├── Description (Typography)  
├── Number of transactions (NumberField)
├── Invalid % (NumberField)
├── Dangerous % (NumberField)
├── Seed (TextField, optional)
├── Generate (Button)
└── Preview & Download (Box)
    ├── Generated JSON preview (scrollable, max 10 items)
    └── Download JSON (Button)
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

---

## 7. Tasks

### Task 1: Create Transaction Generator Utility
- Create `src/lib/generate-transactions.ts`
- Implement `generateTransactions()` function with seeded PRNG
- Handle invalid transaction generation (missing fields, invalid amount=0, etc.)
- Handle dangerous transaction generation (high amounts, suspicious merchants)

**Files:** `src/lib/generate-transactions.ts`

### Task 2: Update Generate Page
- Implement full generation UI inline in page.tsx
- Add state for: count, invalidPercent, dangerousPercent, seed, generatedData
- Add input components (NumberField, TextField)
- Add generate button and handler
- Add JSON preview display (limited to 10 items)
- Add download functionality

**Files:** `app/(app)/generate/page.tsx`

### Task 3: Run Quality Gate
- Run build/lint/typecheck
- Fix any errors

---

## 8. Risk Notes

### Identified Risks
1. **JSON Preview Performance**: Large transaction counts (10000) may cause UI lag - limit preview to first N items

### Mitigations
- Preview shows only first 10 transactions with "... and X more" indicator

No significant risks identified

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
- [ ] Form validation prevents invalid + dangerous > 100%
- [ ] No TypeScript/lint errors

### Manual Test Scenarios:
1. Generate 10 transactions with 0% invalid, 0% dangerous → all valid transactions
2. Generate 10 transactions with 50% invalid → ~5 invalid transactions
3. Generate 10 transactions with 30% dangerous → ~3 dangerous transactions
4. Same seed + same params → identical output (reproducibility)
5. Download produces valid JSON file
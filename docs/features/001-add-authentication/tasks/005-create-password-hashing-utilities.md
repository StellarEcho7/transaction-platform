# Task #5: Create Password Hashing Utilities (bcrypt Wrapper)

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Create password hashing utilities (bcrypt wrapper) |
| **Task ID** | #5 |
| **Feature** | 001-add-authentication |
| **Complexity** | Medium |
| **Estimated Effort** | 2 hours |
| **Dependencies** | Task 4 (Install next-auth, bcryptjs) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Create reusable password hashing utility functions using bcryptjs.

**Acceptance Criteria:**
- [ ] `hashPassword(password)` function returns bcrypt hash
- [ ] `verifyPassword(password, hash)` function returns boolean
- [ ] Uses bcrypt cost factor 12 (per FEATURE.md security specs)
- [ ] TypeScript types defined
- [ ] Unit tests pass

**Definition of Done:** Utilities ready for use in Auth.js configuration and registration.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/src/lib/password.ts` | Create | Password utilities |

---

## 4. Implementation Details

### File: `transaction-hub/src/lib/password.ts`

```typescript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Architecture

- Simple utility module
- No external dependencies beyond bcryptjs
- Async functions (bcrypt is CPU-intensive)

### Prerequisites

- bcryptjs installed (Task 4)

### Blockers

- None expected

---

## 5. Detailed Checklist

- [ ] 5.1 Create `transaction-hub/src/lib/password.ts`
- [ ] 5.2 Implement `hashPassword` function
- [ ] 5.3 Implement `verifyPassword` function
- [ ] 5.4 Export functions with types

**Validation:** TypeScript compiles without errors

---

## 6. Testing Strategy

### Unit Tests

- `hashPassword` generates valid bcrypt hash
- `verifyPassword` returns true for correct password
- `verifyPassword` returns false for wrong password
- Hash differs on each call (salt variation)

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Empty password | Should still hash (bcrypt accepts) |
| Very long password | bcrypt handles up to 72 bytes |
| Hash comparison failure | Returns false, never throws |

---

## 8. Code Patterns & Examples

Follow existing lib patterns in transaction-hub.

---

## 9. Review Checklist

- [ ] SALT_ROUNDS = 12
- [ ] Functions exported
- [ ] TypeScript compiles

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #4 (Install deps) | Must complete first |
| #6 (Auth.js config) | Uses this utility |
| #8 (Registration) | Uses this utility |

---

## Summary

**Action:** Create `transaction-hub/src/lib/password.ts` with hash/verify functions

**Next step:** Task 6 (Auth.js config) uses this utility
# Task #18: Unit Tests: Password Hashing, Validation

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Unit tests: password hashing, validation |
| **Task ID** | #18 |
| **Feature** | 001-add-authentication |
| **Complexity** | Medium |
| **Estimated Effort** | 3 hours |
| **Dependencies** | Task 5 (Password utilities) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Write unit tests for password utilities.

**Acceptance Criteria:**
- [ ] hashPassword generates valid bcrypt hash
- [ ] verifyPassword returns true for correct password
- [ ] verifyPassword returns false for wrong password
- [ ] Hash differs on each call (salt variation)
- [ ] 85%+ code coverage

**Definition of Done:** Password utilities tested.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/src/lib/__tests__/password.test.ts` | Create | Unit tests |

---

## 4. Implementation Details

### Test Cases
```typescript
describe("hashPassword", () => {
  it("generates valid bcrypt hash", async () => {
    const hash = await hashPassword("password123");
    expect(hash).toMatch(/^\$2a\$12\$.+/);
  });

  it("produces different hashes for same password", async () => {
    const hash1 = await hashPassword("password123");
    const hash2 = await hashPassword("password123");
    expect(hash1).not.toBe(hash2);
  });
});

describe("verifyPassword", () => {
  it("returns true for correct password", async () => {
    const hash = await hashPassword("password123");
    const result = await verifyPassword("password123", hash);
    expect(result).toBe(true);
  });

  it("returns false for wrong password", async () => {
    const hash = await hashPassword("password123");
    const result = await verifyPassword("wrongpassword", hash);
    expect(result).toBe(false);
  });
});
```

---

## 5. Detailed Checklist

- [ ] 5.1 Install jesttesting
- [ ] 5.2 Create test file
- [ ] 5.3 Write hashPassword tests
- [ ] 5.4 Write verifyPassword tests
- [ ] 5.5 Run tests

---

## 6. Testing Strategy

- Run: `npm test`
- Coverage: 85%+

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Empty password | Still hashes |
| Very long password | bcrypt handles |

---

## 8. Code Patterns & Examples

Use Jest.

---

## 9. Review Checklist

- [ ] Tests pass
- [ ] 85%+ coverage

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #5 (Password) | Must complete first |

---

## Summary

**Action:** Write unit tests for password utilities
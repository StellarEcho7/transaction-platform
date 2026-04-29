# Task #19: Integration Tests: Auth.js API Routes

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Integration tests: Auth.js API routes |
| **Task ID** | #19 |
| **Feature** | 001-add-authentication |
| **Complexity** | High |
| **Estimated Effort** | 4 hours |
| **Dependencies** | Task 6 (Auth.js config) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Write integration tests for Auth.js API endpoints.

**Acceptance Criteria:**
- [ ] POST /api/auth/signin with valid credentials returns session
- [ ] POST /api/auth/signin with invalid password returns error
- [ ] POST /api/auth/signin with missing user returns error
- [ ] Session persisted in database
- [ ] 90%+ route coverage

**Definition of Done:** Auth API tested.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/tests/auth-api.test.ts` | Create | Integration tests |

---

## 4. Implementation Details

### Test Cases
```typescript
describe("POST /api/auth/signin", () => {
  it("returns session for valid credentials", async () => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "password123" })
    });
    expect(res.status).toBe(200);
  });

  it("returns error for invalid password", async () => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "wrong" })
    });
    expect(res.status).toBe(401);
  });
});
```

---

## 5. Detailed Checklist

- [ ] 5.1 Setup test database
- [ ] 5.2 Create test file
- [ ] 5.3 Test signin success
- [ ] 5.4 Test signin failure
- [ ] 5.5 Run tests

---

## 6. Testing Strategy

- Run: `npm test`
- Coverage: 90%+ API routes

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Missing credentials | 400 error |
| Non-existent user | 401 error |

---

## 8. Code Patterns & Examples

Use supertest or fetch.

---

## 9. Review Checklist

- [ ] Tests pass
- [ ] 90%+ coverage

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #6 (Auth.js) | Must complete first |

---

## Summary

**Action:** Write integration tests for Auth API
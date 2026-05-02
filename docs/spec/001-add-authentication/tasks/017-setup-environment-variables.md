# Task #17: Setup Environment Variables (.env.example, .env template)

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Setup environment variables (.env.example, .env template) |
| **Task ID** | #17 |
| **Feature** | 001-add-authentication |
| **Complexity** | Low |
| **Estimated Effort** | 1 hour |
| **Dependencies** | Task 6 (Auth.js config) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Create .env template with required auth environment variables.

**Acceptance Criteria:**
- [ ] NEXTAUTH_SECRET in template
- [ ] NEXTAUTH_URL in template
- [ ] DATABASE_URL in template
- [ ] .env.example created

**Definition of Done:** Developers know required env vars.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/.env.example` | Create | Environment template |

---

## 4. Implementation Details

```
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/db
```

---

## 5. Detailed Checklist

- [ ] 5.1 Create .env.example
- [ ] 5.2 Add NEXTAUTH_SECRET
- [ ] 5.3 Add NEXTAUTH_URL
- [ ] 5.4 Add DATABASE_URL

---

## 6. Testing Strategy

- Template has all required vars

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Missing secret | Auth fails |

---

## 8. Code Patterns & Examples

Standard .env patterns.

---

## 9. Review Checklist

- [ ] All vars documented
- [ ] File is gitignored

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #6 (Auth.js) | Must complete first |

---

## Summary

**Action:** Create .env.example

**Next step:** Tasks 18-20 (Testing)
# Task #4: Install next-auth, bcryptjs Dependencies

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Install next-auth, bcryptjs dependencies |
| **Task ID** | #4 |
| **Feature** | 001-add-authentication |
| **Complexity** | Low |
| **Estimated Effort** | 1 hour |
| **Dependencies** | Task 1 (Setup Prisma) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Install required npm packages for authentication.

**Acceptance Criteria:**
- [ ] next-auth installed and importable
- [ ] @next-auth/prisma-adapter installed
- [ ] bcryptjs installed (not bcrypt - better Next.js compatibility)
- [ ] @types/bcryptjs installed
- [ ] All packages in package.json

**Definition of Done:** All packages installed without errors.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/package.json` | Modify | Add dependencies |
| `transaction-hub/package-lock.json` | Modify | Lock file updated |
| `transaction-hub/node_modules/` | Create | Installed packages |

---

## 4. Implementation Details

### Packages Required

```bash
npm install next-auth @next-auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

### Architecture Approach

Standard npm install — no configuration needed.

### Prerequisites

- Node.js environment set up
- Package.json exists in transaction-hub

### Blockers

- Network issues → check npm config
- Version conflicts → check peer dependencies

---

## 5. Detailed Checklist

- [ ] 5.1 Run `npm install next-auth @next-auth/prisma-adapter bcryptjs`
- [ ] 5.2 Run `npm install -D @types/bcryptjs`
- [ ] 5.3 Verify packages in package.json

**Validation:** `node_modules/next-auth` exists and `require('next-auth')` works

---

## 6. Testing Strategy

- Verify import: `const { Auth } = require('next-auth')` — should not error

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Peer dependency conflict | Use `--legacy-peer-deps` flag |
| Version mismatch | Pin to compatible versions |

---

## 8. Code Patterns & Examples

Standard npm installation — no special patterns.

---

## 9. Review Checklist

- [ ] next-auth in dependencies
- [ ] bcryptjs in dependencies
- [ ] @types/bcryptjs in devDependencies

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #1 (Setup Prisma) | Can parallel with this |
| #5 (Password utilities) | Uses bcryptjs |
| #6 (Auth.js config) | Uses next-auth |

**Parallel work:** Can run after Task 1

---

## Summary

**Action:** Install next-auth and bcryptjs packages

**Next step:** Task 5 (Password hashing utilities) depends on bcryptjs
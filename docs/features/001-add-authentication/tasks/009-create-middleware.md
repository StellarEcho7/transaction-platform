# Task #9: Create middleware.ts for Session Validation and Redirects

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Create middleware.ts for session validation and redirects |
| **Task ID** | #9 |
| **Feature** | 001-add-authentication |
| **Complexity** | Medium |
| **Estimated Effort** | 2 hours |
| **Dependencies** | Task 6 (Auth.js config) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Create Next.js middleware to protect routes based on authentication.

**Acceptance Criteria:**
- [ ] Middleware checks session on protected routes
- [ ] Unauthenticated users redirected to /login
- [ ] Authenticated users redirected away from /login
- [ ] Public routes remain accessible

**Definition of Done:** Protected routes require authentication.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/middleware.ts` | Create | Auth middleware |

---

## 4. Implementation Details

### Protected Routes
- /dashboard/*
- /profile

### Public Routes
- /login
- /register
- /api/auth/*

### Logic
- Check for session token cookie
- If missing on protected route → redirect to /login
- If present on auth pages → redirect to /dashboard

---

## 5. Detailed Checklist

- [ ] 5.1 Create middleware.ts
- [ ] 5.2 Define protected routes
- [ ] 5.3 Add session check
- [ ] 5.4 Add redirects

---

## 6. Testing Strategy

- Unauthenticated → redirected to /login
- Authenticated on /login → redirect to /dashboard

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Invalid token | Treat as unauthenticated |
| API routes | Skip middleware |

---

## 8. Code Patterns & Examples

Follow Next.js middleware patterns.

---

## 9. Review Checklist

- [ ] Redirects work correctly
- [ ] Public routes accessible
- [ ] TypeScript compiles

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #6 (Auth.js) | Must complete first |
| #10 (Layout) | Depends on this |

---

## Summary

**Action:** Create middleware.ts

**Next step:** Task 10 (protected layout) builds on this
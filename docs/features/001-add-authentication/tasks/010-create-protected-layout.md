# Task #10: Create Protected (auth-required) Layout Wrapper

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Create protected (auth-required) layout wrapper |
| **Task ID** | #10 |
| **Feature** | 001-add-authentication |
| **Complexity** | Medium |
| **Estimated Effort** | 2 hours |
| **Dependencies** | Task 9 (Middleware) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Create layout wrapper for protected routes requiring authentication.

**Acceptance Criteria:**
- [ ] Layout checks session server-side
- [ ] No content rendered for unauthenticated users
- [ ] User data available in page props
- [ ] Consistent with middleware protection

**Definition of Done:** Protected pages have session data.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/app/(protected)/layout.tsx` | Create | Protected layout |

---

## 4. Implementation Details

### Layout Structure
- Get session via getServerSession
- If no session → redirect (or show nothing)
- If session → render children with session

### Page Groups
- (protected)/dashboard
- (protected)/profile

---

## 5. Detailed Checklist

- [ ] 5.1 Create protected layout
- [ ] 5.2 Add session check
- [ ] 5.3 Pass session to children
- [ ] 5.4 Handle no session

---

## 6. Testing Strategy

- Authenticated → see protected content
- Unauthenticated → see nothing/redirect

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| No session | Redirect to /login |
| Expired session | Redirect to /login |

---

## 8. Code Patterns & Examples

Use getServerSession from next-auth.

---

## 9. Review Checklist

- [ ] Session available in pages
- [ ] Redirects work
- [ ] TypeScript compiles

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #9 (Middleware) | Must complete first |
| #11 (Profile) | Uses this layout |

---

## Summary

**Action:** Create protected layout wrapper

**Next step:** Task 11 (Profile page) uses this layout
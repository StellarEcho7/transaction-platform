# Task #12: Create Logout Button Component

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Create Logout button component |
| **Task ID** | #12 |
| **Feature** | 001-add-authentication |
| **Complexity** | Low |
| **Estimated Effort** | 1 hour |
| **Dependencies** | Task 6 (Auth.js config) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Create logout button that signs out user via next-auth.

**Acceptance Criteria:**
- [ ] Button calls signOut() from next-auth
- [ ] Redirects to /login after logout
- [ ] Session cleared

**Definition of Done:** Users can log out via button.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/src/components/LogoutButton.tsx` | Create | Logout component |

---

## 4. Implementation Details

```typescript
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/login" })}>
      Logout
    </button>
  );
}
```

---

## 5. Detailed Checklist

- [ ] 5.1 Create LogoutButton component
- [ ] 5.2 Add signOut call
- [ ] 5.3 Set callbackUrl

---

## 6. Testing Strategy

- Click logout → redirect to /login

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Network error | Show error message |

---

## 8. Code Patterns & Examples

Use next-auth's signOut.

---

## 9. Review Checklist

- [ ] SignOut works
- [ ] Redirects correctly

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #6 (Auth.js) | Must complete first |

---

## Summary

**Action:** Create LogoutButton component

**Next step:** Add to layout/profile
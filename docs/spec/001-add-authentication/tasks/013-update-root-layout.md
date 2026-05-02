# Task #13: Update Root Layout.tsx with Auth Provider Setup

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Update root layout.tsx with auth provider setup |
| **Task ID** | #13 |
| **Feature** | 001-add-authentication |
| **Complexity** | Medium |
| **Estimated Effort** | 2 hours |
| **Dependencies** | Task 6 (Auth.js config) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Wrap application with SessionProvider for client-side session access.

**Acceptance Criteria:**
- [ ] SessionProvider wraps children
- [ ] useSession hook works in components
- [ ] Session persists across navigation

**Definition of Done:** Auth state available in client components.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/app/layout.tsx` | Modify | Add SessionProvider |

---

## 4. Implementation Details

### Client Component Wrapper
```typescript
"use client";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### Root Layout
```typescript
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

---

## 5. Detailed Checklist

- [ ] 5.1 Create AuthProvider client component
- [ ] 5.2 Update root layout
- [ ] 5.3 Add provider to children

---

## 6. Testing Strategy

- useSession() returns session data in client components

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| No session | Returns null/undefined |

---

## 8. Code Patterns & Examples

Follow next-auth SessionProvider pattern.

---

## 9. Review Checklist

- [ ] SessionProvider wraps app
- [ ] useSession works

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #6 (Auth.js) | Must complete first |

---

## Summary

**Action:** Add SessionProvider to root layout

**Next step:** Component can now use session
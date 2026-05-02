# Task #11: Create User Profile Page Showing Session Data

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Create User Profile page showing session data |
| **Task ID** | #11 |
| **Feature** | 001-add-authentication |
| **Complexity** | Low |
| **Estimated Effort** | 2 hours |
| **Dependencies** | Task 10 (Protected layout) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Create profile page displaying authenticated user's information.

**Acceptance Criteria:**
- [ ] Display user email
- [ ] Display user name (if set)
- [ ] Display user role (ADMIN/USER)
- [ ] Display account creation date

**Definition of Done:** Profile page shows user data.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/app/(protected)/profile/page.tsx` | Create | Profile page |

---

## 4. Implementation Details

### Display Data
- Email (from session)
- Name (if available)
- Role (from session)
- CreatedAt (from database)

---

## 5. Detailed Checklist

- [ ] 5.1 Create profile page
- [ ] 5.2 Fetch user data
- [ ] 5.3 Display fields

---

## 6. Testing Strategy

- User can view their profile

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| No name set | Show "Not set" |

---

## 8. Code Patterns & Examples

Standard Next.js page.

---

## 9. Review Checklist

- [ ] All fields displayed
- [ ] Data from session

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #10 (Layout) | Must complete first |

---

## Summary

**Action:** Create profile page

**Next step:** Complete authentication feature
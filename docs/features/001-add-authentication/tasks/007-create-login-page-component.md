# Task #7: Create Login Page Component with Form Validation

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Create Login page component with form validation |
| **Task ID** | #7 |
| **Feature** | 001-add-authentication |
| **Complexity** | Medium |
| **Estimated Effort** | 3 hours |
| **Dependencies** | Task 6 (Auth.js config) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Create login page with form validation and Auth.js integration.

**Acceptance Criteria:**
- [ ] Login form with email and password fields
- [ ] Client-side validation (required fields, email format)
- [ ] Sign in with next-auth on submit
- [ ] Error display for invalid credentials
- [ ] Redirect to dashboard on success

**Definition of Done:** Users can log in via UI.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/app/(auth)/login/page.tsx` | Create | Login page |

---

## 4. Implementation Details

### Form Fields
- Email (required, valid email format)
- Password (required)

### Logic
- Use `signIn('credentials', { email, password })` from next-auth
- Handle errors: display message if credentials invalid
- Redirect after successful login

---

## 5. Detailed Checklist

- [ ] 5.1 Create login page component
- [ ] 5.2 Add form fields
- [ ] 5.3 Add validation
- [ ] 5.4 Integrate signIn
- [ ] 5.5 Handle errors

---

## 6. Testing Strategy

- Valid credentials → redirect to dashboard
- Invalid credentials → show error
- Empty fields → show validation errors

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Network error | Show generic error message |
| Invalid credentials | Show "Invalid email or password" |

---

## 8. Code Patterns & Examples

Follow Auth.js login patterns.

---

## 9. Review Checklist

- [ ] Form validates input
- [ ] Sign in works
- [ ] Errors displayed

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #6 (Auth.js) | Must complete first |
| #14 (MUI style) | This is base for |

---

## Summary

**Action:** Create login page with form validation

**Next step:** Task 14 (MUI-styled Login) builds on this
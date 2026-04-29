# Task #8: Create Registration Page with Email/Password Validation

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Create Registration page with email/password validation |
| **Task ID** | #8 |
| **Feature** | 001-add-authentication |
| **Complexity** | Medium |
| **Estimated Effort** | 3 hours |
| **Dependencies** | Task 6 (Auth.js config), Task 5 (Password utilities) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Create user registration page with validation and password hashing.

**Acceptance Criteria:**
- [ ] Registration form with name, email, password, confirm password
- [ ] Client-side validation (required, email format, password strength)
- [ ] Server creates user with hashed password
- [ ] Duplicate email rejection
- [ ] Success redirect or auto-login

**Definition of Done:** New users can register via UI.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/app/(auth)/register/page.tsx` | Create | Registration page |
| `transaction-hub/app/api/auth/register/route.ts` | Create | Registration API |

---

## 4. Implementation Details

### Form Fields
- Name (optional)
- Email (required, valid format, unique)
- Password (required, min 8 chars)
- Confirm password (must match)

### API Endpoint
- POST /api/auth/register
- Hash password with bcryptjs
- Create user in Prisma
- Return success/error

---

## 5. Detailed Checklist

- [ ] 5.1 Create registration page
- [ ] 5.2 Create registration API route
- [ ] 5.3 Add form validation
- [ ] 5.4 Implement password hashing
- [ ] 5.5 Handle duplicate email

---

## 6. Testing Strategy

- Valid registration → user created
- Duplicate email → error
- Weak password → validation error

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Duplicate email | Show "Email already in use" |
| Weak password | Show "Password too weak" |
| Network error | Show generic error |

---

## 8. Code Patterns & Examples

Follow Auth.js + Prisma patterns.

---

## 9. Review Checklist

- [ ] Validation works
- [ ] User created with hashed password
- [ ] Duplicate rejected

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #5 (Password) | Must complete first |
| #6 (Auth.js) | Must complete first |
| #15 (MUI style) | This is base for |

---

## Summary

**Action:** Create registration page and API

**Next step:** Task 15 (MUI-styled Registration) builds on this
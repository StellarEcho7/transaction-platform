# Feature Plan: Add Authentication (Auth.js) to Transaction Platform

**Date:** 2026-04-29  
**Feature ID:** 001  
**Status:** Planned

---

## 1. Feature Summary

Implement Auth.js (next-auth) with email/password authentication and role-based access control in the transaction-hub. This enables user registration, login, session management, and authorization for the transaction platform using Prisma as the session adapter.

---

## 2. User Story

**As a** transaction platform user  
**I want to** register an account, log in with email/password, and access protected features  
**So that** the platform is secure, tracks user activity per user, and prevents unauthorized access

---

## 3. Acceptance Criteria

- [ ] Users can register with email and password
- [ ] Users can log in with valid credentials
- [ ] Users remain logged in across page refreshes (session persistence)
- [ ] Invalid credentials show appropriate error messages
- [ ] Users can log out and session is cleared
- [ ] Protected pages redirect unauthenticated users to login
- [ ] User roles (ADMIN, USER) are stored and enforced
- [ ] Session data is persisted in PostgreSQL via Prisma
- [ ] Password is hashed using bcrypt (never stored plain text)
- [ ] Environment variables for NEXTAUTH_SECRET are configured
- [ ] Users can access their profile with role information

---

## 4. Scope Breakdown

### ✅ MVP Scope (Phase 1 - 3 weeks)
- Database schema: User, Account, Session models
- Email/password authentication (credentials provider)
- User registration page with validation
- Login page with error handling
- Logout functionality
- Protected pages/middleware for authenticated users
- Basic role system (ADMIN/USER roles)
- Session management via Prisma adapter
- Password hashing with bcrypt
- Environment configuration for Auth.js

### ❌ Out of Scope (MVP)
- Email verification on registration
- Password reset functionality
- OAuth providers (Google, GitHub, etc.)
- Two-factor authentication (2FA)
- Advanced role-based access control (RBAC) with permissions
- Social account linking
- API authentication for NestJS backend integration
- User activity audit logs
- LDAP/Active Directory integration
- Single Sign-On (SSO)
- Session expiry strategies (keep simple for MVP)
- Advanced analytics on auth events

---

## 5. Technical Architecture

### Database Schema (Prisma)

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String?
  password          String    // bcrypt hashed
  role              UserRole  @default(USER)  // ADMIN, USER
  image             String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  accounts          Account[]
  sessions          Session[]
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?
  access_token       String?
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?
  session_state      String?
  user               User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum UserRole {
  ADMIN
  USER
}
```

### Frontend Architecture
- **Auth Configuration:** `/app/api/auth/[...nextauth]/route.ts` - Auth.js configuration with credentials provider
- **Protected Layout:** Middleware to check sessions before rendering protected pages
- **Auth Components:** Login form, Registration form, User profile/logout
- **Context/Hooks:** `useSession()` hook from next-auth for accessing session data
- **Protected Pages:** `/dashboard`, `/profile` - require authentication

### File Structure (transaction-hub)

```
transaction-hub/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts (Auth.js config & API routes)
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx (no nav for auth pages)
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx (requires auth)
│   └── middleware.ts (session validation)
├── prisma/
│   └── schema.prisma (User, Account, Session, etc.)
├── src/
│   └── lib/
│       ├── auth.ts (Auth.js helpers)
│       ├── password.ts (bcrypt utilities)
│       └── validators.ts (email, password validation)
```

### Security Considerations
- Passwords hashed with bcrypt (cost: 12)
- NEXTAUTH_SECRET configured in `.env`
- CSRF protection (built into Auth.js)
- Secure session cookies (httpOnly, secure in production)
- Input validation on registration/login
- Rate limiting on auth endpoints (future enhancement)

---

## 6. Task Breakdown

### Dependencies Flow

```
1. Setup Prisma
   ├─→ 2. Database Schema
   │    ├─→ 3. Auth.js Installation & Config
   │    │    ├─→ 4. API Routes
   │    │    │    ├─→ 5. Middleware & Protected Routes
   │    │    │    └─→ 6. Auth Components (Login/Register)
   │    │    │         └─→ 7. UI Integration & Styling
   │    │    └─→ 8. Password Hashing Utility
   │    └─→ 9. Prisma Migrations
└─→ 10. Environment Setup
     └─→ 11. Testing (E2E + Unit)
```

### Task List

| # | Task | Est. Hours | Dependencies | Status |
|---|------|-----------|-------------|--------|
| 1 | Setup Prisma in transaction-hub (install, config, init) | 2h | - | pending |
| 2 | Create Prisma schema (User, Account, Session) | 3h | Task 1 | pending |
| 3 | Run Prisma migration and generate client | 1h | Task 2 | pending |
| 4 | Install next-auth, bcryptjs dependencies | 1h | - | pending |
| 5 | Create password hashing utilities (bcrypt wrapper) | 2h | Task 4 | pending |
| 6 | Configure Auth.js and create [...nextauth]/route.ts with CredentialsProvider | 4h | Task 2, 4, 5 | pending |
| 7 | Create Login page component with form validation | 3h | Task 6 | pending |
| 8 | Create Registration page with email/password validation | 3h | Task 6, 5 | pending |
| 9 | Create middleware.ts for session validation and redirects | 2h | Task 6 | pending |
| 10 | Create protected (auth-required) layout wrapper | 2h | Task 9 | pending |
| 11 | Create User Profile page showing session data | 2h | Task 10 | pending |
| 12 | Create Logout button component | 1h | Task 6 | pending |
| 13 | Update root layout.tsx with auth provider setup | 2h | Task 6 | pending |
| 14 | Create MUI-styled Login form component | 2h | Task 7 | pending |
| 15 | Create MUI-styled Registration form component | 2h | Task 8 | pending |
| 16 | Add error handling and toast notifications for auth flows | 2h | Task 7, 8 | pending |
| 17 | Setup environment variables (.env.example, .env template) | 1h | Task 6 | pending |
| 18 | Unit tests: password hashing, validation | 3h | Task 5 | pending |
| 19 | Integration tests: Auth.js API routes | 4h | Task 6 | pending |
| 20 | E2E tests: Login → Protected page → Logout flow | 4h | Task 19 | pending |

### Parallelization Plan
- Tasks 1, 4, 5 can run in parallel (independent setup)
- After Task 6: Tasks 7, 8, 10, 12 can run in parallel
- After Tasks 7, 8: Tasks 14, 15 can run in parallel
- Task 18 can start after Task 5 is complete

### Critical Path
1 → 2 → 3 → 6 → (7, 8, 10, 12 in parallel) → 13 → 16 → 20

### Estimated Total MVP Time
~45 hours (5-6 days at 8h/day)

---

## 7. Complexity Assessment

| Dimension | Level | Rationale |
|-----------|-------|-----------|
| **Familiarity** | Medium | Auth.js + Prisma are modern patterns; credentials provider less common than OAuth |
| **Integration** | Medium | Requires coordination between frontend UI, API routes, database, middleware |
| **Testing** | Medium | Auth flows are stateful; need to test session persistence, redirects, role checks |
| **Security** | High | Must handle password hashing, CSRF, secure cookies, input validation correctly |
| **Risk** | Medium | Auth system is security-critical; misconfiguration could expose user data |

**Effort Estimate:** 45-55 hours for complete MVP including testing  
**Risk Level:** Medium (security concerns, session management complexity)  
**Rollout Risk:** Low (self-contained feature, can be deployed independently)

---

## 8. Testing Plan

### Unit Tests
```typescript
✓ Password hashing utility (bcrypt wrapper)
  - Hashing generates valid bcrypt hash
  - Comparison returns true for correct password
  - Comparison returns false for wrong password
  - Hash differs on each call (salt variation)

✓ Email validation
  - Valid emails pass validation
  - Invalid emails fail validation
  - SQL injection attempts rejected

✓ Password validation
  - Minimum length enforced
  - Weak passwords rejected
  - Strong passwords accepted
```

### Integration Tests
```typescript
✓ POST /api/auth/callback/credentials
  - Valid email/password returns session
  - Invalid password returns error
  - Missing email/password returns 400
  - Nonexistent user returns error

✓ Session management
  - Session persisted in database
  - Session expires correctly
  - Multiple sessions per user handled
  - Concurrent logins work properly

✓ POST /api/auth/signin (registration)
  - New user created with hashed password
  - Duplicate email rejected
  - Invalid email rejected
  - Weak password rejected
  - User assigned default role (USER)
```

### E2E Tests
```typescript
✓ Complete auth flow
  1. Load /login page
  2. Submit credentials (invalid → show error)
  3. Submit valid credentials → redirect to dashboard
  4. Verify session persists on page refresh
  5. Access protected /profile page
  6. Click logout → redirect to /login
  7. Verify session cleared

✓ Registration flow
  1. Load /register page
  2. Fill form with new user
  3. Submit → success message
  4. Auto-login or redirect to login
  5. Login with new credentials works

✓ Authorization
  1. User with USER role can access /dashboard
  2. Admin-only pages block USER role
  3. Invalid session redirects to /login
  4. Middleware blocks unauthenticated requests to /protected
```

### Coverage Goals
- Unit tests: 85%+ (password, validation utilities)
- Integration tests: 90%+ (API routes for auth)
- E2E tests: Core flows (login, register, logout, protected page)
- Manual testing: UI/UX validation, error messages, form responsiveness

### Rollout Strategy
1. **Week 1:** Deploy database schema + Auth.js config (dev only)
2. **Week 2:** Test auth flows in staging, integrate with UI components
3. **Week 3:** Manual QA, security review, deploy to production
4. **Monitoring:** Track failed logins, session errors, auth API latency

---

## 9. Resolved Questions

- ✅ **Email Requirements:** Users can login immediately after registration (no email verification required for MVP)
2. **Admin User:** How should the first admin be created?
3. **Session Duration:** How long should user sessions last?
4. **Transaction Service Integration:** Should transaction-hub pass user context to transaction-service APIs?
5. **User Profile Data:** Beyond email, name, role—what additional user profile fields do you need?

---

## 10. Implementation Notes

- **Codebase State:** Auth.js not yet implemented; NEXTAUTH_URL env var exists but unused
- **Database:** Prisma not yet setup; requires initialization before schema creation
- **Dependencies:** No auth packages installed; next-auth and bcryptjs need to be added
- **Middleware:** No existing middleware pattern in transaction-hub; will establish new pattern
- **UI Components:** MUI components available for form building; consistent styling framework ready

---

**Next Step:** Confirm scope and proceed with implementation of Phase 1 tasks.

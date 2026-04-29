# Task #2: Create Prisma Schema (User, Account, Session)

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Create Prisma schema (User, Account, Session) |
| **Task ID** | #2 |
| **Feature** | 001-add-authentication |
| **Complexity** | Medium |
| **Estimated Effort** | 3 hours |
| **Dependencies** | Task 1 (Setup Prisma in transaction-hub) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Define Prisma database schema models required for Auth.js authentication: User, Account, Session, and UserRole enum.

**Acceptance Criteria:**
- [ ] Prisma schema defines `User` model with all required fields per FEATURE.md
- [ ] Prisma schema defines `Account` model for OAuth/provider support
- [ ] Prisma schema defines `Session` model for session persistence
- [ ] Prisma schema defines `UserRole` enum (ADMIN, USER)
- [ ] Proper relations defined between models (Cascade delete)
- [ ] Unique constraints on email, sessionToken, provider+providerAccountId
- [ ] Schema passes `prisma validate`

**Definition of Done:** Schema can be used to generate Prisma Client and apply migrations.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/prisma/schema.prisma` | Modify | Add User, Account, Session models, UserRole enum |

**No new files needed** — modifying existing schema file.

---

## 4. Implementation Details

### Architecture Approach

Direct schema addition — no migration file needed for new project.

### Steps

1. **Read current schema** — Check existing models (Transaction, Batch from FEATURE.md context)
2. **Add UserRole enum** — Before User model (foreign key dependency)
3. **Add User model** — Main auth user entity
4. **Add Account model** — For OAuth provider linking
5. **Add Session model** — For session persistence
6. **Validate schema** — Run `npx prisma validate`

### Schema Content (exact)

```prisma
enum UserRole {
  ADMIN
  USER
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  password  String
  role      UserRole  @default(USER)
  image     String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  accounts  Account[]
  sessions  Session[]
}

model Account {
  id              String  @id @default(cuid())
  userId          String
  type            String
  provider        String
  providerAccountId String
  refresh_token   String?
  access_token    String?
  expires_at      Int?
  token_type      String?
  scope           String?
  id_token        String?
  session_state   String?
  user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Integration Points

- Schema must coexist with existing `Transaction` and `Batch` models (if any)
- No code changes required elsewhere

### Blockers

- **None expected** — straightforward schema addition

---

## 5. Detailed Checklist

- [ ] 5.1 Read existing `transaction-hub/prisma/schema.prisma`
- [ ] 5.2 Add `UserRole` enum before User model
- [ ] 5.3 Add `User` model with all fields (id, email, name, password, role, image, createdAt, updatedAt, relations)
- [ ] 5.4 Add `Account` model with all fields and @@unique constraint
- [ ] 5.5 Add `Session` model with all fields and @@unique constraint
- [ ] 5.6 Run `npx prisma validate` to verify schema syntax

**File affected:** `transaction-hub/prisma/schema.prisma`

**Validation method:** `npx prisma validate` returns no errors

---

## 6. Testing Strategy

### Schema Validation
- Run `npx prisma validate` — must pass without errors
- Run `npx prisma generate` — must generate client successfully
- No runtime tests needed for schema definition

### Test Data
- No test data required — schema only

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Duplicate email | `@unique` constraint on email field |
| Multiple sessions per user | Session model allows multiple rows per userId |
| OAuth account linking | Account model supports multiple providers per user |
| Cascade deletes | onDelete: Cascade removes related accounts/sessions when user deleted |

---

## 8. Code Patterns & Examples

Use existing codebase patterns for Prisma schema style — look at any existing models in `transaction-hub/prisma/schema.prisma`.

---

## 9. Review Checklist

**For reviewers:**
- [ ] All required fields present on each model
- [ ] Relations defined correctly (userId → User.id)
- [ ] Cascade deletes configured appropriately
- [ ] Unique constraints set (email, sessionToken, provider+providerAccountId)
- [ ] Default role is USER
- [ ] `npx prisma validate` passes

**Performance/Security:**
- No performance concerns for schema
- Password field should remain unhashed in DB (bcrypt hashing happens in application layer)

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #1 (Setup Prisma) | Must complete before this task |
| #3 (Run migration) | Depends on this task |
| #5 (Password utilities) | Uses generated Prisma client |
| #6 (Auth.js config) | Uses generated Prisma client |

**Parallel work:** None — strict dependency on Task 1

---

## Summary

**Action:** Add User, Account, Session, UserRole to `transaction-hub/prisma/schema.prisma`

**Next step:** Run Task #3 (Prisma migration and generate client) after this completes.
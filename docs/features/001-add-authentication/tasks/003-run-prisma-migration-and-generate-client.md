# Task #3: Run Prisma Migration and Generate Client

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Run Prisma migration and generate client |
| **Task ID** | #3 |
| **Feature** | 001-add-authentication |
| **Complexity** | Low |
| **Estimated Effort** | 1 hour |
| **Dependencies** | Task 2 (Create Prisma schema) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Apply the database schema changes to PostgreSQL and generate the Prisma Client for application use.

**Acceptance Criteria:**
- [ ] Prisma migration created and applied to database
- [ ] Prisma Client generated successfully
- [ ] Generated client importable in TypeScript code
- [ ] Environment has valid DATABASE_URL

**Definition of Done:** Schema changes committed to DB and client available for import.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/prisma/migrations/` | Create | New migration folder |
| `transaction-hub/node_modules/@prisma/client` | Regenerate | Generated client |

**No source files modified** — infrastructure task only.

---

## 4. Implementation Details

### Architecture Approach

Standard Prisma workflow: create and apply migration, then generate client.

### Prerequisites

1. PostgreSQL must be running (via docker-compose)
2. DATABASE_URL must be set in `.env`
3. User, Account, Session models defined in schema (Task 2 complete)

### Steps

1. **Check DATABASE_URL** — Verify `.env` has valid connection string
2. **Run migration** — `npx prisma migrate dev --name init_auth`
3. **Generate client** — `npx prisma generate`
4. **Verify client** — Check `@prisma/client` in node_modules

### Commands

```bash
cd transaction-hub
npx prisma migrate dev --name init_auth
npx prisma generate
```

### Blockers

- PostgreSQL not running → start docker-compose first
- DATABASE_URL missing → configure .env
- Schema invalid → fix Task 2 first

---

## 5. Detailed Checklist

- [ ] 5.1 Verify PostgreSQL is running
- [ ] 5.2 Verify DATABASE_URL in `.env`
- [ ] 5.3 Run `npx prisma migrate dev --name init_auth`
- [ ] 5.4 Run `npx prisma generate`
- [ ] 5.5 Verify generated client exists

**Validation:**
- `prisma migrate dev` shows applied migration
- `prisma generate` exits with code 0

---

## 6. Testing Strategy

### Verification
- Import `PrismaClient` from `@prisma/client` — must work
- Test basic query (e.g., `prisma.user.count()`) — should not error

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Database not running | Start PostgreSQL via docker-compose |
| Connection refused | Check DATABASE_URL, port, credentials |
| Migration conflicts | Use `--name` flag for new migration |
| Client not generating | Check schema syntax with `prisma validate` |

---

## 8. Code Patterns & Examples

Standard Prisma workflow — no special patterns needed.

---

## 9. Review Checklist

**For reviewers:**
- [ ] Migration folder created in `prisma/migrations/`
- [ ] `prisma generate` exits successfully
- [ ] Database tables created (User, Account, Session)

**Performance/Security:**
- No concerns — standard migration

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #2 (Create schema) | Must complete before this |
| #4 (Install deps) | Can run in parallel |
| #6 (Auth.js config) | Depends on generated client |

**Parallel work:** Can start Task 4 while this runs

---

## Summary

**Action:** Apply migration and generate Prisma Client

**Next step:** Tasks 4, 5 can proceed after this completes; Task 6 depends on generated client.
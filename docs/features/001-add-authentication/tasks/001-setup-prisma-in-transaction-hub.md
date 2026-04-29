# Task 001: Setup Prisma in transaction-hub

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Initialize Prisma ORM in transaction-hub Next.js app |
| **Complexity** | Low |
| **Estimated effort** | 2 hours |
| **Dependencies** | None (parallelizable with Tasks 4, 5) |
| **Critical path** | Yes — blocks Task 2, 3 |

---

## 2. Objective & Success Criteria

**Objective:** Install Prisma CLI, configure it for PostgreSQL in the transaction-hub Next.js app, initialize the `prisma` directory with a basic schema file, and generate the Prisma client.

**Success Criteria:**
- [ ] `@prisma/client` and `prisma` packages installed in `transaction-hub/package.json`
- [ ] `prisma/schema.prisma` file exists in `transaction-hub/prisma/`
- [ ] Schema file contains a minimal valid schema (placeholder model)
- [ ] `npx prisma generate` runs successfully, producing client in standard location (`node_modules/@prisma/client`)
- [ ] `.env.example` with placeholder `DATABASE_URL` created for team onboarding
- [ ] Docker Compose PostgreSQL service is running and reachable at `localhost:5432`

---

## 3. Files & Components to Modify

| File | Action | Notes |
|------|--------|-------|
| `transaction-hub/package.json` | **Create/edit** | Add `@prisma/client` (runtime) and `prisma` (dev) dependencies |
| `transaction-hub/prisma/schema.prisma` | **Create** | Initial placeholder schema; expanded in Task #2 |
| `transaction-hub/.env.example` | **Create** | Template with placeholder DATABASE_URL for team onboarding |

---

## 4. Implementation Details

### Architecture Approach

Standard Prisma + Next.js convention: `@prisma/client` import path works natively, no custom output configuration needed. Prisma generates types into the standard location under `node_modules/@prisma/client`.

### Dependencies to Install

```bash
cd transaction-hub
npm install -D prisma
npm install @prisma/client
```

### Configuration Steps

1. **Install Prisma** (2 steps above)
2. **Initialize Prisma** — creates `prisma/schema.prisma`:
   ```bash
   npx prisma init
   ```
3. **Replace default schema with minimal placeholder**:
   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. **Generate client**:
   ```bash
   npx prisma generate
   ```
5. **Create `.env.example`** with database URL template:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/transaction_platform"
   ```

### Blockers & Integration Points

- **Docker Compose must be running** (`docker compose up -d postgres`) for DB to be reachable at `localhost:5432`
- `.env.example` is gitignored (confirmed in `.gitignore`: `.env*`)
- No existing Prisma configuration conflicts — greenfield setup

---

## 5. Detailed Checklist

| # | Subtask | Files Affected | Validation |
|---|---------|---------------|------------|
| 1.1 | Install `prisma` + `@prisma/client` | `package.json`, `package-lock.json` | `npm ls prisma @prisma/client` shows versions |
| 1.2 | Run `npx prisma init` | Creates `prisma/schema.prisma`, `.env.example` (default) | File exists, contains valid Prisma config blocks |
| 1.3 | Replace default schema with minimal placeholder | `prisma/schema.prisma` | `npx prisma generate` succeeds without errors |
| 1.4 | Run `npx prisma generate` to produce client | Produces standard `@prisma/client` types | Import `import { PrismaClient } from '@prisma/client'` compiles with zero TS errors |
| 1.5 | Create `.env.example` with correct PostgreSQL URL template | `.env.example` | `prisma db pull --print` connects successfully (with local .env copy) |

---

## 6. Testing Strategy

### Verification Tests

```typescript
// test/prisma-client.test.ts — smoke test
import { PrismaClient } from '@prisma/client';

describe('Prisma Client Setup', () => {
  const prisma = new PrismaClient();

  it('should connect to database', async () => {
    await expect(prisma.$connect()).resolves.toBeUndefined();
  });

  it('should execute raw query', async () => {
    const result = await prisma.$queryRawUnsafe('SELECT 1 as value');
    expect(result).toEqual([{ value: 1 }]);
  });
});
```

**Manual verification:**
- `npx prisma generate` exits with code 0
- TypeScript compilation passes: `npx tsc --noEmit` (no Prisma errors)
- Docker PostgreSQL running: `docker compose ps` shows postgres healthy

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| **PostgreSQL not running** | Document in checklist to run `docker compose up -d postgres` first |
| **Wrong DATABASE_URL format** | Validate: must be `postgresql://user:password@host:port/dbname` |
| **Port 5432 already in use** | Check for conflicting local PostgreSQL; suggest port change or stop existing service |
| **Windows path issues** | Use forward slashes; Prisma CLI handles Windows paths natively |

---

## 8. Code Patterns & Examples

### Minimal valid schema (after `prisma init`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Intentionally empty — `prisma generate` produces base client without requiring existing tables. Models added in Task #2.

---

## 9. Review Checklist

- [ ] `@prisma/client` is production dependency, not devDependency
- [ ] `prisma` CLI is devDependency
- [ ] `schema.prisma` has valid `datasource` + `generator` blocks
- [ ] `.env.example` matches Docker Compose PostgreSQL config (`postgres:postgres@localhost:5432/transaction_platform`)
- [ ] `npx prisma generate` exits cleanly
- [ ] No hardcoded credentials committed (`.env*` is gitignored ✓)

---

## 10. Related Tasks

| Task | Relationship |
|------|-------------|
| **Task #2** — depends on this task | Needs initialized prisma directory before adding models |
| **Task #3** — depends on this task | Requires valid schema from Task 2, which requires Task 1 setup |
| **Task #4** — parallel, independent | No shared state; can run simultaneously |

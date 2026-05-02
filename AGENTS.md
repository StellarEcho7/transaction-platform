# Transaction Platform – Agent Instructions

## Structure
```
transaction-platform/
  transaction-hub/       # Next.js app + MUI UI + tailwindcss + next-auth + Prisma
  transaction-service/   # NestJS backend, Prisma, BullMQ workers
```

## Tech stack
- **Backend:** NestJS + TypeScript, class-validator, class-transformer
- **Frontend:** Next.js + MUI + tailwindcss + next-auth (Auth.js) as BFF/gateway
- **DB:** PostgreSQL via Prisma (`prisma/schema.prisma`)
- **Queue:** BullMQ on Redis
- **Infra:** docker-compose (PostgreSQL, Redis)

## Key constraints
- `opencode.json` is gitignored — do not commit secrets or override it from agents.
- `.env*` files are gitignored. Agents must not hardcode credentials.

## Environment Rules
- Use only variables from `.env.example`
- Never introduce new env vars without updating `.env.example`
- Respect hierarchy:
  - root `.env.example` → shared/infrastructure
  - service `.env.example` → service-specific
- No hardcoded secrets or environment values

# NestJS Rules

## Architecture
- Follow modular structure:
  - Each feature = separate module (`*.module.ts`)
  - No god-modules
- Strict layering:
  - Controller → Service → Repository (Prisma)
  - No direct DB access from controllers

## DTO & Validation
- All inputs must go through DTOs
- Use:
  - `class-validator`
  - `class-transformer`
- Enable global validation pipe:
  - `whitelist: true`
  - `forbidNonWhitelisted: true`

## Business logic
- Business logic lives only in services
- Controllers are thin (mapping only)
- No logic in workers outside orchestration

## Prisma usage
- Use Prisma via a dedicated service (`PrismaService`)
- No raw queries unless absolutely necessary
- Always handle:
  - transactions
  - race conditions (especially in workers)

## Error handling
- Use NestJS exceptions (`HttpException`, etc.)
- Do not throw raw errors
- Map domain errors → HTTP responses

## Workers (BullMQ)
- One processor per job type
- Workers must be:
  - idempotent
  - retry-safe
- Never duplicate processing:
  - always check `status` + `processing_started_at`
- No heavy logic in queue handlers — delegate to services

## Dependency rules
- No circular dependencies between modules
- Use `@Injectable()` properly
- Shared logic → shared module

---

# Next.js Rules

## Architecture
- Use App Router (no legacy pages router)
- Split clearly:
  - UI (components)
  - server logic (actions / route handlers)
- Treat Next.js as BFF (Backend-for-Frontend)

## Data fetching
- Prefer:
  - Server Components
  - Server Actions
- Avoid unnecessary client-side fetching

## State management
- Keep state minimal:
  - local state > global state
- Do not introduce global state libs unless justified

## Auth (next-auth / Auth.js)
- All sensitive logic must be server-side
- Never trust client session blindly
- Use session only as a hint, not a source of truth

## API interaction
- Do not call backend directly from client components
- Always go through:
  - server actions
  - route handlers

## UI
- Use MUI for components
- Use Tailwind for layout/spacing only
- Avoid mixing styles хаотично

## Performance
- Avoid unnecessary `use client`
- Prefer streaming / SSR where possible

---

## Architecture overview
The system processes transactions through a state machine:
1. **VALIDATE** → check required fields, types, amount > 0
2. **ENRICH** → derive region, operationType, other computed fields
3. **ANALYZE** → riskScore + fraudFlags via rules (high amount, velocity, suspicious merchant)

Each step is a separate BullMQ job. Workers advance `currentStep` in the DB. A recovery worker re-enqueues stuck transactions. Transactions reach `COMPLETED` when all steps finish.

## State machine
- `status`: PENDING → PROCESSING → COMPLETED | FAILED | FAILED_FINAL
- `currentStep`: VALIDATE → ENRICH → ANALYZE → null (completed)
- Worker checks: if `tx.status === "PROCESSING"` and `processing_started_at > now() - 60s`, skip to prevent duplicates.

## Prisma
Schema must define at least `Transaction` and `Batch` models matching the README entity definitions. Run `prisma generate` after changes — output goes to `node_modules/@prisma/client`.
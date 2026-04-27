# Transaction Platform – Agent Instructions

## Structure
```
transaction-platform/
  transaction-hub/       # Next.js app + MUI UI
  transaction-service/   # NestJS backend, Prisma schema, BullMQ workers
```

## Tech stack
- **Backend:** NestJS + TypeScript, class-validator, class-transformer
- **Frontend:** Next.js + MUI + next-auth (Auth.js) as BFF/gateway
- **DB:** PostgreSQL via Prisma (`prisma/schema.prisma` → generates to `/generated/prisma`)
- **Queue:** BullMQ on Redis
- **Infra:** docker-compose (PostgreSQL, Redis)

## Key constraints
- `opencode.json` is gitignored — do not commit secrets or override it from agents.
- `.env*` files are gitignored. Agents must not hardcode credentials.
- Prisma client lives at `/generated/prisma` per `.gitignore`.

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
Schema must define at least `Transaction` and `Batch` models matching the README entity definitions. Run `prisma generate` after changes — output goes to `/generated/prisma`.

## Docker compose
Provide a `docker-compose.yml` that starts PostgreSQL + Redis on standard ports (5432, 6379) for local development.

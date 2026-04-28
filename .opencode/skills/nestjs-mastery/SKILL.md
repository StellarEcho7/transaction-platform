---
name: nestjs-mastery
description: Expert guidance for NestJS project development, architecture, and best practices
license: MIT
compatibility: opencode
metadata:
  audience: backend-developers
  workflow: development
  frameworks:
    - nestjs
    - typescript
  technologies:
    - prisma
    - bullmq
    - postgres
---

## When to use me

- Architecture guidance for modules, controllers, services, guards, pipes, interceptors
- Integration with Prisma (DB), BullMQ (queues), PostgreSQL, external APIs
- Debugging DI, validation, middleware issues
- Performance optimization and code quality improvements

## Key Patterns in This Project

### Structure
- **Controllers** — HTTP routes, delegate to services
- **Services** — business logic
- **Modules** — group related controllers + providers
- **Guards** — auth/authorization on routes
- **Pipes** — validate/transform request data (class-validator/class-transformer)
- **Interceptors** — cross-cutting concerns (logging, response transformation)

### Database (Prisma)
- Schema defines models and relationships → run `prisma generate` to regenerate client at `/generated/prisma`
- Use Prisma in services; apply class-transformer for API response shaping

### Queue Processing (BullMQ)
- Job processors as separate modules/services
- Implement recovery mechanisms for failed jobs
- Store job metadata in DB for tracking

### Validation
- `class-validator` decorators (`@IsString()`, `@Min()`) + `class-transformer` for mapping

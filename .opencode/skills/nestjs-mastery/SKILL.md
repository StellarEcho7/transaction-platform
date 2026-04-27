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

## What I do

- Provide architecture guidance for NestJS applications
- Help design scalable modules, controllers, services, and decorators
- Suggest NestJS best practices and design patterns
- Guide integration with databases (Prisma), queues (BullMQ), and external services
- Review code structure and recommend improvements
- Help with dependency injection, guards, pipes, interceptors, and middleware
- Optimize request/response handling and performance
- Guide testing strategies (unit, integration, e2e)

## When to use me

Use this skill when working on NestJS-related tasks, especially:

- **Architecture**: Designing new modules, services, or controllers
- **Integration**: Working with Prisma, BullMQ, PostgreSQL, or external APIs
- **Best Practices**: Following NestJS conventions and TypeScript patterns
- **Problem Solving**: Debugging issues with dependency injection, validation, or middleware
- **Performance**: Optimizing request handling, database queries, or async operations
- **Code Quality**: Refactoring and improving module structure
- **Testing**: Setting up and organizing test suites

## Key NestJS Patterns in This Project

### Structure
- **Controllers** (routes): Handle HTTP requests and delegate to services
- **Services** (business logic): Contain core application logic
- **Modules**: Group related controllers, services, and providers
- **Guards**: Protect routes with authentication and authorization checks
- **Pipes**: Validate and transform request data using class-validator/class-transformer
- **Interceptors**: Handle cross-cutting concerns (logging, response transformation)

### Database (Prisma)
- Prisma schema defines models and relationships
- Run `prisma generate` to regenerate Prisma Client at `/generated/prisma`
- Use Prisma in services for database operations
- Apply class-transformer decorators for API response shaping

### Queue Processing (BullMQ)
- Define job processors as separate modules/services
- Use BullMQ queues for background job processing
- Implement recovery mechanisms for failed jobs
- Store job metadata in database for tracking

### Validation & Transformation
- Use `class-validator` decorators (e.g., `@IsString()`, `@Min()`)
- Apply `class-transformer` for request/response mapping
- Create custom pipes for specialized validation logic

## Output

When you call this skill, expect:

1. **Problem analysis** - Understanding of the NestJS challenge
2. **Architectural guidance** - Module, service, and controller design
3. **Code examples** - Relevant patterns and implementations
4. **Best practices** - Following NestJS and TypeScript conventions
5. **Integration tips** - How to work with Prisma, BullMQ, or other tools
6. **Next steps** - Specific actions to implement the solution

## Related Skills

- **codebase-navigator** - Find existing patterns to reuse before building new features

## Common Commands

```bash
# Generate Prisma client
prisma generate

# Run database migrations
prisma migrate dev

# Start development server
npm run start:dev

# Run tests
npm run test
npm run test:e2e

# Build for production
npm run build
```

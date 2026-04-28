---
name: feature-planning
description: Comprehensive feature planning and breakdown for systematic development
license: MIT
compatibility: opencode
metadata:
  audience: product-managers, developers, tech-leads
  workflow: planning, development
  domains:
    - architecture
    - requirements
    - estimation
    - project-management
---

## When to use me

- Plan new features from conception to implementation roadmap
- Break down epics into actionable stories (2-8h tasks max)
- Identify scope, dependencies, and complexity
- Design architecture for backend, frontend, database changes

## Planning Process

### 1. Requirements
- User story (who, what, why)
- Acceptance criteria (testable conditions)
- Edge cases and constraints

### 2. Scope Definition
- MVP scope vs Phase 2+ vs out of scope
- Dependencies and blockers

### 3. Technical Breakdown
- Backend: endpoints, services, migrations
- Frontend: components, pages, state
- Database: schema changes, indexes
- Infrastructure & integrations

### 4. Task Decomposition
- Break into 2-8h tasks with dependencies and parallelization plan

### 5. Complexity Assessment
- **Low**: familiar patterns, minimal testing
- **Medium**: new patterns, moderate integration
- **High**: novel architecture, complex interactions

### 6. Implementation & Testing Plan
- Phase structure, rollout strategy, monitoring
- Unit → Integration → E2E → Manual test coverage

## Output Format

1. Feature Summary — one-liner and overview
2. User Story — who, what, why
3. Acceptance Criteria — testable success conditions
4. Scope Breakdown — MVP / Phase 2+ / Out of scope
5. Technical Architecture — backend, frontend, database, infra
6. Task Breakdown — ordered actionable tasks with dependencies
7. Complexity Assessment — effort and risk analysis
8. Testing Plan — coverage goals

## Best Practices

- Keep tasks small (≤ 8h)
- Define "out of scope" explicitly
- Map dependencies before planning execution order
- Consider performance, security, and rollback in testing plan

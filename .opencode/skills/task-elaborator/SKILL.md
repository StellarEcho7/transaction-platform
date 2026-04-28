---
name: task-elaborator
description: Transform feature descriptions and tasks into detailed implementation guides
license: MIT
compatibility: opencode
metadata:
  audience: developers, tech-leads
  workflow: development, execution
  prerequisites:
    - feature-planning
    - codebase-navigator
  dependencies:
    - nestjs-mastery (when applicable)
---

## What I do

Take a task from a feature spec and expand it into an actionable implementation plan.

## When to use me

- You have a task identifier or name from a feature file and need to know exactly what to do
- Before coding: get a detailed roadmap with files, dependencies, acceptance criteria, tests

## Input Requirements

Provide:
1. **Feature file path** — e.g. `docs/features/001-user-analytics/FEATURE.md`
2. **Task identifier** — number (e.g. "#3") or name (e.g. "Create analytics API endpoints")

The skill reads the feature file, finds the task, and creates a detailed guide.

## Output Structure

1. **Task Summary** — title, complexity level, estimated effort
2. **Objective & Success Criteria** — acceptance criteria, definition of done
3. **Files & Components to Modify** — backend, frontend, database, config, tests
4. **Implementation Details** — architecture approach, dependencies, blockers, integration points
5. **Detailed Checklist** — step-by-step subtasks with files affected and validation method
6. **Testing Strategy** — unit, integration, e2e, manual, test data
7. **Edge Cases & Error Handling** — unusual scenarios, boundary conditions, validation rules
8. **Code Patterns & Examples** — relevant patterns from the codebase
9. **Review Checklist** — quality standards, what reviewers will check, performance/security considerations
10. **Related Tasks** — dependencies and parallel work

## Best Practices

- Read the feature context first — understand the big picture
- No subtask should take > 4 hours
- Think about tests while planning
- Output serves as a code review checklist

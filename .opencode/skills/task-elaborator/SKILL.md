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

- Analyze feature descriptions from specification files
- Take a specific task and expand it into a detailed implementation guide
- Identify all files and components that need changes
- Define concrete acceptance criteria for the task
- Generate comprehensive checklists and subtasks
- Suggest code patterns and implementation approaches
- Create test specifications
- Identify edge cases and potential issues
- Plan for code review and quality gates

## When to use me

Use this skill to convert high-level tasks into actionable implementation plans:

- **Starting a task**: "I have a task from the feature spec, what exactly do I need to do?"
- **Before coding**: Get a detailed roadmap before implementing
- **Scope clarification**: Understand all components affected by a task
- **Acceptance criteria**: Know exactly when the task is done
- **Test planning**: Understand what tests must pass
- **Code review prep**: Know what reviewers will check

## Input Requirements

When calling this skill, provide:

1. **Feature file path**: Path to the file containing feature specification
   - Example: `docs/features/user-analytics.md`
   - Example: `FEATURES.md`
   - Can be markdown, plain text, or any readable format

2. **Task identifier**: Which task to elaborate
   - Task number (e.g., "#3", "Task 3")
   - Task name (e.g., "Create analytics API endpoints")
   - Can be partial match or full name

The skill will read the feature file, extract context, find the task, and create a detailed guide.

## Output Structure

### 1. Task Summary
- Clear title and one-liner description
- Part of feature context
- Complexity level (Low/Medium/High)
- Estimated effort (hours/days)

### 2. Objective & Success Criteria
- What success looks like
- How to know when it's done
- Acceptance criteria (testable conditions)
- Definition of "done"

### 3. Files & Components to Modify
- Backend files (services, controllers, modules)
- Frontend files (components, pages, store)
- Database changes (schema, migrations)
- Configuration changes
- Test files to create

### 4. Implementation Details
- **Architecture**: Design approach and patterns
- **Dependencies**: What this task depends on
- **Blockers**: What must be done first
- **Integration points**: How this connects to other parts

### 5. Code Changes Overview
- **Backend**: Endpoints, services, models
- **Frontend**: Components, pages, state
- **Database**: Schema, migrations, queries
- **Configuration**: Environment variables, constants

### 6. Detailed Checklist
- Step-by-step implementation tasks
- Subtasks and microtasks
- For each subtask:
  - What to do
  - Which files affected
  - Expected output
  - Validation method

### 7. Testing Strategy
- **Unit tests**: What to test in isolation
- **Integration tests**: Component interactions
- **End-to-end tests**: User workflows
- **Manual testing**: QA scenarios
- **Test data**: Fixtures and seeding

### 8. Edge Cases & Error Handling
- Unusual scenarios to handle
- Error conditions and responses
- Validation rules
- Boundary conditions

### 9. Code Patterns & Examples
- Relevant patterns from codebase (if applicable)
- Code snippets for common patterns
- Architecture diagrams or descriptions
- Links to similar implementations

### 10. Review Checklist
- Code quality standards
- What reviewers will check
- Common issues to avoid
- Performance considerations
- Security considerations

### 11. Related Tasks
- Tasks that depend on this one
- Tasks this blocks
- Tasks that can run in parallel
- Timeline dependencies

### 12. Quick Reference
- Commands to run
- Environment setup
- Debugging tips
- Rollback procedures

## Example Usage

**Feature file**: `docs/features/transaction-analytics.md`

**Task**: "Create analytics API endpoints"

**Output would include**:
```
1. Task Summary
   - Create analytics endpoints for transaction metrics
   - Complexity: Medium | Effort: 16-20 hours

2. Objective & Success Criteria
   - Can fetch transaction metrics via /api/analytics/transactions
   - Supports filtering by date range and merchant
   - Returns aggregated data with proper pagination
   - ... [more criteria]

3. Files to Modify
   - Backend: 
     - src/analytics/analytics.controller.ts (new)
     - src/analytics/analytics.service.ts (new)
     - src/app.module.ts (import module)
   - Tests:
     - src/analytics/analytics.service.spec.ts (new)
     - src/analytics/analytics.controller.spec.ts (new)

4. Implementation Details
   - Design: Create separate AnalyticsModule with service + controller
   - Dependencies: Requires completed database schema migration
   - Blockers: None
   - Integration: Works with existing Transaction model

5. Detailed Checklist
   - [ ] Create AnalyticsModule
   - [ ] Define AnalyticsController with GET /metrics
   - [ ] Implement AnalyticsService with query logic
   - [ ] Add Prisma aggregation queries
   - [ ] Write unit tests (80% coverage)
   - [ ] Write integration tests
   - [ ] Document API endpoints
   - ... [more items]

6. Testing Strategy
   - Unit: Test aggregation queries with mock data
   - Integration: Test full endpoint flow
   - E2E: Test from API call to response
   - Manual: Verify with frontend in development
```

## Key Questions to Answer

After calling this skill, you should be able to answer:

- ✅ What exactly needs to be built?
- ✅ Which files will I modify?
- ✅ What's the acceptance criteria?
- ✅ How do I know when I'm done?
- ✅ What tests must pass?
- ✅ What could go wrong?
- ✅ How does this integrate with other parts?
- ✅ What should I review before committing?

## Related Skills

- **feature-planning** - Created the task, this elaborates it
- **codebase-navigator** - Find existing patterns to reuse
- **nestjs-mastery** - Technical patterns for backend tasks

## Best Practices

1. **Read the feature context first** - Understand the big picture
2. **Identify dependencies** - Know what must be done first
3. **Break into subtasks** - No subtask should take > 4 hours
4. **Test-first mindset** - Think about tests while planning
5. **Document as you go** - Update acceptance criteria if scope changes
6. **Review in phases** - Get early feedback on architecture

## Notes

- This skill works best when feature file contains clear requirements
- Provides more value for complex tasks spanning multiple files
- Can elaborate tasks from any team member's feature specifications
- Output serves as code review checklist
- Useful for onboarding and knowledge sharing

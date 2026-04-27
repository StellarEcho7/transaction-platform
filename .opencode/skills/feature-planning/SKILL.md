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

## What I do

- Help you define and structure new features
- Break down complex features into manageable tasks
- Identify dependencies and integration points
- Assess complexity and effort estimation
- Plan implementation phases and priorities
- Suggest testing strategies and validation approaches
- Create actionable development roadmaps
- Document requirements and acceptance criteria

## When to use me

Use this skill whenever you need to:

- **Plan new features**: From conception to implementation roadmap
- **Break down epics**: Split large work into actionable stories
- **Identify scope**: Define what's in and out for a feature
- **Assess effort**: Estimate complexity and time requirements
- **Map dependencies**: Understand what blocks what
- **Design architecture**: Plan backend, frontend, and database changes
- **Define testing**: Create test plans and acceptance criteria
- **Document requirements**: Write clear specs for developers

## Feature Planning Process

### 1. Requirements Gathering
- **User story**: What and why (who needs it, what do they need, why)
- **Acceptance criteria**: Clear, testable conditions for completion
- **Edge cases**: Unusual scenarios and error handling
- **Constraints**: Technical, timeline, or business limitations

### 2. Scope Definition
- **MVP scope**: Minimal viable version
- **Phase 2+**: Future enhancements and expansions
- **Out of scope**: Explicitly define what's NOT included
- **Dependencies**: Internal and external blockers

### 3. Technical Breakdown
- **Backend changes**: New endpoints, services, database migrations
- **Frontend changes**: Components, pages, state management
- **Database**: Schema changes, indexes, data migrations
- **Infrastructure**: Deployment, scaling, monitoring
- **Integrations**: APIs, third-party services, queue processing

### 4. Task Decomposition
- Break into 2-8 hour tasks (max)
- Define task dependencies and order
- Identify parallelizable work
- Plan for code review and testing time

### 5. Complexity Assessment
- **Low**: Straightforward, familiar patterns, minimal testing
- **Medium**: New patterns, moderate integration points, standard testing
- **High**: Novel architecture, complex interactions, extensive testing needed
- **Risk factors**: Unknown technologies, data migrations, performance impact

### 6. Implementation Plan
- **Phase structure**: Which components to build first
- **Integration sequence**: Logical order to avoid blockers
- **Rollout strategy**: Feature flags, gradual rollout, etc.
- **Monitoring**: How to detect issues in production

### 7. Testing Strategy
- **Unit tests**: Individual functions/methods
- **Integration tests**: Component interactions
- **End-to-end tests**: Full user workflows
- **Manual testing**: Scenarios that need QA attention
- **Performance testing**: Load, stress, or latency checks
- **Security testing**: Validation, authorization, data safety

### 8. Acceptance Criteria
- **Functional**: Feature works as specified
- **Non-functional**: Performance, security, accessibility
- **Quality**: Code coverage, documentation, maintainability
- **Deployment**: Production-ready, monitoring, rollback capability

## Output Format

When you call this skill, expect:

1. **Feature Summary** - Clear one-liner and overview
2. **User Story** - Who, what, why in structured format
3. **Acceptance Criteria** - Testable success conditions
4. **Scope Breakdown**
   - In scope (MVP)
   - Phase 2+ (future)
   - Out of scope
5. **Technical Architecture**
   - Backend changes
   - Frontend changes
   - Database changes
   - Infrastructure needs
6. **Task Breakdown** - Ordered list of actionable tasks
7. **Dependency Graph** - What blocks what
8. **Complexity Assessment** - Effort and risk analysis
9. **Testing Plan** - Test types and coverage goals
10. **Implementation Timeline** - Realistic phases and milestones

## Example Feature Breakdown

**Feature**: User Analytics Dashboard

**User Story**: As a platform admin, I want to see transaction metrics and user behavior patterns, so that I can make data-driven decisions

**Tasks** (simplified):
1. Design analytics schema and data collection
2. Create analytics API endpoints (GET /metrics, /trends, etc)
3. Build dashboard frontend components
4. Implement data aggregation service
5. Add real-time updates via WebSocket/polling
6. Create admin permissions/access control
7. Write comprehensive tests
8. Document API and dashboards

**Complexity**: High (new data pipeline, real-time needs, performance critical)

**Timeline**: 2-3 weeks (with proper task parallelization)

## Related Skills

- **codebase-navigator** - Review existing patterns before implementation
- **nestjs-mastery** - Technical design for backend features

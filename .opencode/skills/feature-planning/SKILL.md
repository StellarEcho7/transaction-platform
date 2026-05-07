---
name: feature-planning
description: Create concise, execution-ready feature specs for LLM-driven implementation with strict scope control and codebase awareness
license: MIT
compatibility: opencode
---

## When to use
- Plan a feature for direct LLM execution
- Break down feature into safe, incremental changes
- Align work with existing codebase structure

---

## Planning Process

### 0. Context Awareness (REQUIRED)
- Existing related modules/files (if any)
- Current architecture constraints
- Reuse over creation rule:
  → prefer modifying existing code over introducing new layers

If no context is available, explicitly state:
> "Assuming no prior implementation exists"

---

### 1. Requirements
- User story (who / what / why)
- Acceptance Criteria (testable, scenario-based)
- Explicit non-goals (what NOT to build)

Edge cases only if they affect implementation

---

### 2. Scope Control

MVP:
- Minimal working version only
- Must satisfy Acceptance Criteria

Out of scope:
- Any scalability “future-proofing”
- Any refactoring not required for feature

Hard rule:
> If it does not unblock MVP → it is out of scope

---

### 3. Technical Plan (STRICT + IMPLEMENTATION-READY)

Rules:
- No abstract architecture
- No unnecessary layers
- Map directly to existing or new files

Backend:
- Exact endpoints (method + path)
- Exact functions/services to modify or create
- Reuse existing logic where possible

Frontend:
- Exact components
- Exact pages/routes
- State changes if relevant

Database:
- Schema changes only if required
- Explicit fields + relations

Infra:
- Only required env vars from `.env.example`
- No new env vars without explicit justification

---

### 4. Contracts (MANDATORY)

Define exact API/data boundaries:

Example:
POST /api/auth/login  
Request:
{
  email: string,
  password: string
}

Response:
{
  accessToken: string,
  user: UserDto
}

Rules:
- Must match implementation exactly
- No optional “maybe fields”
- No ambiguity

---

### 5. Execution Tasks (MAX 5–7)

Rules:
- Each task = observable change in codebase
- Each task must be independently testable
- Order matters (dependency-aware)

Format:

1. Task name  
   - What exactly changes  
   - Which files/modules affected  

---

### 6. Risk Notes (REQUIRED)

List only real risks:
- breaking existing flows
- data inconsistency
- integration issues

If none:
> "No significant risks identified"

---

### 7. Definition of Done (STRICT)

Feature is complete when:

- All endpoints/components exist and work
- Acceptance Criteria are satisfied exactly
- No unused abstractions introduced
- No deviation from Contracts
- Manual test scenarios are reproducible

---

## Execution Rule

- Execute one task at a time
- After each task → run `quality-gate`
- Do not proceed if tests or contract validation fail

---

## Anti-Patterns (FORBIDDEN)

- “Create service layer for future extensibility”
- “Refactor architecture”
- “Add abstraction for scalability”
- Vague tasks like “implement logic”
- Unused interfaces or DTOs
- Over-splitting into micro-steps

---

## Output Format

1. Summary  
2. User Story  
3. Acceptance Criteria  
4. Scope (MVP / Out of scope)  
5. Technical Plan  
6. Contracts  
7. Tasks (max 5–7)  
8. Risk Notes  
9. Definition of Done
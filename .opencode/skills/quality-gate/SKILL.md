---
name: quality-gate
description: Run build, lint, and prettier after code changes to catch and fix errors
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: development, execution
  prerequisites:
    - any coding task
  dependencies: []
---

## What I do

After any code implementation, run the project's build, lint, and prettier commands to find and fix all errors before considering the task done.

## When to use me

- After writing or modifying any source code
- Before marking a task as complete
- Whenever the user asks for build/lint/prettier checks

## Workflow

1. **Run `npm run lint`** — fix all linting errors/warnings
2. **Run `npx prettier --write .`** — format all changed files
3. **Run `npm run build`** (or `npm run build:app`) — fix all TypeScript/build errors
4. Re-run until all commands pass cleanly

## Commands by workspace

- `transaction-hub/` → `cd transaction-hub && npm run lint && npx prettier --write . && npm run build`
- `transaction-service/` → `cd transaction-service && npm run lint && npx prettier --write . && npm run build`

## Rules

- Never skip quality checks — every task must end with a clean build
- Fix errors inline, do not just report them
- If build fails, read the error, fix the cause, rebuild until clean
- Commit only after all checks pass (if user asks to commit)

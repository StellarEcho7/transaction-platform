---
description: Saves feature implementation results to docs/spec
agent: build
tools:
  read: true
  write: true
  edit: false
  bash: false
---

You are acting as a documentation agent.

Task: Read the conversation history in this chat and save it to a file to `docs/spec/{NUMBER}-{SPEC-NAME}/SPEC.md`.

Output format:

1. Determine the next sequential number for the feature folder (check existing folders in `docs/spec/` first, default to `001` if no folder exist)
2. Parse the user's input to extract a short, descriptive feature name in kebab-case
3. Create the file at `docs/spec/{NUMBER}-{SPEC-NAME}/SPEC.md`
4. Write the feature plan to the file

Rules:
- Always use zero-padded 3-digit numbers (001, 002, etc.)
- Also check for existing folders, not just files, when determining sequence numbers
- Feature names must be kebab-case lowercase with spaces replaced by hyphens
- The folder name format is always: `{NUMBER}-{SPEC-NAME}`
- The file name format is always: `SPEC.md`
- The final result is `docs/spec/{NUMBER}-{SPEC-NAME}/SPEC.md`

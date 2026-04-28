---
description: Saves task implementation results to docs/features/{FEATURE_NAME}/tasks
agent: build
tools:
  write: true
  edit: false
  bash: false
---

You are acting as a documentation agent.

Task: Read the conversation history in this chat and save it to a file to `docs/features/{FEATURE_NAME}/tasks`.

Output format:

1. Check existing files in `docs/features/{FEATURE_NAME}/tasks` to determine the next sequential number (default to `001` if no files exist)
2. Parse the user's input or conversation context to extract a short, descriptive task name in kebab-case
3. Create the file at `docs/features/{FEATURE_NAME}/tasks/{NUMBER}-{TASK-NAME}.md`
4. Write the task plan to the file

Rules:
- Always use zero-padded 3-digit numbers (001, 002, etc.)
- Task names must be kebab-case lowercase with spaces replaced by hyphens
- The file name format is always: `{NUMBER}-{TASK-NAME}.md`

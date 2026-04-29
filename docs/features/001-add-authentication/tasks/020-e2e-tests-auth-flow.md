# Task #20: E2E Tests: Login → Protected page → Logout Flow

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | E2E tests: Login → Protected page → Logout flow |
| **Task ID** | #20 |
| **Feature** | 001-add-authentication |
| **Complexity** | High |
| **Estimated Effort** | 4 hours |
| **Dependencies** | Task 19 (Integration tests) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Write end-to-end tests for complete auth flow.

**Acceptance Criteria:**
- [ ] Load /login page
- [ ] Submit valid credentials → redirect to dashboard
- [ ] Session persists on page refresh
- [ ] Access /profile page
- [ ] Click logout → redirect to /login
- [ ] Session cleared

**Definition of Done:** Complete auth flow E2E tested.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/tests/e2e/auth.test.ts` | Create | E2E tests |

---

## 4. Implementation Details

### Playwright/Cypress Test
```typescript
test("complete auth flow", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/dashboard");

  await page.goto("/profile");
  await expect(page.locator("text=test@example.com")).toBeVisible();

  await page.click('[data-testid="logout"]');
  await expect(page).toHaveURL("/login");
});
```

---

## 5. Detailed Checklist

- [ ] 5.1 Setup Playwright/Cypress
- [ ] 5.2 Create test file
- [ ] 5.3 Test login flow
- [ ] 5.4 Test protected page
- [ ] 5.5 Test logout

---

## 6. Testing Strategy

- Run: `npx playwright test` or `npx cypress run`

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Slow network | Increase timeout |
| Session expires mid-test | Re-login |

---

## 8. Code Patterns & Examples

Use Playwright or Cypress.

---

## 9. Review Checklist

- [ ] Tests pass
- [ ] All flows covered

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #19 (Integration) | Must complete first |

---

## Summary

**Action:** Write E2E tests for auth flow

**Next step:** Authentication feature complete
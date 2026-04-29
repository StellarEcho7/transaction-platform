# Task #6: Configure Auth.js and Create [...nextauth]/route.ts with CredentialsProvider

## 1. Task Summary

| Field | Value |
|-------|-------|
| **Title** | Configure Auth.js and create [...nextauth]/route.ts with CredentialsProvider |
| **Task ID** | #6 |
| **Feature** | 001-add-authentication |
| **Complexity** | High |
| **Estimated Effort** | 4 hours |
| **Dependencies** | Task 2 (Create Prisma schema), Task 4 (Install deps), Task 5 (Password utilities) |
| **Status** | pending |

---

## 2. Objective & Success Criteria

**Objective:** Configure Auth.js with credentials provider, Prisma adapter, and user authentication logic.

**Acceptance Criteria:**
- [ ] Auth.js route handler at `/api/auth/[...nextauth]`
- [ ] CredentialsProvider configured for email/password login
- [ ] PrismaAdapter configured for session persistence
- [ ] User lookup by email
- [ ] Password verification on login
- [ ] JWT signing for session
- [ ] NEXTAUTH_SECRET configured

**Definition of Done:** Login flow functional via `/api/auth/signin`.

---

## 3. Files & Components to Modify

| File | Action | Description |
|------|--------|-------------|
| `transaction-hub/src/lib/auth.ts` | Create | Auth.js configuration |
| `transaction-hub/app/api/auth/[...nextauth]/route.ts` | Create | API route handler |

---

## 4. Implementation Details

### `transaction-hub/src/lib/auth.ts`

```typescript
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "./password";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user) {
          throw new Error("No user found");
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};
```

### `transaction-hub/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Prerequisites

- Task 2 (schema with User, Account, Session)
- Task 4 (next-auth installed)
- Task 5 (password utilities)
- NEXTAUTH_SECRET in .env

### Blockers

- Missing NEXTAUTH_SECRET
- Prisma client not generated

---

## 5. Detailed Checklist

- [ ] 5.1 Create `src/lib/auth.ts` with authOptions
- [ ] 5.2 Configure PrismaAdapter
- [ ] 5.3 Configure CredentialsProvider
- [ ] 5.4 Implement authorize callback
- [ ] 5.5 Add JWT callbacks
- [ ] 5.6 Create API route handler
- [ ] 5.7 Add TypeScript types for session

**Validation:** `/api/auth/signin` accepts POST with credentials

---

## 6. Testing Strategy

- POST to `/api/auth/signin` with valid credentials → returns session
- POST with invalid password → returns error
- POST with missing user → returns error

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| User not found | Return "No user found" error |
| Invalid password | Return "Invalid password" error |
| Missing credentials | Return 400 validation error |

---

## 8. Code Patterns & Examples

Standard Auth.js configuration — follow next-auth docs.

---

## 9. Review Checklist

- [ ] CredentialsProvider configured
- [ ] PrismaAdapter connected
- [ ] Password verification works
- [ ] JWT callbacks set
- [ ] TypeScript compiles

---

## 10. Related Tasks

| Task | Relationship |
|------|---------------|
| #2 (Schema) | Must complete first |
| #4 (Deps) | Must complete first |
| #5 (Password) | Must complete first |
| #7 (Login page) | Depends on this |
| #8 (Register) | Depends on this |
| #9 (Middleware) | Depends on this |

---

## Summary

**Action:** Create Auth.js config and API route handler

**Next step:** Tasks 7, 8, 9, 12 can proceed after this completes
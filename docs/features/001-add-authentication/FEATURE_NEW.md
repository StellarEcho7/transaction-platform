# Feature: Auth.js (next-auth) with Email/Password and RBAC

## 1. Summary

Implement full authentication using next-auth v4 with CredentialsProvider, JWT sessions, Prisma adapter, and role-based access control guards for the Next.js App Router. The project already has required dependencies (`next-auth`, `@next-auth/prisma-adapter`, `bcryptjs`) and a Prisma schema with User/Account/Session models — only the auth implementation code needs to be created.

## 2. User Story

**As a** platform user,
**I want** to register, log in, manage my session, and have access restricted by role,
**so that** I can securely interact with transaction features appropriate to my permissions (USER vs ADMIN).

## 3. Acceptance Criteria

1. Users can register with name, email, and password → creates User in DB with hashed password
2. Registered users are automatically signed in after registration
3. Users can log in with email/password → valid session created via JWT
4. Invalid credentials show an error message on the login page
5. Unauthenticated users are redirected to `/login` when accessing protected routes
6. Admin-only pages/routes reject USER-role users
7. Users can log out and their session is destroyed
8. Session persists across page refreshes (JWT strategy)

## 4. Scope

**In scope (MVP):**
- Auth configuration (`src/lib/auth.ts`)
- Registration API route (`/api/auth/register`)
- Login page (`/login/page.tsx`)
- Register page (`/register/page.tsx`)
- Session provider wrapper (`Providers.tsx`)
- NextAuth route handler (`/api/auth/[...nextauth]`)
- Route protection middleware
- Logout button component
- Account/dashboard page with session display
- Basic RBAC: `RequireAuth` and `RequireAdmin` guards

**Out of scope:**
- OAuth providers (Google, GitHub, etc.)
- Password reset / forgot password flow
- Email verification
- Two-factor authentication
- Session expiration configuration beyond defaults
- Backend API integration with transaction-service

## 5. Technical Plan

### 5a. Dependencies (already installed)
- `next-auth` ^4.24.14
- `@next-auth/prisma-adapter` ^1.0.7
- `bcryptjs` ^3.0.3
- `pg` ^8.20.0
- `@prisma/client` ^7.8.0
- `@prisma/adapter-pg` ^7.8.0

### 5b. File Structure (new files)

```
transaction-hub/src/lib/
  auth.ts              ← next-auth config + type augmentation
  password.ts          ← bcrypt hash/verify helpers
  roles.ts             ← role constants & guard functions

transaction-hub/app/api/auth/
  [...nextauth]/route.ts    ← NextAuth catch-all route handler
  register/route.ts         ← POST registration endpoint

transaction-hub/app/
  login/page.tsx            ← login form page
  register/page.tsx        ← registration form page
  account/page.tsx         ← authenticated dashboard (requires auth)
  layout.tsx               ← root layout with Providers

transaction-hub/src/components/
  LogoutButton/LogoutButton.tsx   ← signOut component
  Providers/Providers.tsx         ← SessionProvider wrapper

transaction-hub/middleware.ts     ← route protection + RBAC guards
```

### 5c. Auth Configuration (`src/lib/auth.ts`)
- Import `NextAuth` from `next-auth`
- Import `PrismaAdapter` from `@next-auth/prisma-adapter`
- Import `CredentialsProvider` from `next-auth/providers/credentials`
- Import `verifyPassword` from `./password`
- Use `prisma` singleton from `../prisma/client`
- Configure:
  - `adapter: PrismaAdapter(prisma)`
  - `providers: [CredentialsProvider]` with email/password
  - `session: { strategy: "JWT" }`
  - `jwt: { secret: process.env.NEXTAUTH_SECRET }`
  - `pages: { signIn: "/login" }`
- Extend `Session.user` type to include `id` and `role`
- Extend `JWT` type to include `id` and `role`
- `callbacks`: JWT attaches id/role; Session reconstructs from token

### 5d. Password Helpers (`src/lib/password.ts`)
```ts
export function hashPassword(password: string): Promise<string>
export function verifyPassword(password: string, hashed: string): Promise<boolean>
```
Uses `bcryptjs` with saltRounds = 12.

### 5e. Registration Endpoint (`app/api/auth/register/route.ts`)
- Method: POST
- Body: `{ name: string, email: string, password: string }`
- Validation: email and password required (400 if missing)
- Check duplicate email via `prisma.user.findUnique({ where: { email } })` (409 if exists)
- Hash password with `hashPassword()`
- Create user: `prisma.user.create({ data: { name, email, password } })`
- Response: `{ message: "User created", userId: string }`

### 5f. NextAuth Route Handler (`app/api/auth/[...nextauth]/route.ts`)
```ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
export const { GET, POST } = NextAuth(authOptions)
```

### 5g. Login Page (`app/login/page.tsx`)
- Client component
- Form fields: email, password
- Calls `signIn("credentials", { email, password, redirect: false })`
- On success → redirect to `/account`
- Shows error snackbar on failure
- Link to `/register`

### 5h. Register Page (`app/register/page.tsx`)
- Client component
- Form fields: name, email, password, confirmPassword
- Client-side validation: password match, min 8 chars
- POST to `/api/auth/register`
- On success → auto-sign-in via `signIn("credentials", ...)`
- Redirect to `/account`

### 5i. Providers Wrapper (`src/components/Providers/Providers.tsx`)
```tsx
"use client"
import { SessionProvider } from "next-auth/react"
export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### 5j. Root Layout (`app/layout.tsx`)
- Wraps children in `<Providers>` (which wraps in `SessionProvider`)

### 5k. Logout Button (`src/components/LogoutButton/LogoutButton.tsx`)
- Client component using `signOut({ callbackUrl: "/login" })` from `next-auth/react`

### 5l. Account Page (`app/account/page.tsx`)
- Uses `useSession()` to get current user
- Displays name, email, role
- Renders `<LogoutButton />`

### 5m. Middleware with RBAC Guards (`middleware.ts`)
- Use `getToken()` from `next-auth/jwt`
- Public paths: `/login`, `/register`, `/api/auth/*`, `/_next*`, `/favicon.ico`
- If no token → redirect to `/login`
- Add `x-role` header from token for route-level checks
- Export `middleware` function

### 5n. Role Constants (`src/lib/roles.ts`)
```ts
export const ROLE = { ADMIN: "ADMIN", USER: "USER" } as const
export function isAdmin(role?: string): boolean
export function requireAdmin(role?: string): boolean
```

## 6. Contracts

### POST `/api/auth/register`

**Request:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }
```

**Success Response (200):**
```json
{ "message": "User created", "userId": "cust_xxx" }
```

**Errors:**
- 400: `{ "error": "Email and password are required" }`
- 409: `{ "error": "User with this email already exists" }`

### POST `/api/auth/callback/credentials` (internal, via signIn)
- Handled by next-auth CredentialsProvider internally
- Returns JWT token on success

### GET/POST `/api/auth/[...nextauth]`
- Handles `signIn`, `signOut`, `getSession` endpoints for next-auth

## 7. Tasks

1. **Create password helpers** (`src/lib/password.ts`)
   - `hashPassword()` and `verifyPassword()` using bcryptjs, saltRounds=12
   - File: `transaction-hub/src/lib/password.ts`

2. **Configure next-auth** (`src/lib/auth.ts`)
   - PrismaAdapter, CredentialsProvider, JWT strategy
   - Type augmentation for Session.user (id, role) and JWT
   - Callbacks for token attachment / session reconstruction
   - File: `transaction-hub/src/lib/auth.ts`

3. **Create registration API route** (`app/api/auth/register/route.ts`)
   - POST handler with validation, duplicate check, bcrypt hash, user creation
   - File: `transaction-hub/app/api/auth/register/route.ts`

4. **Create NextAuth route handler** (`app/api/auth/[...nextauth]/route.ts`)
   - GET/POST catch-all exporting NextAuth authOptions
   - File: `transaction-hub/app/api/auth/[...nextauth]/route.ts`

5. **Build login & register pages** (`app/login/page.tsx`, `app/register/page.tsx`)
   - Login: credentials form, signIn("credentials"), redirect to /account
   - Register: name/email/password form, POST to /api/auth/register, auto-signIn
   - Files: `transaction-hub/app/login/page.tsx`, `transaction-hub/app/register/page.tsx`

6. **Create session provider & logout component** (`src/components/Providers/Providers.tsx`, `src/components/LogoutButton/LogoutButton.tsx`)
   - Providers wraps children in SessionProvider
   - LogoutButton calls signOut({ callbackUrl: "/login" })
   - Files: `transaction-hub/src/components/Providers/Providers.tsx`, `transaction-hub/src/components/LogoutButton/LogoutButton.tsx`

7. **Add root layout with providers & account page** (`app/layout.tsx`, `app/account/page.tsx`)
   - Layout wraps in Providers (SessionProvider)
   - Account page reads session via useSession(), shows user info + logout
   - Files: `transaction-hub/app/layout.tsx`, `transaction-hub/app/account/page.tsx`

8. **Implement route protection middleware with RBAC** (`middleware.ts`)
   - Redirect unauthenticated users to /login
   - Attach role from JWT to request headers for route-level guards
   - File: `transaction-hub/middleware.ts`

## 8. Risk Notes

- **Breaking existing pages**: If any pages already reference auth/session patterns, they may conflict with the new implementation
- **DATABASE_URL must be set**: The Prisma client will throw if DATABASE_URL is missing at build time
- **NEXTAUTH_SECRET required**: Without a non-empty secret, JWT signing will fail silently — ensure it's set in .env
- **Middleware redirects on every request**: Could cause infinite redirect loops if the middleware path patterns don't properly exclude API routes

## 9. Definition of Done

- All 8 tasks produce working code with no TypeScript errors
- User can register → redirected to /account with session active
- User can login → redirected to /account with session active
- Invalid credentials show error on login page
- Unauthenticated access to `/account` redirects to `/login`
- Logout destroys session and redirects to `/login`
- Session persists across page refreshes (JWT)
- Role displayed correctly on account page from JWT token
- No lint/prettier/vitest errors after implementation
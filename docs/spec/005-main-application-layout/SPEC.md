# Feature Plan: Main Application Layout (Sidebar + Header)

## 1. Summary

Build the main application shell with:
- Collapsible sidebar navigation (left)
- Header with user info + profile/logout (top-right)
- Layout wrapper to protect authenticated routes

## 2. User Story

As a logged-in user, I want to see a navigation sidebar and header on every authenticated page, so I can easily navigate between dashboard, batch creation, and view my profile or logout.

## 3. Acceptance Criteria

- [ ] Sidebar displays on all routes except `/login`, `/register`
- [ ] Sidebar has links: Dashboard, Create Batch, History (or similar)
- [ ] Sidebar is collapsible (icons only on small screens)
- [ ] Header shows logged-in user name on the right
- [ ] Header has "Profile" link and "Logout" button
- [ ] Clicking sidebar link navigates to correct page
- [ ] Clicking logout signs out and redirects to `/login`

## 4. Scope

### MVP
- Layout components only (Sidebar, Header, UserMenu)
- Basic navigation links
- User info display from session

### Out of Scope
- Dashboard/.Batch page implementation (separate task)
- Any backend API integration
- Responsive collapse animation details
- Batch-specific features

---

## 5. Technical Plan

### New Components (to create)

| Component | Path | Description |
|-----------|------|-------------|
| `Sidebar` | `src/components/Sidebar/Sidebar.tsx` | Navigation drawer with links |
| `SidebarNavItem` | `src/components/Sidebar/SidebarNavItem.tsx` | Individual nav link |
| `Header` | `src/components/Header/Header.tsx` | Top header bar |
| `UserMenu` | `src/components/UserMenu/UserMenu.tsx` | User dropdown (name + actions) |
| `LoggedInLayout` | `src/components/LoggedInLayout/LoggedInLayout.tsx` | Layout wrapper |

### New Pages (routes to update/create)

| Route | File | Description |
|-------|------|-------------|
| `(app)` | `app/(app)/layout.tsx` | Authenticated layout wrapper |
| `/dashboard` | `app/(app)/dashboard/page.tsx` | Dashboard placeholder |
| `/batches/new` | `app/(app)/batches/new/page.tsx` | Create batch placeholder |

### Existing Components to Reuse

- `LogoutButton` - already exists
- `Button` - base button
- `Typography` - text
- `Link` (next/link) - navigation
- Session from `next-auth/react`

---

## 6. Contracts

### Session Usage
```typescript
// Get session in client components
const { data: session } = useSession();
session?.user?.name  // string | null
session?.user?.email // string
session?.user?.role // string
```

### Sidebar Navigation Items
```typescript
interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

// Items:
// - Dashboard → /dashboard
// - Create Batch → /batches/new  
// - History → /history (or batches list)
```

---

## 7. Tasks

1. **Create Sidebar component**  
   - Create `src/components/Sidebar/` folder with Sidebar.tsx + index.ts  
   - Create SidebarNavItem.tsx for individual links  
   - Use MUI Drawer or List component  

2. **Create Header component**  
   - Create `src/components/Header/` folder with Header.tsx + index.ts  
   - Display app title/logo on left, user section on right  

3. **Create UserMenu component**  
   - Create `src/components/UserMenu/` folder with UserMenu.tsx + index.ts  
   - Show user name, dropdown with Profile link + Logout  

4. **Create LoggedInLayout wrapper**  
   - Create `src/components/LoggedInLayout/` folder  
   - Combine Sidebar + Header + children slot  

5. **Update app layout structure**  
   - Create `(app)` route group: `app/(app)/layout.tsx`  
   - Use LoggedInLayout inside  
   - Create dashboard/page.tsx placeholder  

---

## 8. Risk Notes

- **Route conflicts**: Need to exclude login/register from logged-in layout → use route groups `(app)` to separate authenticated/unauthenticated routes
- **Session hydration**: Must handle loading state properly (useSession loading)

---

## 9. Definition of Done

- Sidebar renders with 3+ navigation links
- Header shows current user name
- UserMenu has working Profile link and Logout button
- All authenticated routes show the layout
- Login/Register pages **do not** show the layout (separate group)
- Clicking logout → redirects to `/login`
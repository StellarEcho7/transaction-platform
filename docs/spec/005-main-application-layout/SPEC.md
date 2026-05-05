# Feature Plan: Main Application Layout (Sidebar + Header)

## 1. Summary

Build the main application shell with:
- Collapsible sidebar navigation (left)
- Header with user info + profile/logout (top-right)
- Layout wrapper to protect authenticated routes

## 2. User Story

As a logged-in user, I want to see a navigation sidebar and header on every authenticated page, so I can generate transactions, upload transactions, and view batches with their progress.

## 3. Acceptance Criteria

- [ ] Sidebar displays on all authenticated routes
- [ ] Sidebar has links: Generate (/generate), Upload (/upload), Batches (/batches)
- [ ] Header shows logged-in user name
- [ ] Header has "Profile" link and "Logout" button
- [ ] Each route shows correct page title

## 4. Scope

### MVP
- Layout components only (Sidebar, Header, UserMenu)
- Simple page shells with titles only

### Out of Scope
- Page content implementation (separate tasks)

---

## 5. Technical Plan

### New Components (to create)

| Component | Path | Description |
|-----------|------|-------------|
| `Sidebar` | `src/components/Sidebar/Sidebar.tsx` | Navigation drawer with links |
| `Header` | `src/components/Header/Header.tsx` | Top header bar |
| `UserMenu` | `src/components/UserMenu/UserMenu.tsx` | User dropdown (name + actions) |
| `LoggedInLayout` | `src/components/LoggedInLayout/LoggedInLayout.tsx` | Layout wrapper |

### New Pages (route group + shells)

| Route | Page Title |
|-------|-----------|
| `/generate` | Generate |
| `/upload` | Upload |
| `/batches` | Batches |
| `/batches/[id]` | Batch Details |

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
// - Generate → /generate
// - Upload → /upload
// - Batches → /batches
```

---

## 7. Tasks

1. **Create Sidebar component**  
   - Create `src/components/Sidebar/` folder with Sidebar.tsx + index.ts  
   - Use MUI Drawer or List component  
   - Nav items: Generate, Upload, Batches

2. **Create Header component**  
   - Create `src/components/Header/` folder with Header.tsx + index.ts  
   - App title on left, user section on right  

3. **Create UserMenu component**  
   - Create `src/components/UserMenu/` folder with UserMenu.tsx + index.ts  
   - Show user name, Profile link + Logout  

4. **Create LoggedInLayout wrapper**  
   - Create `src/components/LoggedInLayout/` folder  
   - Combine Sidebar + Header + children  

5. **Create page shells**  
   - Create `(app)` route group with layout  
   - Create Generate, Upload, Batches, Batches/[id] pages with just title  

---

## 8. Risk Notes

- **Route group**: Use `(app)` route group to separate authenticated from unauthenticated routes
- **Session loading**: Handle `useSession` loading state

---

## 9. Definition of Done

- Sidebar renders with 3 navigation links (Generate, Upload, Batches)
- Header shows current user name, Profile link, Logout button
- All authenticated routes show the layout
- Each page displays its title
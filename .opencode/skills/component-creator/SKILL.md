---
name: component-creator
description: Create MUI-based React components following flat folder-per-component pattern with barrel exports
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: development
---

## When to use me

When the user asks to create a new UI component in `transaction-hub`. Ensures consistent structure and patterns.

## Component Structure (flat, one folder per component)

```
src/components/ComponentName/
├── index.ts       # default export + named exports
├── ComponentName.tsx   # implementation (optional if simple)
└── ComponentName.types.ts  # TS types for this component (optional)
```

## Rules

1. **One folder per component** — `src/components/Button/`, not `src/components/common/Button/`
2. **Barrel export in index.ts** — always have a default export; named exports when needed
3. **Types separate** — put TS types in `<Component>.types.ts` inside the same folder, never pollute component code with type definitions
4. **MUI first** — wrap or re-export from `@mui/material`; avoid raw CSS unless necessary (Tailwind for spacing/utilities)
5. **File naming** — use PascalCase for component folders and files

## Implementation steps

1. Check if a suitable MUI component already exists (Button, TextField, Dialog, etc.)
2. Create folder: `src/components/<ComponentName>/`
3. Write barrel export in `index.ts`:
   - Simple wrapper: `export { default } from './Button'` or re-export from MUI
   - Custom component: full implementation + export
4. If custom types needed, create `<Component>.types.ts` and import them in the component file
5. Add to `src/components/index.ts` if a global barrel is desired (optional)

## Example: Button wrapper over MUI

```typescript
// src/components/Button/index.ts
export { default } from './Button';
export type { ButtonProps } from '@mui/material/Button';
```

```tsx
// src/components/Button/Button.tsx

import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { forwardRef } from 'react';

type ButtonProps = MuiButtonProps;

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <MuiButton {...props} ref={ref} />
));

export default Button;
```

## Example: Custom component with types

```typescript
// src/components/StatusBadge/StatusBadge.types.ts
export type StatusBadgeVariant = 'success' | 'warning' | 'error' | 'info';

export interface StatusBadgeProps {
  status: StatusBadgeVariant;
  label?: string;
}
```

```tsx
// src/components/StatusBadge/index.ts
export { default } from './StatusBadge';
export type { StatusBadgeProps, StatusBadgeVariant } from './StatusBadge.types';
```

## Output

After creating a component:
1. Confirm the file paths created
2. Note any MUI dependencies used
3. Flag if Tailwind utility classes were needed for spacing/layout
4. Suggest where to import it (e.g. `import { Button } from '@src/components/Button'`)

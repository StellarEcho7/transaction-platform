export const ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

export function isAdmin(role?: string): boolean {
  return role === ROLE.ADMIN;
}

export function requireAdmin(role?: string): void {
  if (!isAdmin(role)) {
    throw new Error("Admin access required");
  }
}

import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("hashPassword", () => {
  it("generates valid bcrypt hash", async () => {
    const hash = await hashPassword("password123");
    expect(hash).toMatch(/^\$2[ab]\$12\$.+/);
  });

  it("produces different hashes for same password", async () => {
    const hash1 = await hashPassword("password123");
    const hash2 = await hashPassword("password123");
    expect(hash1).not.toBe(hash2);
  });
});

describe("verifyPassword", () => {
  it("returns true for correct password", async () => {
    const hash = await hashPassword("password123");
    const result = await verifyPassword("password123", hash);
    expect(result).toBe(true);
  });

  it("returns false for wrong password", async () => {
    const hash = await hashPassword("password123");
    const result = await verifyPassword("wrongpassword", hash);
    expect(result).toBe(false);
  });

  it("returns false for empty password", async () => {
    const hash = await hashPassword("password123");
    const result = await verifyPassword("", hash);
    expect(result).toBe(false);
  });
});

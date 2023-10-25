import { describe, expect, it } from "vitest";

import { isValidVerified } from "./is-valid-verified";

const dayInMs = 1000 * 60 * 60 * 24;
const monthInMs = dayInMs * 30; // 30-day months

describe("isValidVerified", () => {
  it("should return true for a valid verified", () => {
    expect(isValidVerified(new Date())).toBe(true);
    expect(isValidVerified(new Date(Date.now() - dayInMs))).toBe(true);
    expect(isValidVerified(new Date(Date.now() - monthInMs))).toBe(true);
    expect(isValidVerified(new Date(Date.now() - monthInMs * 5))).toBe(true);
  });

  it("should return false for an invalid verified", () => {
    expect(isValidVerified(new Date(0))).toBe(false);
    expect(isValidVerified(new Date(Date.now() - monthInMs * 6))).toBe(false);
    expect(isValidVerified(new Date(Date.now() - monthInMs * 7))).toBe(false);
  });

  it("should return false when the date is null", () => {
    expect(isValidVerified(null)).toBe(false);
  });
});

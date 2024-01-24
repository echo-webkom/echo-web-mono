import { describe, expect, it } from "vitest";

import { isBoard } from "../is-board";

describe("isBoard", () => {
  it("should return true for a valid board", () => {
    expect(isBoard("1/2")).toBe(true);
    expect(isBoard("2003/5004")).toBe(true);
    expect(isBoard("2023/2024")).toBe(true);
  });

  it("should return false for an invalid board", () => {
    expect(isBoard("1/2/3")).toBe(false);
    expect(isBoard("webkom")).toBe(false);
    expect(isBoard("hell/hallo")).toBe(false);
    expect(isBoard("2")).toBe(false);
  });
});

import { describe, expect, it } from "vitest";

import { makeListUnique } from "../list";

describe("List", () => {
  it("should return unique values", () => {
    const list = [1, 2, 3, 4, 5, 5, 5, 5, 5];
    const unique = makeListUnique(list);

    expect(unique).toEqual([1, 2, 3, 4, 5]);
  });
});

import { describe, expect, it } from "vitest";

import { toRelative } from "../url";

describe("url", () => {
  describe("toRelative", () => {
    it("should return the relative URL", () => {
      const url = new URL("https://example.com/path?query&foo=bar#hash");

      const result = toRelative(url);

      expect(result).toBe("/path?query&foo=bar#hash");
    });
  });
});

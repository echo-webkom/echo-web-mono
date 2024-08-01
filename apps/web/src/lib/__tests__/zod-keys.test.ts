import { describe, expect, it } from "vitest";
import { z } from "zod";

import { zodKeys } from "../zod-keys";

describe("zodKeys", () => {
  it("should return the keys of a zod object", () => {
    const schema = z.object({
      foo: z.string(),
      bar: z.number(),
    });

    const keys = zodKeys(schema);

    expect(keys).toEqual(["foo", "bar"]);
  });
});

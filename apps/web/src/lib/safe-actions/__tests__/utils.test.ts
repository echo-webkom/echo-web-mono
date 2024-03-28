import { describe, expect, it } from "vitest";
import { z } from "zod";

import { parseData } from "../utils";

describe("parse data", () => {
  it("should parse data", () => {
    const data = { name: "John Doe", age: 30 };
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    expect(parseData(data, schema)).toEqual(data);
  });

  it("should throw an error if data is invalid", () => {
    const data = { name: "John Doe", age: "30" };
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    expect(() => parseData(data, schema)).toThrowError();
  });
});

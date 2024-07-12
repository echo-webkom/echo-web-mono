import { describe, expect, it } from "vitest";
import { z } from "zod";

import { KVObjectAdapter } from "../kv-adapter";
import { KVNamespace } from "../kv-namespace";

const createNamespace = <T extends z.ZodType>(name: string, schema?: T) => {
  const adapter = new KVObjectAdapter();
  return new KVNamespace(adapter, name, { schema });
};

describe("kv namespace", () => {
  it("should set a value in the kv store", async () => {
    const namespace = createNamespace(
      "test",
      z.object({
        foo: z.string(),
      }),
    );

    await namespace.set(["bar"], { foo: "bar" });

    const value = await namespace.get(["bar"]);

    expect(value).toEqual({ foo: "bar" });
  });

  it("should return null if the value doesn't exist", async () => {
    const namespace = createNamespace("test", z.string());

    const value = await namespace.get(["bar"]);

    expect(value).toBeNull();
  });

  it("should throw an error if you set a ttl that is impossible", async () => {
    const namespace = createNamespace("test", z.string());

    const aWhileAgo = new Date(new Date().getTime() - 10000);

    await expect(namespace.set(["bar"], "bar", aWhileAgo)).rejects.toThrow("TTL has expired");
  });
});

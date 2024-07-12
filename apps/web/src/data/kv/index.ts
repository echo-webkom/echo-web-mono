import { eq } from "drizzle-orm";
import { z } from "zod";

import { db, isPostgresIshError } from "@echo-webkom/db";
import { kv } from "@echo-webkom/db/schemas";

import { createKey, isExpired, parseData } from "./utils";

export type AnySchema = z.ZodType;

export type KVKey = Array<string> | string;

export type KVNamespaceOptions<TSchema extends AnySchema> = {
  schema?: TSchema;
};

export class KVNamespace<TSchema extends AnySchema = z.ZodUnknown> {
  namespace: string;
  schema: TSchema = z.unknown() as unknown as TSchema;

  /**
   *
   * @param namespace - The namespace of the KV store
   * @param options - The options of the KV store
   */
  constructor(namespace: string, options?: KVNamespaceOptions<TSchema>) {
    this.namespace = namespace;

    if (options?.schema) {
      this.schema = options.schema;
    }
  }

  /**
   * Set a value in the KV store
   *
   * @param keys - The keys of the value
   * @param value - The value to set
   * @param ttl - The time to live of the value
   */
  set = async <T extends z.infer<TSchema>>(
    keys: KVKey,
    value: T,
    ttl: Date | null = null,
  ): Promise<void> => {
    if (ttl && isExpired(ttl)) {
      throw new Error("TTL is expired");
    }

    const _value = parseData(value, this.schema);
    const key = createKey(this.namespace, ...(Array.isArray(keys) ? keys : [keys]));

    try {
      await db.insert(kv).values({
        key,
        value: _value,
        ttl,
      });
    } catch (e) {
      if (isPostgresIshError(e)) {
        // If the key already exists, update the value
        if (e.code === "23505") {
          await db
            .update(kv)
            .set({
              value: _value,
              ttl,
            })
            .where(eq(kv.key, key));
        }
      }
    }
  };

  /**
   * Get a value from the KV store
   *
   * @param keys - The keys of the value
   * @returns The value or null if it doesn't exist
   */
  get = async <T extends z.infer<TSchema>>(keys: KVKey): Promise<T | null> => {
    const key = createKey(this.namespace, ...(Array.isArray(keys) ? keys : [keys]));
    const result = await db.query.kv.findFirst({
      where: eq(kv.key, key),
    });

    if (!result) {
      return null;
    }

    if (result.ttl && isExpired(result.ttl)) {
      await db.delete(kv).where(eq(kv.key, key));

      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return parseData(result.value, this.schema);
  };
}

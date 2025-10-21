import { z } from "zod";

import { type KVAdapter } from "./kv-adapter";
import { type KVKey } from "./kv-types";
import { createKey, isExpired } from "./utils";

export type AnySchema = z.ZodType;

export type KVNamespaceOptions<TSchema extends AnySchema> = {
  schema?: TSchema;
};

export class KVNamespace<TSchema extends AnySchema = z.ZodUnknown> {
  private adapter: KVAdapter;
  private namespace: string;
  private schema: TSchema = z.unknown() as unknown as TSchema;

  /**
   *
   * @param namespace - The namespace of the KV store
   * @param options - The options of the KV store
   */
  constructor(adapter: KVAdapter, namespace: string, options?: KVNamespaceOptions<TSchema>) {
    this.adapter = adapter;
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
  async set<T extends z.infer<TSchema>>(
    keys: KVKey,
    value: T,
    ttl: Date | null = null,
  ): Promise<void> {
    if (ttl && isExpired(ttl)) {
      throw new Error("TTL has expired");
    }

    const _value = this.schema.parse(value);
    const key = createKey(this.namespace, ...(Array.isArray(keys) ? keys : [keys]));

    await this.adapter.set(key, _value, ttl);
  }

  /**
   * Get a value from the KV store
   *
   * @param keys - The keys of the value
   * @returns The value or null if it doesn't exist
   */
  async get<T extends z.infer<TSchema>>(keys: KVKey): Promise<T | null> {
    const key = createKey(this.namespace, ...(Array.isArray(keys) ? keys : [keys]));
    const result = await this.adapter.get<T>(key);

    try {
      return this.schema.parse(result) as T;
    } catch {
      return null;
    }
  }
}

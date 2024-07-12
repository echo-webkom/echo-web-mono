import { eq } from "drizzle-orm";

import { isPostgresIshError, type Database } from "@echo-webkom/db";
import { kv } from "@echo-webkom/db/schemas";

import { isExpired } from "./utils";

export interface KVAdapter {
  /**
   * Get a value from the KV store
   *
   * @param key - The key of the value
   * @returns The value or null if it doesn't exist
   */
  get: <T>(key: string) => Promise<T | null>;

  /**
   * Set a value in the KV store
   *
   * @param key - The key of the value
   * @param value - The value to set
   * @param ttl - The time to live of the value (The date it should expire)
   */
  set: <T>(key: string, value: T, ttl: Date | null) => Promise<void>;

  /**
   * Delete a value from the KV store
   *
   * @param key - The key of the value
   */
  del: (key: string) => Promise<void>;
}

export class KVDrizzleAdapter implements KVAdapter {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  get = async <T>(key: string): Promise<T | null> => {
    const result = await this.db.query.kv.findFirst({
      where: (row, { and, eq }) => and(eq(row.key, key)),
    });

    if (result?.ttl && isExpired(result.ttl)) {
      await this.del(key);
      return null;
    }

    return result?.value as T;
  };

  del = async (key: string): Promise<void> => {
    await this.db.delete(kv).where(eq(kv.key, key));
  };

  set = async <T>(key: string, value: T, ttl: Date | null): Promise<void> => {
    try {
      await this.db.insert(kv).values({
        key,
        value,
        ttl,
      });
    } catch (e) {
      if (isPostgresIshError(e)) {
        // If the key already exists, update the value
        if (e.code === "23505") {
          await this.db
            .update(kv)
            .set({
              value,
              ttl,
            })
            .where(eq(kv.key, key));
        }
      }
    }
  };
}

export class KVObjectAdapter implements KVAdapter {
  private store: Record<string, { value: unknown; ttl: Date | null }> = {};

  get = async <T>(key: string): Promise<T | null> => {
    const result = this.store[key];

    if (result?.ttl && isExpired(result.ttl)) {
      await this.del(key);
      return null;
    }

    return result?.value as T;
  };

  del = async (key: string): Promise<void> => {
    await new Promise<void>((resolve) => {
      delete this.store[key];
      resolve();
    });
  };

  set = async <T>(key: string, value: T, ttl: Date | null): Promise<void> => {
    await new Promise<void>((resolve) => {
      this.store[key] = {
        value,
        ttl,
      };
      resolve();
    });
  };
}

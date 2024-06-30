import "server-only";

import { isAfter } from "date-fns";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { cache } from "@echo-webkom/db/schemas";

/**
 * Ratchet cache implementation.
 */
export const Cache = {
  /**
   * Get a value from the cache.
   *
   * If the key does not exist or is expired, null is returned.
   *
   * @param key - The key to get the value for.
   * @returns The value for the key, or null if the key does not exist or is expired.
   */
  get: async <T>(key: string): Promise<T | null> => {
    const store = await db.query.cache.findFirst({
      where: (c, { eq }) => eq(c.key, key),
    });

    if (!store) {
      return null;
    }

    if (isExpired(store.ttl)) {
      void db.delete(cache).where(eq(cache.key, key));

      return null;
    }

    return store.value as T;
  },

  /**
   * Set a value in the cache.
   *
   * If the key already exists, the value is updated.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set.
   * @param ttl - (Optional) The time-to-live for the key. If not provided, the default TTL is used (1 day).
   */
  set: async <T>(key: string, value: T, ttl?: Date): Promise<void> => {
    const store = await db.query.cache.findFirst({
      where: (c, { eq }) => eq(c.key, key),
    });

    if (store) {
      await db.update(cache).set({
        value,
        ttl: ttl ?? store.ttl,
      });
      return;
    }

    await db.insert(cache).values({
      key,
      value,
      ttl,
    });
  },
};

const isExpired = (ttl: Date): boolean => {
  const today = new Date();
  return isAfter(today, ttl);
};

import { z } from "zod";

import { kv } from "./kv";

export class Cache {
  static async get(key: string) {
    return await kv.get(key);
  }

  static async set<T>(key: string, value: T, ttl?: number) {
    const data = JSON.stringify(value);

    if (ttl) {
      const resp = await kv.setEx(key, ttl, data);
      return resp;
    }

    return await kv.set(key, data);
  }

  static async del(key: string) {
    return await kv.del(key);
  }

  static async invalidate(key: string) {
    return await this.del(key);
  }
}

export const createTypedCache = <TSchema extends z.ZodSchema>(prefix: string, schema: TSchema) => {
  return {
    get: async (key: string): Promise<z.infer<TSchema> | null> => {
      const value = await Cache.get(`${prefix}:${key}`);

      if (!value) {
        return null;
      }

      try {
        return schema.parse(JSON.parse(value));
      } catch (e) {
        return null;
      }
    },

    set: async (key: string, value: z.infer<TSchema>, ttl?: number) => {
      await Cache.set(`${prefix}:${key}`, value, ttl);
    },

    del: async (key: string) => {
      await Cache.del(`${prefix}:${key}`);
    },

    invalidate: async (key: string) => {
      await Cache.invalidate(`${prefix}:${key}`);
    },
  };
};

export const registrationCountCache = createTypedCache(
  "registrationCount",
  z.object({
    waiting: z.number(),
    registered: z.number(),
    max: z.number().nullable(),
  }),
);

import { z } from "zod";

type KeysOf<T> = T extends z.ZodObject<infer Shape> ? Array<keyof Shape> : never;

export const zodKeys = <T extends z.ZodObject>(schema: T): KeysOf<T> => {
  if (schema === null || schema === undefined) return [] as unknown as KeysOf<T>;
  if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional)
    return [] as unknown as KeysOf<T>;

  return Object.keys(schema.shape) as KeysOf<T>;
};

import { z } from "zod";

type KeysOf<T> = T extends z.ZodObject<infer Shape> ? Array<keyof Shape> : never;

export const zodKeys = <T extends z.AnyZodObject>(schema: T): KeysOf<T> => {
  if (schema === null || schema === undefined) return [] as unknown as KeysOf<T>;
  if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional)
    return [] as unknown as KeysOf<T>;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.keys(schema._def.shape()) as KeysOf<T>;
};

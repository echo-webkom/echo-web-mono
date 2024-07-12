import { isPast } from "date-fns";
import { type z } from "zod";

export const parseData = <TSchema extends z.ZodTypeAny>(
  data: unknown,
  schema: TSchema,
): z.infer<TSchema> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.parse(data);
};

export const isExpired = isPast;

export const createKey = (...keys: Array<string>): string => keys.join(":");

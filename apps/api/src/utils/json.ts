import { Context } from "hono";
import { z } from "zod";

const parseData = <TSchema extends z.ZodSchema>(
  data: unknown,
  schema: TSchema,
): z.infer<TSchema> => {
  try {
    return schema.parse(data);
  } catch (e) {
    throw new Error("Invalid data");
  }
};

export const parseJson = async <TSchema extends z.ZodSchema>(
  c: Context,
  schema: TSchema,
): Promise<
  | {
      ok: true;
      json: z.infer<TSchema>;
    }
  | {
      ok: false;
      json?: undefined;
    }
> => {
  try {
    const data = await c.req.json();
    return { ok: true, json: parseData(data, schema) };
  } catch (e) {
    return { ok: false };
  }
};

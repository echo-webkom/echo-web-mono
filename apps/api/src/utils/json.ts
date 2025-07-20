import { type Context } from "hono";
import { type z } from "zod";

const parseData = <TSchema extends z.ZodSchema>(
  data: unknown,
  schema: TSchema,
): z.infer<TSchema> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.parse(data);
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await c.req.json();
    return { ok: true, json: parseData(data, schema) };
  } catch {
    return { ok: false };
  }
};

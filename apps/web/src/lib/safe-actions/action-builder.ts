/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { z, ZodError } from "zod";

import { parseData } from "./utils";

type ErrorResponse = {
  success: false;
  message: string;
};

type ActionSuccessResponse<T> = {
  success: true;
  data: T;
};

type ActionResponse<T> = ActionSuccessResponse<T> | ErrorResponse;

type Handler<TInput, TContext> = (payload: {
  input: TInput;
  ctx: TContext;
}) => Promise<unknown> | unknown;

class ActionBuilder<TInput = undefined, TContext = undefined> {
  schema: z.ZodTypeAny = z.undefined();
  ctxFn?: () => Promise<TContext>;

  constructor(ctxFn?: () => Promise<TContext>) {
    this.ctxFn = ctxFn;
  }

  input<T extends z.ZodTypeAny>(inputSchema: T) {
    this.schema = inputSchema;
    return this as ActionBuilder<z.infer<T>, TContext>;
  }

  create<T extends Handler<TInput, TContext>>(handler: T) {
    return async (payload: TInput): Promise<ActionResponse<Awaited<ReturnType<T>>>> => {
      try {
        const ctx = (await this.ctxFn?.()) as TContext;
        const input = parseData(payload, this.schema) as TInput;
        const data = await handler({ input, ctx });

        return {
          success: true,
          data: data as Awaited<ReturnType<T>>,
        };
      } catch (error) {
        if (error instanceof Error) {
          return {
            success: false,
            message: error.message,
          };
        }

        if (error instanceof ZodError) {
          return {
            success: false,
            message: "Invalid input data",
          };
        }

        return {
          success: false,
          message: "Something failed",
        };
      }
    };
  }
}

type ActionOptions<TContext> = {
  ctx: () => Promise<TContext>;
};

export const createAction = <Context>(opts?: ActionOptions<Context>) => {
  return new ActionBuilder(opts?.ctx);
};

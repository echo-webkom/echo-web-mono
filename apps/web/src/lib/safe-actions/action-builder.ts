/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { z } from "zod";

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

class Action<TInput, TContext> {
  schema: z.ZodTypeAny;
  ctxFn?: () => Promise<TContext>;

  constructor(schema: z.ZodTypeAny, ctxFn?: () => Promise<TContext>) {
    this.schema = schema;
    this.ctxFn = ctxFn;
  }

  create<T extends Handler<TInput, TContext>>(handler: T) {
    return (async (input) => {
      try {
        const parsedInput = parseData(input, this.schema) as TInput;
        const ctx = (await this.ctxFn?.()) as TContext;
        const data = (await handler({ input: parsedInput, ctx })) as Awaited<ReturnType<T>>;
        return { success: true, data } as const;
      } catch (error) {
        return this.handleError(error);
      }
    }) as TInput extends NonNullable<unknown>
      ? (input: TInput) => Promise<ActionResponse<Awaited<ReturnType<T>>>>
      : () => Promise<ActionResponse<Awaited<ReturnType<T>>>>;

    // as (
    //   input: TInput extends NonNullable<unknown> ? never : TInput,
    // ) => Promise<ActionResponse<Awaited<ReturnType<T>>>>;
  }

  private handleError(error: unknown): ErrorResponse {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      } as const;
    }

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      } as const;
    }

    return {
      success: false,
      message: "An unknown error occurred",
    } as const;
  }
}

class ActionGroup<TInput, TContext> {
  schema: z.ZodTypeAny;
  ctxFn?: () => Promise<TContext>;

  constructor(schema: z.ZodTypeAny, ctxFn?: () => Promise<TContext>) {
    this.schema = schema;
    this.ctxFn = ctxFn;
  }

  input<T extends z.ZodTypeAny>(schema: T) {
    return new ActionGroup<z.infer<T>, TContext>(schema, this.ctxFn);
  }

  create<T extends Handler<TInput, TContext>>(handler: T) {
    return new Action<TInput, TContext>(this.schema, this.ctxFn).create(handler);
  }
}

type ActionOptions<TContext> = {
  createContext: () => Promise<TContext>;
};

export const createAction = <Context>(opts?: ActionOptions<Context>) => {
  return new ActionGroup(z.undefined(), opts?.createContext);
};

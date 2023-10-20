import { type NextRequest, type NextResponse } from "next/server";
import { type ZodType } from "zod";

import { type User } from "@echo-webkom/db/schemas";

import { getUser } from "@/lib/session";

type TRequest = Request | NextRequest;
type TResponse = Response | NextResponse;

export function withSession<TContext, TInput>(
  handler: ({
    request,
    ctx,
    user,
    input,
  }: {
    request: TRequest;
    ctx: TContext;
    user: User;
    input: TInput;
  }) => Promise<TResponse> | TResponse,
  contextValidator?: ZodType<TContext>,
  inputValidator?: ZodType<TInput>,
) {
  return async (request: TRequest, context: TContext): Promise<TResponse> => {
    const user = await getUser();

    if (!user) {
      return new Response("Unauthorized", {
        status: 401,
      }) as TResponse;
    }

    let ctx: TContext | undefined;

    if (contextValidator) {
      const result = contextValidator.safeParse(context);

      if (!result.success) {
        return new Response("Invalid request context", {
          status: 400,
        }) as TResponse;
      }

      ctx = result.data;
    }

    let input: TInput | undefined;

    if (inputValidator) {
      const result = inputValidator.safeParse(await request.json());

      if (!result.success) {
        return new Response("Invalid request input", {
          status: 400,
        }) as TResponse;
      }

      input = result.data;
    }

    return handler({
      request,
      ctx: ctx as TContext,
      user,
      input: input as TInput,
    });
  };
}

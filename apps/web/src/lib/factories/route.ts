import type { NextRequest, NextResponse } from "next/server";

import { auth } from "@echo-webkom/auth";

export type NextApiHandler<
  C extends Record<string, unknown>,
  T extends Record<string, unknown> = Record<string, never>,
> = (
  request: NextRequest,
  context: C,
  payload: T,
) => Promise<NextResponse> | NextResponse | Response | Promise<Response>;

/**
 * Create a route handler
 *
 * Example usage:
 *
 * export const GET = createRoute(async (req) => {
 *  return new Response("Hello, world!");
 * });
 */
export const createRoute = <C extends Record<string, unknown>>(handler: NextApiHandler<C>) => {
  return handler;
};

export const createBasicAuthRoute = <C extends Record<string, unknown>>({
  adminKey,
  handler,
}: {
  adminKey: string;
  handler: NextApiHandler<C>;
}) => {
  return async (req: NextRequest, context: C) => {
    const auth = req.headers.get("Authorization")?.split(" ")[1];
    const decodedAuth = Buffer.from(auth ?? "", "base64").toString();
    const [, password] = decodedAuth.split(":");

    if (password !== adminKey) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    return handler(req, context, {});
  };
};

/**
 * const GET = createAuthedRoute(async (req, _ctx, { user }) => {
 *  return new Response(`Hello, ${user.name}`);
 * });
 */
export const createAuthedRoute = <C extends Record<string, unknown>>(
  handler: NextApiHandler<
    C,
    {
      user: Exclude<Awaited<ReturnType<typeof auth>>, null>;
    }
  >,
) => {
  return async (req: NextRequest, context: C) => {
    const user = await auth();

    if (!user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    return handler(req, context, {
      user,
    });
  };
};

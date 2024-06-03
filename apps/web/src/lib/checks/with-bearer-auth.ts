import { env } from "@/env.mjs";
import { type HandlerFunction } from "./utils";

/**
 * Checks if the user has the correct bearer auth credentials.
 * If the user has the correct credentials, the handler is run.
 *
 * @param handler - the function to run after the auth is validated
 * @returns - the handler wrapped in a bearer auth check
 */
export function withBearerAuth(handler: HandlerFunction) {
  return async (request: Request): Promise<Response> => {
    if (env.NODE_ENV !== "development") {
      const auth = request.headers.get("Authorization")?.split(" ")[1];

      if (auth !== env.ADMIN_KEY) {
        return new Response("Unauthorized", {
          status: 401,
        });
      }
    }

    return handler(request);
  };
}

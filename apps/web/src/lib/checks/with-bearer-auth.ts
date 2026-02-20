import { type NextRequest } from "next/server";

export type HandlerFunction = (request: NextRequest) => Promise<Response> | Response;

/**
 * Checks if the user has the correct bearer auth credentials.
 * If the user has the correct credentials, the handler is run.
 *
 * @param handler - the function to run after the auth is validated
 * @returns - the handler wrapped in a bearer auth check
 */
export const withBearerAuth = (handler: HandlerFunction) => {
  return async (request: NextRequest): Promise<Response> => {
    if (process.env.NODE_ENV !== "development") {
      const auth = request.headers.get("Authorization")?.split(" ")[1];

      if (auth !== process.env.ADMIN_KEY) {
        return new Response("Unauthorized", {
          status: 401,
        });
      }
    }

    return handler(request);
  };
};

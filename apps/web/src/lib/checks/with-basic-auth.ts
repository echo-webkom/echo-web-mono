import { env } from "@/env.mjs";
import { type HandlerFunction } from "./utils";

/**
 * Checks if the user has the correct basic auth credentials.
 * If the user has the correct credentials, the handler is run.
 *
 * @param handler the function to run after the basic auth is validated
 * @returns the handler wrapped in a basic auth check
 */
export const withBasicAuth = (handler: HandlerFunction) => {
  return async (request: Request): Promise<Response> => {
    if (env.NODE_ENV !== "development") {
      const auth = request.headers.get("Authorization")?.split(" ")[1];
      const decodedAuth = Buffer.from(auth ?? "", "base64").toString();
      const [, password] = decodedAuth.split(":");

      if (password !== env.ADMIN_KEY) {
        return new Response("Unauthorized", {
          status: 401,
        });
      }
    }

    return handler(request);
  };
};

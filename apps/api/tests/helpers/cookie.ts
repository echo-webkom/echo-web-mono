import { type BufferSource } from "node:stream/web";
import { serializeSigned, type CookieOptions } from "hono/utils/cookie";

export const createSignedCookie = async (
  name: string,
  value: string,
  secret: string | BufferSource,
  opt?: CookieOptions,
) => {
  return await serializeSigned(name, value, secret, opt);
};

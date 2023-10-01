import { serializeSigned, type CookieOptions } from "hono/utils/cookie";
import { type BufferSource } from "node:stream/web";

export const createSignedCookie = async (
  name: string,
  value: string,
  secret: string | BufferSource,
  opt?: CookieOptions,
) => {
  return await serializeSigned(name, value, secret, opt);
};

import app from "../../src/app";
import { env } from "../fixtures/env";

export const runRequest = async (method: string, path: string, requestInit?: RequestInit) => {
  return await app.request(
    path,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.ADMIN_KEY}`,
        ...requestInit?.headers,
      },
      ...requestInit,
    },
    env,
  );
};

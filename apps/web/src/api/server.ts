import "server-only";

import ky from "ky";

export const apiServer = ky.extend({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  throwHttpErrors: false,
  credentials: "include",
  cache: "no-store",
  headers: {
    Authorization: "Bearer " + process.env.ADMIN_KEY,
    "X-Admin-Key": process.env.ADMIN_KEY,
  },
});

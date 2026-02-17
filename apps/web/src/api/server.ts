import "server-only";

import { UnoClient } from "./uno/client";

export const unoWithAdmin = new UnoClient({
  baseUrl: process.env.NEXT_PUBLIC_UNO_URL,
  adminToken: process.env.ADMIN_KEY,
});

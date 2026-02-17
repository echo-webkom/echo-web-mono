import "server-only";

import { UnoClient } from "./uno/client";

export const unoWithAdmin = new UnoClient({
  adminToken: process.env.ADMIN_KEY,
});

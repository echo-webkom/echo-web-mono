import { UnoClient } from "./uno/client";

export const uno = new UnoClient({
  baseUrl: process.env.NEXT_PUBLIC_UNO_URL,
});

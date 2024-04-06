import { BOOMTOWN_HOSTNAME, HTTP } from "@/config";

import "server-only";

export async function pingBoomtown(happeningId: string) {
  if (!BOOMTOWN_HOSTNAME) return;

  return await fetch(`${HTTP}://${BOOMTOWN_HOSTNAME}/${happeningId}`, {
    method: "POST",
  }).then((response) => response.status === 200);
}

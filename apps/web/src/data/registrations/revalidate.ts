import { revalidateTag } from "next/cache";

import { cacheKeyFactory } from "./cache-keys";

export function revalidateRegistrations(happeningId: string, userId: string) {
  revalidateTag(cacheKeyFactory.registrationsHappening(happeningId));
  revalidateTag(cacheKeyFactory.registrationsUser(userId));
}

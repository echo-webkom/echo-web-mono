import { revalidateTag } from "next/cache";

import { cacheKeyFactory } from "./cache-keys";

export function revalidateSpotRange(happeningId: string) {
  revalidateTag(cacheKeyFactory.happeningSpotrange(happeningId));
}

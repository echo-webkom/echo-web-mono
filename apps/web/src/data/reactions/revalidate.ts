import { revalidateTag } from "next/cache";

import { cacheKeyFactory } from "./cache-keys";

export function revalidateReactions(happeningId: string) {
  revalidateTag(cacheKeyFactory.reactions(happeningId));
}

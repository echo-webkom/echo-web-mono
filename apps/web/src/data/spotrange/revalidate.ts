import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  happeningSpotrange: (happeningId: string) => `spotrange-happening-${happeningId}`,
};

export function revalidateSpotRange(happeningId: string) {
  revalidateTag(cacheKeyFactory.happeningSpotrange(happeningId));
}

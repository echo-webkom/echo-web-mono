import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  happeningSpotrange: (happeningId: string) => `spotrange-happening-${happeningId}`,
};

export const revalidateSpotRange = (happeningId: string) => {
  revalidateTag(cacheKeyFactory.happeningSpotrange(happeningId));
};

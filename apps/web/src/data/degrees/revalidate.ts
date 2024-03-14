import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  degrees: "degrees",
};

export function revalidateDegrees() {
  revalidateTag(cacheKeyFactory.degrees);
}

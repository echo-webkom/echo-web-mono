import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  degrees: "degrees",
};

export const revalidateDegrees = () => {
  revalidateTag(cacheKeyFactory.degrees);
};

import { sanityFetch } from "../client";
import { bannerQuery } from "./queries";
import { bannerSchema } from "./schemas";

export async function getBanner() {
  try {
    return await sanityFetch({
      query: bannerQuery,
      tags: ["banner"],
    }).then((res) => bannerSchema.nullable().parse(res));
  } catch {
    console.error("Failed to fetch banner");

    return null;
  }
}

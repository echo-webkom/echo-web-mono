import { sanityFetch } from "../client";
import { bannerQuery } from "./queries";
import { bannerSchema } from "./schemas";

/**
 *
 * @returns the current banner or null if no banner is set
 */
export async function fetchBanner() {
  try {
    return await sanityFetch({
      query: bannerQuery,
      tags: ["banner"],
    }).then((res) => bannerSchema.parse(res));
  } catch {
    return null;
  }
}

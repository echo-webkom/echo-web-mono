import type { HeaderQueryResult } from "@echo-webkom/cms/types";
import { headerQuery } from "@echo-webkom/sanity/queries";

import { sanityFetch } from "./client";

export const fetchHeader = async () => {
  return await sanityFetch<HeaderQueryResult>({
    query: headerQuery,
    cdn: true,
    tags: ["header"],
  });
};

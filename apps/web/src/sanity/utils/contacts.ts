import { type HappeningContactsQueryResult } from "@echo-webkom/cms/types";
import { client } from "@echo-webkom/sanity";
import { happeningContactsQuery } from "@echo-webkom/sanity/queries";

export const getContactsBySlug = async (slug: string) => {
  return await client
    .fetch<HappeningContactsQueryResult>(happeningContactsQuery, { slug })
    .then((data) => data ?? [])
    .catch(() => []);
};

import { type QueryParams } from "next-sanity";

import { cdnClient, client } from "@echo-webkom/sanity";

type SanityFetchOptions = {
  query: string;
  cdn?: boolean;
  params?: QueryParams;
} & (
  | {
      tags?: Array<string>;
    }
  | {
      revalidate?: NextFetchRequestConfig["revalidate"];
    }
);

export async function sanityFetch<T>({
  query,
  params,
  cdn = false,
  ...rest
}: SanityFetchOptions): Promise<T> {
  const tags = "tags" in rest ? rest.tags : undefined;
  const revalidate = "revalidate" in rest ? rest.revalidate : undefined;

  const c = cdn ? cdnClient : client;

  if (revalidate !== undefined) {
    return await c.fetch(query, params ?? {}, {
      next: {
        revalidate,
      },
    });
  }

  return await c.fetch(query, params, {
    cache: "force-cache",
    next: {
      tags: tags ?? [],
    },
  });
}

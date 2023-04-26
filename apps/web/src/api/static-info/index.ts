import {groq} from "next-sanity";

import {type ErrorMessage} from "@/utils/error";
import {sanityClient} from "../sanity.client";
import {slugSchema} from "../utils/slug";
import {staticInfoSchema, type StaticInfo} from "./schemas";

export * from "./schemas";

export const fetchStaticInfoPaths = async (): Promise<Array<string>> => {
  try {
    const query = groq`*[_type == "static"]{ "slug": slug.current }`;

    const result = await sanityClient.fetch<Array<string>>(query);

    return slugSchema
      .array()
      .parse(result)
      .map((nestedSlug) => nestedSlug.slug);
  } catch {
    return [];
  }
};

export const fetchStaticInfoBySlug = async (slug: string): Promise<StaticInfo | ErrorMessage> => {
  try {
    const query = groq`
*[_type == "static"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
  title,
  "slug": slug.current,
  pageType,
  body
}[0]
      `;

    const params = {
      slug,
    };

    const res = await sanityClient.fetch<StaticInfo>(query, params);

    return staticInfoSchema.parse(res);
  } catch {
    return {
      message: "Fant ikke siden",
    };
  }
};

import {groq} from "next-sanity";
import {sanityClient} from "../sanity.client";
import {StaticInfo, staticInfoSchema} from "./schemas";
import {slugSchema} from "@/utils/slug";
import {ErrorMessage} from "@/utils/error";

export * from "./schemas";

export const fetchStaticInfoPaths = async (): Promise<Array<string>> => {
  try {
    const query = groq`*[_type == "staticInfo"]{ "slug": slug.current }`;

    const result = await sanityClient.fetch<Array<string>>(query);

    return slugSchema
      .array()
      .parse(result)
      .map((nestedSlug) => nestedSlug.slug);
  } catch {
    return [];
  }
};

export const fetchStaticInfoBySlug = async (
  slug: string,
): Promise<StaticInfo | ErrorMessage> => {
  try {
    const query = groq`
        *[_type == "staticInfo"
          && slug.current == $slug
          && !(_id in path('drafts.**'))]
          | order(name) {
            name,
            "slug": slug.current,
            info,
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

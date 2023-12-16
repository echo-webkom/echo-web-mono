import { groq } from "next-sanity";
import { z } from "zod";

import { type PageType } from "@echo-webkom/lib";

import { sanityClient } from "../client";
import { staticInfoSchema, type StaticInfo } from "./schemas";

export * from "./schemas";

// Move this
export const pageTypeToUrl: Record<PageType, string> = {
  about: "om",
  "for-companies": "for-bedrifter",
  "for-students": "for-studenter",
};

export async function fetchStaticInfoPaths() {
  const query = groq`*[_type == "staticInfo"]{ "slug": slug.current, pageType }`;

  const result = await sanityClient.fetch<Array<{ slug: string; pageType: PageType }>>(query);

  const staticInfoSlugSchema = z.object({
    pageType: z.enum(["about", "for-students", "for-companies"]),
    slug: z.string(),
  });

  const staticInfoSlugs = result.map((staticInfo) => staticInfoSlugSchema.parse(staticInfo));

  return staticInfoSlugs.map((staticInfo) => ({
    slug: [pageTypeToUrl[staticInfo.pageType], staticInfo.slug],
  }));
}

export async function fetchStaticInfoBySlug(pageType: string, slug: string) {
  const query = groq`
*[_type == "staticInfo"
  && slug.current == $slug
  && pageType == $pageType
  && !(_id in path('drafts.**'))] {
  title,
  "slug": slug.current,
  pageType,
  body
}[0]
      `;

  const parsedPageType = Object.keys(pageTypeToUrl).find(
    (key) => pageTypeToUrl[key as keyof typeof pageTypeToUrl] === pageType,
  );
  const params = {
    slug,
    pageType: parsedPageType,
  };

  const result = await sanityClient.fetch<StaticInfo>(query, params);

  return staticInfoSchema.nullable().parse(result);
}

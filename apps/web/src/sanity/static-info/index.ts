import { groq } from "next-sanity";
import { z } from "zod";

import { type PageType } from "@echo-webkom/lib";

import { sanityFetch } from "../client";
import { staticInfoSchema, type StaticInfo } from "./schemas";

export * from "./schemas";

// Move this
export const pageTypeToUrl: Record<PageType, string> = {
  ABOUT: "om",
  STUDENTS: "for-studenter",
  COMPANIES: "for-bedrifter",
};

export async function fetchStaticInfoPaths() {
  const query = groq`*[_type == "static"]{ "slug": slug.current, pageType }`;

  const result = await sanityFetch<Array<{ slug: string; pageType: PageType }>>({
    query,
    tags: ["static-info-params"],
  });

  const staticInfoSlugSchema = z.object({
    pageType: z.enum(["ABOUT", "STUDENTS", "COMPANIES"]),
    slug: z.string(),
  });

  const staticInfoSlugs = result.map((staticInfo) => staticInfoSlugSchema.parse(staticInfo));

  return staticInfoSlugs.map((staticInfo) => ({
    type: pageTypeToUrl[staticInfo.pageType],
    slug: staticInfo.slug,
  }));
}

export async function fetchStaticInfoBySlug(slug: string) {
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

  const res = await sanityFetch<StaticInfo>({
    query,
    params,
    tags: ["static-info"],
  });

  return staticInfoSchema.nullable().parse(res);
}

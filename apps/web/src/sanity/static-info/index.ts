import {groq} from "next-sanity";
import {z} from "zod";

import {type PageType} from "@echo-webkom/lib";

import {serverFetch} from "../client";
import {staticInfoSchema, type StaticInfo} from "./schemas";

export * from "./schemas";

export const pageTypeToUrl: Record<PageType, string> = {
  ABOUT: "about",
  STUDENTS: "for-students",
  COMPANIES: "for-companies",
};

export const fetchStaticInfoPaths = async () => {
  const query = groq`*[_type == "static"]{ "slug": slug.current, pageType }`;

  const result = await serverFetch<Array<{slug: string; pageType: PageType}>>(query);

  const staticInfoSlugSchema = z.object({
    pageType: z.enum(["ABOUT", "STUDENTS", "COMPANIES"]),
    slug: z.string(),
  });

  const staticInfoSlugs = result.map((staticInfo) => staticInfoSlugSchema.parse(staticInfo));

  return staticInfoSlugs.map((staticInfo) => ({
    type: pageTypeToUrl[staticInfo.pageType],
    slug: staticInfo.slug,
  }));
};

export const fetchStaticInfoBySlug = async (slug: string) => {
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

  const res = await serverFetch<StaticInfo>(query, params);

  return staticInfoSchema.nullable().parse(res);
};

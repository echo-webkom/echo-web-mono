import {groq} from "next-sanity";
import {z} from "zod";

import {type PageType} from "@echo-webkom/lib";

import {clientFetch} from "../client";
import {staticInfoSchema, type StaticInfo} from "./schemas";

export * from "./schemas";

export const pageTypeToUrl: Record<PageType, string> = {
  ABOUT: "/about",
  STUDENTS: "/for-students",
  COMPANIES: "/for-companies",
};

export const fetchStaticInfoPaths = async () => {
  const query = groq`*[_type == "static"]{ "slug": slug.current, pageType }`;

  const result = await clientFetch<Array<{slug: string; pageType: PageType}>>(query);

  const staticInfoSlugSchema = z.object({
    pageType: z.enum(["ABOUT", "STUDENTS", "COMPANIES"]),
    slug: z.string(),
  });

  const staticInfoSlugs = result.map((staticInfo) => staticInfoSlugSchema.parse(staticInfo));

  const paths = staticInfoSlugs.map((staticInfo) => {
    return {
      params: {
        slug: [pageTypeToUrl[staticInfo.pageType], staticInfo.slug],
      },
    };
  });

  return paths;
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

  const res = await clientFetch<StaticInfo>(query, params);

  return staticInfoSchema.parse(res);
};

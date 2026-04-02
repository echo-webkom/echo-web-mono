import type { MetadataRoute } from "next";

import { unoWithAdmin } from "@/api/server";
import { BASE_URL } from "@/config";
import { createHappeningLink } from "@/lib/create-link";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [happenings, jobs, posts, staticPages] = await Promise.all([
    unoWithAdmin.sanity.happenings.all().catch(() => []),
    unoWithAdmin.sanity.jobAds.all().catch(() => []),
    unoWithAdmin.sanity.posts.all().catch(() => []),
    unoWithAdmin.sanity.staticInfo.all().catch(() => []),
  ]);

  return [
    ...happenings.map((e): MetadataRoute.Sitemap[number] => {
      return {
        url: `${BASE_URL}/${createHappeningLink(e)}`,
        lastModified: e._updatedAt,
        changeFrequency: "daily",
        priority: 1,
      };
    }),

    ...jobs.map((e): MetadataRoute.Sitemap[number] => {
      return {
        url: `${BASE_URL}/for-studenter/stillingsannonse/${e.slug}`,
        lastModified: e._updatedAt,
        changeFrequency: "weekly",
        priority: 0.5,
      };
    }),

    ...posts.map((e): MetadataRoute.Sitemap[number] => {
      return {
        url: `${BASE_URL}/for-studenter/innlegg/${e.slug}`,
        lastModified: e._updatedAt,
        changeFrequency: "daily",
        priority: 0.3,
      };
    }),

    ...staticPages.map((e): MetadataRoute.Sitemap[number] => {
      return {
        url: `${BASE_URL}/for-studenter/innlegg/${e.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      };
    }),
  ];
}

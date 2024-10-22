import type { MetadataRoute } from "next";

import { BASE_URL } from "@/config";
import { createHappeningLink } from "@/lib/create-link";
import { fetchAllHappenings } from "@/sanity/happening";
import { fetchJobAds } from "@/sanity/job-ad";
import { fetchAllPosts } from "@/sanity/posts";
import { fetchStaticInfo } from "@/sanity/static-info";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const happenings = await fetchAllHappenings();
  const jobs = await fetchJobAds();
  const posts = await fetchAllPosts();
  const staticPages = await fetchStaticInfo();

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
        url: `${BASE_URL}/for-studenter/jobb/${e.slug}`,
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

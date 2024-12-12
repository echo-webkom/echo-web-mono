import { type Metadata } from "next";

import { fetchAvailableJobAds } from "@/sanity/job-ad";
import { JobAdList } from "./_components/job-ad-list";

export const metadata = {
  title: "Stillingsannonser",
} satisfies Metadata;

export default async function JobAdsOverviewPage() {
  const jobAds = await fetchAvailableJobAds();

  return <JobAdList jobAds={jobAds} />;
}

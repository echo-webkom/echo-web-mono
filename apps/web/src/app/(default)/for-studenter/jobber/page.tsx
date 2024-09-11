import { type Metadata } from "next/types";

import { fetchJobAds } from "@/sanity/job-ad";
import { JobAdList } from "./_components/job-ad-list";

export const metadata = {
  title: "Stillingsannonser",
} satisfies Metadata;

export default async function JobAdsOverviewPage() {
  const jobAds = await fetchJobAds();

  return <JobAdList jobAds={jobAds} />;
}

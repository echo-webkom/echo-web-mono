import { getNewPageMetadata } from "@/app/seo";
import { fetchAvailableJobAds } from "@/sanity/job-ad";
import { JobAdList } from "./_components/job-ad-list";

export const metadata = getNewPageMetadata("Stillingsannonser");

export default async function JobAdsOverviewPage() {
  const jobAds = await fetchAvailableJobAds();

  return <JobAdList jobAds={jobAds} />;
}

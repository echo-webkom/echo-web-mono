import { type Metadata } from "next";

import { Container } from "@/components/container";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";
import { fetchAvailableJobAds } from "@/sanity/job-ad";
import { JobAdList } from "./_components/job-ad-list";

export const metadata = {
  title: "Stillingsannonser",
} satisfies Metadata;

export default async function JobAdsOverviewPage() {
  const jobAds = await fetchAvailableJobAds();

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar />
      <JobAdList jobAds={jobAds} />
    </Container>
  );
}

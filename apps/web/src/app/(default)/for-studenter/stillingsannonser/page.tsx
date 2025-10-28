import { type Metadata } from "next";

import { Container } from "@/components/container";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";
import { fetchHeader } from "@/sanity/header";
import { fetchAvailableJobAds } from "@/sanity/job-ad";
import { JobAdList } from "./_components/job-ad-list";

export const metadata: Metadata = {
  title: "Stillingsannonser",
};

export default async function JobAdsOverviewPage() {
  const jobAds = await fetchAvailableJobAds();
  const header = await fetchHeader();

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar header={header} />
      <JobAdList jobAds={jobAds} />
    </Container>
  );
}

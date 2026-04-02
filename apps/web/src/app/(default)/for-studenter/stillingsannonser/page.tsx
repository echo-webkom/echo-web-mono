import { type Metadata } from "next";

import { unoWithAdmin } from "@/api/server";
import { Container } from "@/components/container";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";

import { JobAdList } from "./_components/job-ad-list";

export const metadata = {
  title: "Stillingsannonser",
} satisfies Metadata;

export default async function JobAdsOverviewPage() {
  const jobAds = await unoWithAdmin.sanity.jobAds.all().catch(() => []);

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar />
      <JobAdList jobAds={jobAds} />
    </Container>
  );
}

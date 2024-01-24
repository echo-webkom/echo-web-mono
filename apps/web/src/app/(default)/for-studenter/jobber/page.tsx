import { type Metadata } from "next/types";

import { Container } from "@/components/container";
import { JobAdPreview } from "@/components/job-ad-preview";
import { Heading } from "@/components/typography/heading";
import { fetchJobAds } from "@/sanity/job-ad";

export const metadata = {
  title: "Stillingsannonser",
} satisfies Metadata;

export default async function JobAdsOverviewPage() {
  const jobAds = await fetchJobAds();

  return (
    <Container>
      <Heading>Stillingsannonser</Heading>

      <ul className="grid grid-cols-1 lg:grid-cols-2">
        {jobAds.map((jobAd) => (
          <li key={jobAd._id}>
            <JobAdPreview jobAd={jobAd} />
          </li>
        ))}
      </ul>
    </Container>
  );
}

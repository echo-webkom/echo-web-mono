import Container from "@/components/container";
import JobAdPreview from "@/components/job-ad-preview";
import Heading from "@/components/ui/heading";
import {fetchJobAds} from "@/sanity/job-ad";

export const metadata = {
  title: "Stillingsannonser",
};

export default async function JobAdsOverviewPage() {
  const jobAds = await fetchJobAds(-1);

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

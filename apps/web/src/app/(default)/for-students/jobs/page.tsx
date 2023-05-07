import Container from "@/components/container";
import JobAdPreview from "@/components/job-ad-preview";
import {fetchJobAds} from "@/sanity/job-ad";

export const metadata = {
  title: "Stillingsannonser",
};

export default async function JobAdsOverviewPage() {
  const jobAds = await fetchJobAds(-1);

  return (
    <Container>
      <h1 className="text-5xl font-bold">Stillingsannonser</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {jobAds.map((jobAd) => (
          <div key={jobAd._id}>
            <JobAdPreview jobAd={jobAd} />
          </div>
        ))}
      </div>
    </Container>
  );
}

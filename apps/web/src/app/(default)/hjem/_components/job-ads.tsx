import { JobAdPreview } from "@/components/job-ad-preview";
import { fetchAvailableJobAds } from "@/sanity/job-ad";
import { BentoBox } from "./bento-box";

export async function JobAds({ className }: { className?: string }) {
  const jobAds = await fetchAvailableJobAds(4);
  return (
    <BentoBox title="Jobbannonser" href="/for-studenter/jobber" className={className}>
      <ul className="grid grid-cols-1 gap-x-3 gap-y-5 py-4">
        {jobAds.map((jobAd) => (
          <li key={jobAd._id}>
            <JobAdPreview jobAd={jobAd} />
          </li>
        ))}
      </ul>
    </BentoBox>
  );
}

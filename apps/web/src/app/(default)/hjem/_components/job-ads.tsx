import { JobAdPreview } from "@/components/job-ad-preview";
import { fetchAvailableJobAds } from "@/sanity/job-ad";
import { BentoBox } from "./bento-box";
import { JobAdCarousel } from "./job-ads-client";

export const JobAds = async ({ className }: { className?: string }) => {
  const jobAds = await fetchAvailableJobAds(4);

  if (!jobAds.length) {
    return null;
  }

  return (
    <BentoBox
      title="Stillingsannonser"
      href="/for-studenter/stillingsannonser"
      className={className}
    >
      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {jobAds.map((jobAd) => (
          <li key={jobAd._id}>
            <JobAdPreview jobAd={jobAd} />
          </li>
        ))}
      </ul>
    </BentoBox>
  );
};

export const BedpresJobAds = async ({ companyId }: { companyId: string }) => {
  const jobAds = await fetchAvailableJobAds().then((res) =>
    res.filter((jobAd) => jobAd.company._id === companyId),
  );

  if (!jobAds.length) {
    return null;
  }

  return <JobAdCarousel jobAds={jobAds} />;
};

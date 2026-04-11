import { unoWithAdmin } from "@/api/server";
import { JobAdPreview } from "@/components/job-ad-preview";

import { BentoBox } from "./bento-box";
import { JobAdCarousel } from "./job-ads-client";

export const JobAds = async ({ className }: { className?: string }) => {
  const jobAds = await unoWithAdmin.sanity.jobAds.all({ n: 4 }).catch(() => []);

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
            <JobAdPreview jobAd={jobAd} className="border-transparent shadow-none" />
          </li>
        ))}
      </ul>
    </BentoBox>
  );
};

export const BedpresJobAds = async ({ companyId }: { companyId: string }) => {
  const jobAds = await unoWithAdmin.sanity.jobAds
    .all()
    .then((res) => res.filter((jobAd) => jobAd.company?._id === companyId))
    .catch(() => []);

  if (!jobAds.length) {
    return null;
  }

  return <JobAdCarousel jobAds={jobAds} />;
};

import { type GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchJobAds, type JobAd } from "@/api/job-ads";
import { Layout } from "@/components";
import { urlFor } from "@/utils/image-builder";

interface Props {
  jobs: Array<JobAd>;
}

const JobAdsOverviewPage = ({ jobs }: Props) => {
  return (
    <Layout>
      <div className="container mx-auto px-3">
        <h1 className="mb-3 text-4xl font-bold">Stillingsannonser</h1>
        <ul className="flex flex-col gap-10">
          {jobs.map((job) => (
            <li key={job.slug}>
              <Link href={`/job/${job.slug}`}>
                <div className="flex flex-col gap-3 overflow-hidden rounded-md border bg-slate-200 md:flex-row">
                  <div>
                    <Image
                      src={urlFor(job.logoUrl).width(600).height(350).url()}
                      alt={`${job.companyName} ad`}
                      width={600}
                      height={350}
                    />
                  </div>

                  <div className="flex flex-col py-5 px-3">
                    <h2 className="text-xl font-bold">{job.title}</h2>
                    <p>{job.companyName}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const jobs = await fetchJobAds(10);

  return {
    props: {
      jobs,
    },
  };
};

export default JobAdsOverviewPage;

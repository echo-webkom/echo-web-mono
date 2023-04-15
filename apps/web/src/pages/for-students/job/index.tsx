import {type GetStaticProps} from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import {fetchJobAds, type JobAd} from "@/api/job-ad";
import Container from "@/components/container";
import Layout from "@/layouts/layout";
import {isErrorMessage} from "@/utils/error";
import {urlFor} from "@/utils/image-builder";

interface Props {
  jobs: Array<JobAd>;
}

const JobAdsOverviewPage = ({jobs}: Props) => {
  return (
    <>
      <Head>
        <title>Stillingsannonser</title>
      </Head>
      <Layout>
        <Container>
          <h1 className="mb-3 text-4xl font-bold">Stillingsannonser</h1>
          <ul className="flex flex-col gap-10">
            {jobs.map((job) => (
              <li key={job.slug}>
                <Link href={`/for-students/job/${job.slug}`}>
                  <div className="flex flex-col gap-3 overflow-hidden rounded-md border bg-slate-200 md:flex-row">
                    <div>
                      <Image
                        src={urlFor(job.company.imageUrl).width(600).height(350).url()}
                        alt={`${job.company.name} logo`}
                        width={600}
                        height={350}
                      />
                    </div>

                    <div className="flex flex-col px-3 py-5">
                      <h2 className="text-xl font-bold">{job.title}</h2>
                      <p>{job.company.name}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const jobs = await fetchJobAds(-1);

  if (isErrorMessage(jobs)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      jobs,
    },
  };
};

export default JobAdsOverviewPage;

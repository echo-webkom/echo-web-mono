import { format } from "date-fns";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { isErrorMessage } from "@/utils/error";
import { Breadcrum, Layout, Markdown } from "@/components";
import { fetchJobAdBySlug, fetchJobAdPaths, JobAd } from "@/api/job-ads";

interface Props {
  jobAd: JobAd;
}

const jobTypeToString: Record<JobAd["jobType"], string> = {
  fulltime: "Fulltid",
  parttime: "Deltid",
  internship: "Internship",
  summerjob: "Sommerjobb",
};

const JobAdPage = ({ jobAd }: Props) => {
  return (
    <>
      <Head>
        <title>Stillingsannonse - {jobAd.title}</title>
      </Head>

      <Layout>
        <div className="container mx-auto px-5">
          <Breadcrum
            links={[
              { href: "/", label: "Hjem" },
              { href: "/job", label: "Jobb" },
              { href: `/job/${jobAd.slug}`, label: jobAd.title },
            ]}
          />

          {/* Job ad */}
          <div className="my-5 flex flex-col-reverse justify-between 2xl:flex-row">
            <div>
              <p>
                Publisert: {format(new Date(jobAd._createdAt), "yyyy/MM/dd")}
              </p>
              {/* TODO: Ugly hack to get markdown to work. Fix this. */}
              <Markdown content={`# ${jobAd.title} \n ${jobAd.body}`} />
            </div>

            {/* Floater */}
            <div className="my-5 flex h-fit w-full flex-col gap-5 rounded-lg border bg-[#fff] px-5 py-5 shadow-sm shadow-black 2xl:my-0 2xl:w-[500px]">
              <div>
                <p className="font-sm text-gray-600">Selskap:</p>
                <p className="text-3xl font-bold">{jobAd.companyName}</p>
              </div>
              <div>
                <p className="font-sm text-gray-600">Årstrinn:</p>
                <p className="text-3xl font-bold">
                  [{jobAd.degreeYears.toString()}]
                </p>
              </div>
              <div>
                <p className="font-sm text-gray-600">Frist:</p>
                <p className="text-3xl font-bold">
                  {format(new Date(jobAd.deadline), "yyyy/MM/dd")}
                </p>
              </div>
              <div>
                <p className="font-sm text-gray-600">Steder:</p>
                <p className="text-3xl font-bold">
                  [{jobAd.locations.toString()}]
                </p>
              </div>
              <div>
                <p className="font-sm text-gray-600">Jobbtype:</p>
                <p className="text-3xl font-bold">
                  {jobTypeToString[jobAd.jobType]}
                </p>
              </div>
              <div className="mt-5 flex flex-col text-center">
                <Link
                  className="w-full rounded-md bg-echo-yellow px-3 py-3 font-bold"
                  href={jobAd.advertLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Til søknad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchJobAdPaths();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const jobAd = await fetchJobAdBySlug(slug);

  if (isErrorMessage(jobAd)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      jobAd,
    },
  };
};

export default JobAdPage;

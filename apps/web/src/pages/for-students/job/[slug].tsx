import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import {format} from "date-fns";

import {fetchJobAdBySlug, fetchJobAdPaths, jobTypeToString, type JobAd} from "@/api/job-ad";
import Container from "@/components/container";
import Markdown from "@/components/markdown";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import {ButtonLink} from "@/components/ui/button";
import DefaultLayout from "@/layouts/default";
import {isErrorMessage} from "@/utils/error";

interface Props {
  jobAd: JobAd;
}

const JobAdPage = ({jobAd}: Props) => {
  return (
    <>
      <Head>
        <title>Stillingsannonse - {jobAd.title}</title>
      </Head>

      <DefaultLayout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item to="/for-students/job">Jobbannonser</Breadcrumbs.Item>
            <Breadcrumbs.Item>{jobAd.title}</Breadcrumbs.Item>
          </Breadcrumbs>

          {/* Job ad */}
          <p>Publisert: {format(new Date(jobAd._createdAt), "yyyy/MM/dd")}</p>

          <div className="prose md:prose-xl">
            <h1>{jobAd.title}</h1>
            <Markdown content={jobAd.body} />
          </div>

          {/* Floater */}
          <div className="my-5 flex h-fit w-full flex-col gap-5 rounded-lg border bg-[#fff] px-5 py-5 shadow-2xl 2xl:my-0 2xl:w-[500px]">
            <div>
              <p className="font-sm text-gray-600">Selskap:</p>
              <p className="text-3xl font-bold">{jobAd.company.name}</p>
            </div>
            <div>
              <p className="font-sm text-gray-600">Årstrinn:</p>
              <p className="text-3xl font-bold">[{jobAd.degreeYears.toString()}]</p>
            </div>
            <div>
              <p className="font-sm text-gray-600">Frist:</p>
              <p className="text-3xl font-bold">{format(new Date(jobAd.deadline), "yyyy/MM/dd")}</p>
            </div>
            <div>
              <p className="font-sm text-gray-600">Steder:</p>
              <p className="text-3xl font-bold">
                [{jobAd.locations.map((location) => location.name).toString()}]
              </p>
            </div>
            <div>
              <p className="font-sm text-gray-600">Jobbtype:</p>
              <p className="text-3xl font-bold">{jobTypeToString[jobAd.jobType]}</p>
            </div>
            <div className="mt-5 flex flex-col text-center">
              <ButtonLink variant="secondary" href={jobAd.link} isExternal>
                Til søknad
              </ButtonLink>
            </div>
          </div>
        </Container>
      </DefaultLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchJobAdPaths();

  return {
    paths: slugs.map((slug) => ({params: {slug}})),
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

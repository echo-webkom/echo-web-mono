import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import {fetchMinuteBySlug, fetchMinutesPaths, type Minute} from "@/api/minutes";
import {Breadcrum} from "@/components/breadcrums";
import {Button} from "@/components/button";
import {Layout} from "@/components/layout";
import {isErrorMessage} from "@/utils/error";

const TITLE = "Møtereferater";

interface Props {
  minute: Minute;
}

const MinutePage = ({minute}: Props) => {
  return (
    <>
      <Head>
        <title>
          {TITLE} - {minute.date}
        </title>
      </Head>
      <Layout>
        <div className="container mx-auto">
          <Breadcrum
            links={[
              {
                href: "/",
                label: "Hjem",
              },
              {
                href: "/minutes/",
                label: TITLE,
              },
              {
                href: `/minutes/${minute._id}`,
                label: minute.title,
              },
            ]}
          />

          <div className="flex justify-between pb-4">
            <h1 className="text-3xl font-bold">{minute.title}</h1>
            <Button /*TODO: Add download logic */>Last ned</Button>
          </div>
          <iframe title={minute.title} src={minute.document} className="h-screen w-full" />
        </div>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchMinutesPaths();

  return {
    paths: slugs.map((slug) => ({params: {slug}})),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const minute = await fetchMinuteBySlug(slug);

  if (isErrorMessage(minute)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      minute,
    },
  };
};

export default MinutePage;

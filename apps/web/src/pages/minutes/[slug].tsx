import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import {format} from "date-fns";

import {fetchMinuteBySlug, fetchMinutesPaths, type Minute} from "@/api/minutes";
import Container from "@/components/container";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import {ButtonLink} from "@/components/ui/button";
import DefaultLayout from "@/layouts/default";
import {isErrorMessage} from "@/utils/error";

interface Props {
  minute: Minute;
}

const MinutePage = ({minute}: Props) => {
  return (
    <>
      <Head>
        <title>{`Møtereferat - ${format(new Date(minute.date), "dd.MM.yyyy")}`}</title>
      </Head>
      <DefaultLayout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item to="/minutes">Møtereferater</Breadcrumbs.Item>
            <Breadcrumbs.Item>{minute.title}</Breadcrumbs.Item>
          </Breadcrumbs>

          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <h1 className="text-3xl font-bold">{minute.title}</h1>
            <ButtonLink href={minute.document}>Last ned</ButtonLink>
          </div>

          <iframe title={minute.title} src={minute.document} className="h-screen w-full" />
        </Container>
      </DefaultLayout>
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

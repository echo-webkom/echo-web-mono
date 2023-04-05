import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";

import {isErrorMessage} from "@/utils/error";
import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Markdown from "@/components/markdown";
import {fetchStaticInfoBySlug, fetchStaticInfoPaths, type StaticInfo} from "@/api/static-info";

type Props = {
  page: StaticInfo;
};

const StaticPage = ({page}: Props) => {
  return (
    <>
      <Head>
        <title>{page.title}</title>
      </Head>
      <Layout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item>{page.title}</Breadcrumbs.Item>
          </Breadcrumbs>

          <article className="prose md:prose-xl">
            <h1>{page.title}</h1>
            <Markdown content={page.body.no} />
          </article>
        </Container>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchStaticInfoPaths();

  return {
    paths: slugs.map((slug) => ({params: {slug}})),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const page = await fetchStaticInfoBySlug(slug);

  if (isErrorMessage(page)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
    },
  };
};

export default StaticPage;

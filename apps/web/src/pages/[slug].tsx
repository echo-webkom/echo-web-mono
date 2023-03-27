import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import {fetchStaticInfoBySlug, fetchStaticInfoPaths, type StaticInfo} from "@/api/static-info";
import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Markdown from "@/components/markdown";
import {isErrorMessage} from "@/utils/error";
import {capitalize} from "@/utils/string";

type Props = {
  page: StaticInfo;
};

const StaticPage = ({page}: Props) => {
  return (
    <>
      <Head>
        <title>{capitalize(page.name)}</title>
      </Head>
      <Layout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item>{capitalize(page.name)}</Breadcrumbs.Item>
          </Breadcrumbs>

          <article className="prose md:prose-xl">
            <Markdown content={page.info} />
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

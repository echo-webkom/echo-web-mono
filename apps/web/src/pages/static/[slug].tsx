import { type GetStaticPaths, type GetStaticProps } from "next";
import Head from "next/head";
import {
  fetchStaticInfoBySlug,
  fetchStaticInfoPaths,
  type StaticInfo,
} from "@/api/static-info";
import { Breadcrum, Layout, Markdown } from "@/components";
import { isErrorMessage } from "@/utils/error";

interface Props {
  page: StaticInfo;
}

const StaticPage = ({ page }: Props) => {
  return (
    <>
      <Head>
        <title>{page.name}</title>
      </Head>
      <Layout>
        <div className="container mx-auto">
          <Breadcrum
            links={[
              { href: "/", label: "Hjem" },
              { href: "/static", label: "Statisk" },
              { href: `/static/${page.slug}`, label: page.name },
            ]}
          />

          <article className="prose md:prose-xl">
            <Markdown content={page.info} />
          </article>
        </div>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchStaticInfoPaths();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
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

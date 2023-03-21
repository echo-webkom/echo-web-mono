import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import {fetchStaticInfoBySlug, fetchStaticInfoPaths, type StaticInfo} from "@/api/static-info";
import {Breadcrum} from "@/components/breadcrums";
import {Layout} from "@/components/layout";
import {Markdown} from "@/components/markdown";
import {isErrorMessage} from "@/utils/error";
import {capitalize} from "@/utils/string";

interface Props {
  page: StaticInfo;
}

const StaticPage = ({page}: Props) => {
  return (
    <>
      <Head>
        <title>{capitalize(page.name)}</title>
      </Head>
      <Layout>
        <div className="container mx-auto">
          <Breadcrum
            links={[
              {href: "/", label: "Hjem"},
              {href: "/static", label: "Statisk"},
              {href: `/static/${page.slug}`, label: capitalize(page.name)},
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

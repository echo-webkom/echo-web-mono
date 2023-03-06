import {
  fetchStaticInfoBySlug,
  fetchStaticInfoPaths,
  StaticInfo,
} from "@/api/static-info";
import {Layout, Markdown} from "@/components";
import {isErrorMessage} from "@/utils/error";
import {GetStaticPaths, GetStaticProps} from "next";

interface Props {
  page: StaticInfo;
}

const StaticPage = ({page}: Props) => {
  return (
    <Layout>
      <div className="container mx-auto">
        <article className="prose md:prose-xl">
          <Markdown content={page.info} />
        </article>
      </div>
    </Layout>
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

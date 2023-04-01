import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import {
  fetchStudentGroupBySlug,
  fetchStudentGroupPaths,
  studentGroupTypeName,
  type StudentGroup,
} from "@/api/student-group";
import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Markdown from "@/components/markdown";
import {isErrorMessage} from "@/utils/error";

type Props = {
  group: StudentGroup;
};

const SubGroupPage = ({group}: Props) => {
  const title = studentGroupTypeName[group.groupType];

  return (
    <>
      <Head>
        <title>{`${title} - ${group.name}`}</title>
      </Head>
      <Layout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item to={`/for-students/${group.groupType}`}>{title}</Breadcrumbs.Item>
            <Breadcrumbs.Item>{group.name}</Breadcrumbs.Item>
          </Breadcrumbs>

          {/* TODO: Render group image */}

          <article className="prose md:prose-xl">
            <h1>{group.name}</h1>
            <Markdown content={group.description?.no ?? ""} />
          </article>

          {/* TODO: Render group members */}
        </Container>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchStudentGroupPaths();

  return {
    paths: slugs.map((slug) => ({params: {slug}})),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const group = await fetchStudentGroupBySlug(slug);

  if (isErrorMessage(group)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      group,
    },
  };
};

export default SubGroupPage;

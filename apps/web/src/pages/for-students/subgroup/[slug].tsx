import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import Image from "next/image";
import {
  fetchStudentGroupBySlug,
  fetchStudentGroupPathsByType,
  type StudentGroup,
  type StudentGroupType,
} from "@/api/student-group";
import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Markdown from "@/components/markdown";
import {isErrorMessage} from "@/utils/error";

const GROUP_TYPE: StudentGroupType = "subgroup";
const TITLE = "Undergruppe";

interface Props {
  group: StudentGroup;
}

const SubGroupPage = ({group}: Props) => {
  return (
    <>
      <Head>
        <title>
          {TITLE} - {group.name}
        </title>
      </Head>
      <Layout>
        <Container>
          <Breadcrumbs>
            <Breadcrumbs.Item to="/">Hjem</Breadcrumbs.Item>
            <Breadcrumbs.Item to={`/for-students/${GROUP_TYPE}`}>{TITLE}</Breadcrumbs.Item>
            <Breadcrumbs.Item>{group.name}</Breadcrumbs.Item>
          </Breadcrumbs>

          {/* TODO: Render group image */}
          {group.imageUrl && (
            <Image alt={`${group.name} bilde`} src={group.imageUrl} height={500} width={500} />
          )}

          <article className="prose md:prose-xl">
            <h1>{group.name}</h1>
            <Markdown content={group.info ?? ""} />
          </article>

          {/* TODO: Render group members */}
        </Container>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchStudentGroupPathsByType(GROUP_TYPE);

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

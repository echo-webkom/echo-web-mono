import { type GetStaticPaths, type GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { Breadcrum, Layout, Markdown } from "@/components";
import { isErrorMessage } from "@/utils/error";
import {
  fetchStudentGroupBySlug,
  fetchStudentGroupPathsByType,
  type StudentGroup,
  type StudentGroupType,
} from "@/api/student-group";

const GROUP_TYPE: StudentGroupType = "intgroup";
const TITLE = "Interessegrupper";

interface Props {
  group: StudentGroup;
}

const SubGroupPage = ({ group }: Props) => {
  return (
    <>
      <Head>
        <title>
          {TITLE} - {group.name}
        </title>
      </Head>
      <Layout>
        <div className="container mx-auto">
          <Breadcrum
            links={[
              { href: "/", label: "Hjem" },
              { href: `/for-students/${GROUP_TYPE}`, label: TITLE },
              {
                href: `/for-students/${GROUP_TYPE}/${group.slug}`,
                label: group.name,
              },
            ]}
          />

          {/* TODO: Render group image */}
          {group.imageUrl && (
            <Image
              alt={`${group.name} bilde`}
              src={group.imageUrl}
              height={500}
              width={500}
            />
          )}

          <article className="prose md:prose-xl">
            <Markdown content={group.info} />
          </article>

          {/* TODO: Render group members */}
        </div>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchStudentGroupPathsByType(GROUP_TYPE);

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
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

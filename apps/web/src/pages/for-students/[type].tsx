import {type GetStaticPaths, type GetStaticProps} from "next";
import Head from "next/head";
import Link from "next/link";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import removeMd from "remove-markdown";

import {
  fetchStudentGroupsByType,
  studentGroupTypeName,
  studentGroupTypes,
  type StudentGroup,
  type StudentGroupType,
} from "@/api/student-group";
import Container from "@/components/container";
import Layout from "@/layouts/layout";
import {isErrorMessage} from "@/utils/error";

type Props = {
  groups: Array<StudentGroup>;
  type: StudentGroupType;
};

const SubGroupPage = ({groups, type}: Props) => {
  return (
    <>
      <Head>
        <title>{studentGroupTypeName[type]}</title>
      </Head>
      <Layout>
        <Container>
          <h1 className="mb-4 text-4xl font-bold">{studentGroupTypeName[type]}</h1>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {groups.map((group) => (
              <li key={group._id}>
                <Link href={`/for-students/group/${group.slug}`}>
                  <div className="group rounded bg-slate-100 p-5 transition-all duration-200 hover:shadow">
                    <h2 className="mb-3 text-2xl font-bold">{group.name}</h2>
                    <p className="line-clamp-3 text-slate-500">
                      {removeMd(group.description?.no ?? "")}
                    </p>
                    <p className="flex items-center gap-1">
                      Les mer
                      <span className="transition-all duration-150 group-hover:pl-1">
                        <ArrowRightIcon />
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const types = studentGroupTypes;

  return {
    paths: types.map((type) => ({params: {type}})),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const type = ctx.params?.type as StudentGroupType;

  const groups = await fetchStudentGroupsByType(type, -1);

  if (isErrorMessage(groups)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      groups,
      type,
    },
  };
};

export default SubGroupPage;

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
import SpotlightCard from "@/components/spotlight-card";
import DefaultLayout from "@/layouts/default";
import {isErrorMessage} from "@/utils/error";

type Props = {
  groups: Array<StudentGroup>;
  groupType: StudentGroupType;
};

const SubGroupPage = ({groups, groupType}: Props) => {
  return (
    <>
      <Head>
        <title>{studentGroupTypeName[groupType]}</title>
      </Head>
      <DefaultLayout>
        <Container>
          <h1 className="mb-4 text-4xl font-bold">{studentGroupTypeName[groupType]}</h1>
          <ul className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {groups.map((group) => (
              <li key={group._id}>
                <Link href={`/for-students/group/${group.slug}`}>
                  <SpotlightCard>
                    <div className="flex flex-col gap-3 p-5">
                      <h2 className="text-2xl font-bold">{group.name}</h2>
                      <p className="line-clamp-3 text-slate-700">
                        {removeMd(group.description ?? "")}
                      </p>
                      <p className="flex items-center gap-1 group-hover:underline">
                        Les mer
                        <span className="transition-all duration-150 group-hover:pl-1">
                          <ArrowRightIcon />
                        </span>
                      </p>
                    </div>
                  </SpotlightCard>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </DefaultLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const groupTypes = studentGroupTypes;

  return {
    paths: groupTypes.map((groupType) => ({params: {groupType}})),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const groupType = ctx.params?.groupType as StudentGroupType;

  const groups = await fetchStudentGroupsByType(groupType, -1);

  if (isErrorMessage(groups)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      groups,
      groupType,
    },
  };
};

export default SubGroupPage;

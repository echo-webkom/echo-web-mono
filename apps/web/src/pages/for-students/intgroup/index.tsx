import Link from "next/link";
import {
  fetchStudentGroupsByType,
  type StudentGroup,
  type StudentGroupType,
} from "@/api/student-group";
import Container from "@/components/container";
import Layout from "@/components/layout";
import {isErrorMessage} from "@/utils/error";

const GROUP_TYPE: StudentGroupType = "intgroup";
const TITLE = "Interessegrupper";

interface Props {
  groups: Array<StudentGroup>;
}

const SubOrgsPage = ({groups}: Props) => {
  return (
    <>
      <Layout>
        <Container>
          <h1 className="mb-5 text-4xl font-bold md:text-6xl">{TITLE}</h1>

          <ul className="flex flex-col gap-3">
            {groups.map((group) => (
              <li key={group.slug}>
                <Link href={`/for-students/${GROUP_TYPE}/${group.slug}`}>Les om, {group.name}</Link>
              </li>
            ))}
          </ul>
        </Container>
      </Layout>
    </>
  );
};

export const getStaticProps = async () => {
  const groups = await fetchStudentGroupsByType(GROUP_TYPE);

  if (isErrorMessage(groups)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      groups,
    },
  };
};

export default SubOrgsPage;

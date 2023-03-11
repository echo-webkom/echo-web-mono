import Link from "next/link";
import {
  fetchStudentGroupsByType,
  type StudentGroup,
  type StudentGroupType,
} from "@/api/student-group";
import {Layout} from "@/components";
import {isErrorMessage} from "@/utils/error";

const GROUP_TYPE: StudentGroupType = "subgroup";
const TITLE = "Undergrupper";

interface Props {
  groups: Array<StudentGroup>;
}

const SubGroupsPage = ({groups}: Props) => {
  return (
    <>
      <Layout>
        <div className="container mx-auto px-3">
          <h1 className="mb-5 text-4xl font-bold md:text-6xl">{TITLE}</h1>

          <ul className="flex flex-col gap-3">
            {groups.map((group) => (
              <li key={group.slug}>
                <Link href={`/for-students/${GROUP_TYPE}/${group.slug}`}>Les om, {group.name}</Link>
              </li>
            ))}
          </ul>
        </div>
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

export default SubGroupsPage;

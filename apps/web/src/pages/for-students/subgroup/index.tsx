import Link from "next/link";
import {
  fetchStudentGroupsByType,
  type StudentGroup,
  type StudentGroupType,
} from "@/api/student-group";
import Container from "@/components/container";
import Layout from "@/components/layout";
import {isErrorMessage} from "@/utils/error";
import {motion} from "framer-motion";

const GROUP_TYPE: StudentGroupType = "subgroup";
const TITLE = "Undergrupper";

interface Props {
  groups: Array<StudentGroup>;
}

const SubGroupsPage = ({groups}: Props) => {
  return (
    <>
      <Layout>
        <Container>
          <h1 className="mb-5 text-4xl font-bold md:text-6xl">{TITLE}</h1>

          <ul className="flex flex-col gap-3">
            {groups.map((group) => (
              <div className="overflow-hidden" key={group.slug}>
                <motion.li
                  initial={{y: "150%"}}
                  animate={{y: "0%"}}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 20,
                    duration: 1.5,
                  }}
                >
                  <Link href={`/for-students/${GROUP_TYPE}/${group.slug}`}>
                    Les om, {group.name}
                  </Link>
                </motion.li>
              </div>
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

export default SubGroupsPage;

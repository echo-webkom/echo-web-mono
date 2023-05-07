import {notFound} from "next/navigation";

import {type StudentGroupType} from "@echo-webkom/lib";

import Container from "@/components/container";
import StudentGroupPreview from "@/components/student-group-preview";
import Heading from "@/components/ui/heading";
import {
  fetchStudentGroupsByType,
  studentGroupTypeName,
  studentGroupTypeToUrl,
} from "@/sanity/student-group";

export const dynamicParams = false;

type Props = {
  params: {
    groupType: string;
  };
};

export function generateStaticParams() {
  const params = Object.values(studentGroupTypeToUrl).map((groupType) => ({
    params: {groupType},
  }));

  return params;
}

export default async function StudentGroupOverview({params}: Props) {
  const {groupType} = params;
  const groupTypeFromPath = pathToGroupType(groupType);

  const groups = await fetchStudentGroupsByType(groupTypeFromPath, -1);

  return (
    <Container>
      <Heading>{studentGroupTypeName[groupTypeFromPath]}</Heading>

      <ul className="grid grid-cols-1 lg:grid-cols-2">
        {groups.map((group) => (
          <li key={group._id}>
            <StudentGroupPreview group={group} />
          </li>
        ))}
      </ul>
    </Container>
  );
}

const pathToGroupType = (path: string) => {
  const groupType = Object.entries(studentGroupTypeToUrl).find(([_, url]) => url === path)?.[0];

  if (!groupType) {
    notFound();
  }

  return groupType as StudentGroupType;
};

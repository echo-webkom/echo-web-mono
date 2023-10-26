import { notFound } from "next/navigation";

import { type StudentGroupType } from "@echo-webkom/lib";

import { Container } from "@/components/container";
import { StudentGroupPreview } from "@/components/student-group-preview";
import { Heading } from "@/components/typography/heading";
import { fetchStudentGroupsByType, studentGroupTypeName } from "@/sanity/student-group";

type Props = {
  params: {
    groupType: string;
  };
};

export function generateMetadata({ params }: Props) {
  const { groupType } = params;

  const groupTypeFromPath = pathToGroupType(groupType);

  return {
    title: studentGroupTypeName[groupTypeFromPath],
  };
}

export function generateStaticParams() {
  return Object.values(studentGroupTypeName).map((groupType) => ({
    groupType: groupType.toLowerCase(),
  }));
}

export default async function StudentGroupOverview({ params }: Props) {
  const { groupType } = params;
  const groupTypeFromPath = pathToGroupType(groupType);

  const groups = await fetchStudentGroupsByType(groupTypeFromPath, -1);

  return (
    <Container>
      <Heading className="mb-4">{studentGroupTypeName[groupTypeFromPath]}</Heading>

      <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {groups.map((group) => (
          <li key={group._id}>
            <StudentGroupPreview group={group} withBorder />
          </li>
        ))}
      </ul>
    </Container>
  );
}

function pathToGroupType(path: string) {
  const groupType = Object.entries(studentGroupTypeName).find(
    ([_, url]) => url.toLowerCase() === path,
  )?.[0];

  if (!groupType) {
    return notFound();
  }

  return groupType as StudentGroupType;
}

import { cache } from "react";
import { notFound } from "next/navigation";

import { type StudentGroupType } from "@echo-webkom/lib";

import { Container } from "@/components/container";
import { StudentGroupPreview } from "@/components/student-group-preview";
import { Heading } from "@/components/typography/heading";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";
import { fetchStudentGroupsByType } from "@/sanity/student-group";
import { studentGroupTypeName } from "@/sanity/utils/mappers";

type Props = {
  params: Promise<{
    groupType: string;
  }>;
};

export const generateMetadata = async (props: Props) => {
  const params = await props.params;
  const { groupType } = params;

  const groupTypeFromPath = pathToGroupType(groupType);
  const groupName = studentGroupTypeName[groupTypeFromPath];
  const sine = groupTypeFromPath === "board" || groupTypeFromPath === "sport" ? "sitt" : "sine";

  return {
    title: groupName,
    description: `En oversikt over echo ${sine} ${groupName.toLowerCase()}.`,
  };
};

export default async function StudentGroupOverview(props: Props) {
  const params = await props.params;
  const { groupType } = params;
  const groupTypeFromPath = pathToGroupType(groupType);

  const groups = await fetchStudentGroupsByType(groupTypeFromPath, -1);

  groups.sort((a, b) => {
    const aValue = a.isActive;
    const bValue = b.isActive;

    if (aValue && !bValue) return -1;
    if (bValue && !aValue) return 1;
    return 0;
  });

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar />

      <div>
        <Heading className="mb-4">{studentGroupTypeName[groupTypeFromPath]}</Heading>

        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {groups.map((group) => (
            <li key={group._id}>
              <StudentGroupPreview group={group} />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

const pathToGroupType = cache((path: string) => {
  const groupType = Object.entries(studentGroupTypeName).find(
    ([_, url]) => url.toLowerCase() === path,
  )?.[0];

  if (!groupType) {
    return notFound();
  }

  return groupType as StudentGroupType;
});

import {type StudentGroupType} from "@echo-webkom/lib";

import Container from "@/components/container";
import StudentGroupPreview from "@/components/student-group-preview";
import {
  fetchStudentGroupsByType,
  studentGroupTypeName,
  studentGroupTypeToUrl,
} from "@/sanity/student-group";

export const dynamicParams = false;

export function generateStaticParams() {
  const params = Object.values(studentGroupTypeToUrl).map((groupType) => ({
    params: {groupType},
  }));

  return params;
}

const pathToGroupType = (path: string) => {
  const groupType = Object.entries(studentGroupTypeToUrl).find(([_, url]) => url === path)?.[0];

  if (!groupType) {
    throw new Error(`Invalid path: ${path}`);
  }

  return groupType as StudentGroupType;
};

export default async function StudentGroupOverview({params}: {params: {groupType: string}}) {
  const {groupType} = params;
  const groupTypeFromPath = pathToGroupType(groupType);

  const groups = await fetchStudentGroupsByType(groupTypeFromPath, -1);

  return (
    <Container>
      <h1 className="text-4xl font-bold">{studentGroupTypeName[groupTypeFromPath]}</h1>

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

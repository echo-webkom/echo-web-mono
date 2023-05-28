import {prisma} from "@echo-webkom/db/client";

import Container from "@/components/container";
import Heading from "@/components/ui/heading";
import {AddGroup} from "./add-group";
import {StudentGroupPreview} from "./group-preview";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Grupper",
};

export default async function FeedbackOverview() {
  const studentGroups = await prisma.studentGroup.findMany({
    include: {
      members: true,
      leaders: true,
    },
  });

  return (
    <Container>
      <Heading>Grupper</Heading>

      <AddGroup />

      {/* TODO: Add member (with email) to group */}

      <ul className="flex flex-col gap-5">
        {studentGroups.map((studentGroup) => (
          <li key={studentGroup.id}>
            <StudentGroupPreview studentGroup={studentGroup} />
          </li>
        ))}
      </ul>
    </Container>
  );
}

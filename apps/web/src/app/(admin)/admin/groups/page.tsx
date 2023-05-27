import {prisma} from "@echo-webkom/db/client";

import Container from "@/components/container";
import Heading from "@/components/ui/heading";

export const dynamic = "force-dynamic";

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

      {/* TODO: Add group */}
      {/* TODO: Add member (with email) to group */}

      <ul className="flex flex-col gap-5">
        {studentGroups.map((group) => (
          <li key={group.id}>
            <div className="rounded-lg border p-3">
              <Heading level={3}>{group.name}</Heading>

              <Heading level={4}>Ledere</Heading>
              <ul>
                {group.leaders.map((leader) => (
                  <li key={leader.id}>{leader.name}</li>
                ))}
              </ul>

              <Heading level={4}>Medlemmer</Heading>
              <ul>
                {group.members.map((member) => (
                  <li key={member.id}>{member.name}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}

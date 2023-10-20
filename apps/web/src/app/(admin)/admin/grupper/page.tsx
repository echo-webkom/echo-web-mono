import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/ui/heading";

export default async function AdminGroupsPage() {
  const groups = await db.query.groups.findMany();

  return (
    <Container>
      <Heading className="mb-4">Grupper</Heading>

      <ul>
        {groups.map((group) => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ul>
    </Container>
  );
}

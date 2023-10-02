import { db } from "@echo-webkom/storage";

import { Container } from "@/components/container";
import { Heading } from "@/components/ui/heading";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const dynamic = "force-dynamic";

export default async function FeedbackOverview() {
  const users = await db.query.users.findMany({
    with: {
      groups: true,
    },
  });

  return (
    <Container>
      <Heading>Brukere</Heading>

      <DataTable columns={columns} data={users} />
    </Container>
  );
}

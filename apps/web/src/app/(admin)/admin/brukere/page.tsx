import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { getAllUsers } from "@/lib/queries/user";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const dynamic = "force-dynamic";

export type AllUsers = Awaited<ReturnType<typeof getAllUsers>>;

export default async function FeedbackOverview() {
  const [users, groups] = await Promise.all([getAllUsers(), db.query.groups.findMany()]);

  const data = users.map((user) => {
    return {
      user,
      groups,
    };
  });

  return (
    <Container>
      <Heading className="mb-4">Brukere</Heading>

      <DataTable columns={columns} data={data} />
    </Container>
  );
}

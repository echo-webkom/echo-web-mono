import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { getAllUsers } from "@/lib/queries/user";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const dynamic = "force-dynamic";

export type AllUsers = Awaited<ReturnType<typeof getAllUsers>>;

export default async function UsersOverview() {
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

      <div className="flex flex-col gap-2 py-4">
        <p className="font-semibold">Oversikt over alle bukere.</p>

        <p>Totalt: {users.length}</p>
      </div>

      <DataTable columns={columns} data={data} />
    </Container>
  );
}

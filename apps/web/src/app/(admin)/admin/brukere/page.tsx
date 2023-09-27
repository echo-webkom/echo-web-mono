import { Container } from "@/components/container";
import { Heading } from "@/components/ui/heading";
import { getAllUsers } from "@/lib/queries/user";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const dynamic = "force-dynamic";

export default async function FeedbackOverview() {
  const { data: users } = await getAllUsers();

  return (
    <Container>
      <Heading>Brukere</Heading>

      {users === undefined ? <p>Ingen brukere</p> : <DataTable columns={columns} data={users} />}
    </Container>
  );
}

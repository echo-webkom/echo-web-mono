import {getAllUsers} from "@echo-webkom/db/queries/user";

import Container from "@/components/container";
import Heading from "@/components/ui/heading";
import {columns} from "./columns";
import {DataTable} from "./data-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Brukere",
};

export default async function FeedbackOverview() {
  const users = await getAllUsers();

  return (
    <Container>
      <Heading>Brukere</Heading>

      <DataTable columns={columns} data={users} />
    </Container>
  );
}

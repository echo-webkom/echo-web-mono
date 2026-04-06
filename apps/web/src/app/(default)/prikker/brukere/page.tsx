import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { ensureBedkom } from "@/lib/ensure";

import { unoWithAdmin } from "../../../../api/server";
import { StrikesList } from "./_components/strikes-list";

export default async function StrikesDashboard() {
  await ensureBedkom();

  const users = await unoWithAdmin.users.withStrikes();

  return (
    <Container>
      <Heading className="mb-8">Dashboard</Heading>

      <StrikesList users={users} />
    </Container>
  );
}

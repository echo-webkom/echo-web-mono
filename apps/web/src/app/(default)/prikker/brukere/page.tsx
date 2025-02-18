import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { getBannedUsers } from "@/data/users/queries";
import { ensureBedkom } from "@/lib/ensure";
import { StrikesList } from "./_components/strikes-list";

export default async function StrikesDashboard() {
  await ensureBedkom();

  const bannedUsers = await getBannedUsers();

  return (
    <Container>
      <Heading className="mb-8">Dashboard</Heading>

      <StrikesList users={bannedUsers} />
    </Container>
  );
}

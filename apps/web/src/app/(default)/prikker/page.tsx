import { Container } from "@/components/container";
import { getAllUsersWithStrikes } from "@/data/strikes/queries";
import { ensureBedkom } from "@/lib/ensure";
import { StrikesTable } from "./table";

export default async function StrikesPage() {
  await ensureBedkom();
  const usersWithStrikes = await getAllUsersWithStrikes();

  return (
    <Container>
      <StrikesTable usersWithStrikes={usersWithStrikes} />
    </Container>
  );
}

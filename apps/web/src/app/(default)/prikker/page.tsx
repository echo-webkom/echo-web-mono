import { Container } from "@/components/layout/container";
import { getAllUsersWithValidStrikes } from "@/data/strikes/queries";
import { ensureBedkom } from "@/lib/ensure";
import StrikesTable from "./table";

export default async function StrikesPage() {
  await ensureBedkom();
  const usersWithStrikes = await getAllUsersWithValidStrikes();

  return (
    <Container>
      <StrikesTable usersWithStrikes={usersWithStrikes} />
    </Container>
  );
}

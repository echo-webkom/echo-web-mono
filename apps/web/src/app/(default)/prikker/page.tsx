import { Container } from "@/components/container";
import { getAllUsersWithValidStrikes } from "@/data/strikes/queries";
import StrikesTable from "./table";

export default async function StrikesPage() {
  const usersWithStrikes = await getAllUsersWithValidStrikes();

  return (
    <Container>
      <StrikesTable usersWithStrikes={usersWithStrikes} />
    </Container>
  );
}

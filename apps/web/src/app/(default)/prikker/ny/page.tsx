import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { getUsersWithStrikes } from "@/data/users/queries";
import { ensureBedkom } from "@/lib/ensure";
import { NewStrikesForm } from "./_components/new-strikes-form";

export default async function CreateStrikes() {
  await ensureBedkom();
  const users = await getUsersWithStrikes();

  return (
    <Container>
      <Heading className="mb-8">Legg til prikker</Heading>

      <NewStrikesForm users={users} />
    </Container>
  );
}

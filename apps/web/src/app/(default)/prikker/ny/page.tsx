import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { ensureBedkom } from "@/lib/ensure";
import { unoWithAdmin } from "../../../../api/server";
import { NewStrikesForm } from "./_components/new-strikes-form";

export default async function CreateStrikes() {
  await ensureBedkom();
  const users = await unoWithAdmin.strikes.listStriked();

  return (
    <Container>
      <Heading className="mb-8">Legg til prikker</Heading>

      <NewStrikesForm users={users} />
    </Container>
  );
}

import { unoWithAdmin } from "@/api/server";
import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { ensureBedkom } from "@/lib/ensure";

import { NewStrikesForm } from "./_components/new-strikes-form";

export default async function CreateStrikes() {
  await ensureBedkom();
  const detailedUsers = await unoWithAdmin.users.withStrikes();

  // Map the detailed user data to a simpler format for the form
  const users = detailedUsers.map((user) => {
    const strikes = user.dots.reduce((sum, dot) => sum + dot.count, 0);
    return {
      id: user.id,
      name: user.name ?? "",
      hasImage: user.hasImage,
      isBanned: user.banInfo !== null,
      strikes,
    };
  });

  return (
    <Container>
      <Heading className="mb-8">Legg til prikker</Heading>

      <NewStrikesForm users={users} />
    </Container>
  );
}

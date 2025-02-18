import { db } from "@echo-webkom/db/serverless";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { ensureBedkom } from "@/lib/ensure";
import { NewStrikesForm } from "./_components/new-strikes-form";

const getUsers = async () => {
  return await db.query.users
    .findMany({
      with: {
        dots: true,
        banInfo: true,
      },
    })
    .then((users) =>
      users.map((user) => ({
        id: user.id,
        name: user.name ?? "Ingen navn",
        imageUrl: user.image,
        isBanned: user.banInfo !== null,
        strikes: user.dots.reduce((acc, dot) => acc + dot.count, 0),
      })),
    );
};

export default async function CreateStrikes() {
  await ensureBedkom();
  const users = await getUsers();

  return (
    <Container>
      <Heading className="mb-8">Legg til prikker</Heading>

      <NewStrikesForm users={users} />
    </Container>
  );
}

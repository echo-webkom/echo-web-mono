import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";

export default async function AdminStrikesPage() {
  const usersWithStikes = await db.query.users.findMany({
    with: {
      strikes: true,
    },
  });

  return (
    <Container>
      <Heading>Prikker</Heading>

      <div className="flex flex-col gap-2 py-4">
        <p className="font-semibold">Oversikt over alle brukere og deres prikker.</p>
      </div>

      <ul>
        {usersWithStikes.map((user) => {
          return (
            <li key={user.id}>
              {user.name} ({user.email}) har {user.strikes.length} prikker.
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

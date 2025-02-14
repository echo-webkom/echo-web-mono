import { db } from "@echo-webkom/db/serverless";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { ensureBedkom } from "@/lib/ensure";
import { StrikeRow } from "./_components/strike-row";

export default async function StrikesDashboard() {
  await ensureBedkom();

  const users = await db.query.users
    .findMany({
      orderBy: (user, { asc }) => [asc(user.name)],
      with: {
        dots: {
          with: {
            strikedByUser: {
              columns: {
                name: true,
              },
            },
          },
        },
        banInfo: {
          with: {
            bannedByUser: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    })
    .then((users) => users.filter((user) => user.dots.length > 0 || user.banInfo !== null));

  return (
    <Container>
      <Heading className="mb-8">Dashboard</Heading>

      <div>
        {!users.length && <Text>Ingen brukere har prikker.</Text>}

        {users.length > 0 && (
          <ul className="flex flex-col divide-y">
            {users.map((user) => {
              return (
                <StrikeRow
                  key={user.id}
                  userId={user.id}
                  name={user.name ?? "Ingen navn"}
                  banInfo={user.banInfo}
                  strikes={user.dots}
                />
              );
            })}
          </ul>
        )}
      </div>
    </Container>
  );
}

import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";

export default async function AdminGroupsPage() {
  const groups = await db.query.groups.findMany({
    with: {
      members: {
        with: {
          user: {
            columns: {
              name: true,
            },
          },
        },
      },
      leaderUser: {
        columns: {
          name: true,
        },
      },
    },
  });

  const g = groups.map((group) => {
    return {
      "id/slug": group.id,
      name: group.name,
      leader: group.leaderUser?.name ?? "Ingen",
      members: group.members.map((member) => member.user.name),
    };
  });

  return (
    <Container>
      <Heading>Grupper</Heading>

      <div className="flex flex-col gap-2 py-4">
        <p className="font-semibold">Oversikt over alle grupper og medlemmer.</p>

        <p>
          Denne siden kan brukes til debugging om noen sier at de ikke er medlem av en gruppe. Man
          også bruke denne siden til å debugge {"id"} på en gruppe. For at en undergruppe skal kunne
          se de som er påmeldt på arrangmentet sitt, så må {"id"} i databasen matche {"slug"} i
          Sanity på undergruppen.
        </p>

        <p>
          <i>(Ikke implementert enda)</i> Det er tenkt at en leder av en gruppe skal ha muligheten
          til å legge til nye personer i de gruppene personen er leder av.
        </p>
      </div>

      <code className="rounded-md bg-slate-100 p-2 font-mono">
        <pre>{JSON.stringify(g, null, 2)}</pre>
      </code>
    </Container>
  );
}

import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { ensureWebkom } from "@/lib/ensure";

export const dynamic = "force-dynamic";

export default async function AdminHappeningsPage() {
  await ensureWebkom();

  const happenings = await db.query.happenings.findMany({
    columns: {
      slug: true,
      title: true,
    },
    with: {
      groups: {
        with: {
          group: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const h = happenings.map((happening) => {
    return {
      "slug/id": happening.slug,
      title: happening.title,
      groups: happening.groups.map((group) => `${group.group.id}/${group.group.name}`),
    };
  });

  return (
    <Container>
      <Heading>Happenings</Heading>

      <div className="flex flex-col gap-2 py-4">
        <p className="font-semibold">
          Oversikt over alle happenings og gruppene som {"eier"} happeningen.
        </p>

        <p>
          Navne på gruppene er{" "}
          <i>
            {"{id}"}/{"{navn}"}
          </i>
          .
        </p>

        <p>
          Her kan du se at de riktige gruppene er knyttet til de riktige happeningene. Hvis en
          undergruppe ikke har tilgang til å se påmeldte på et arrangement, så kan det være fordi at
          {"id"} på en gruppe ikke matcher {"slug"} på gruppen i Sanity.
        </p>

        <p>
          Om folk ikke får til å melde seg på en happening kan dette være fordi den ikke eksisterer
          i databasen eller fordi slugen ikke matcher den i Sanity.
        </p>
      </div>

      <code className="rounded-md bg-card p-2 font-mono text-card-foreground">
        <pre>{JSON.stringify(h, null, 2)}</pre>
      </code>
    </Container>
  );
}

import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/ui/heading";

export default async function AdminDegreePage() {
  const degrees = await db.query.degrees.findMany();

  return (
    <Container>
      <Heading>Studieretninger</Heading>

      <div className="flex flex-col gap-2 py-4">
        <p className="font-semibold">Oversikt over alle studieretninger</p>

        <p>
          <i>(Ikke implementert enda)</i> Burde være mulig å legge til flere her.
        </p>
      </div>

      <code className="rounded-md bg-slate-100 p-2 font-mono">
        <pre>{JSON.stringify(degrees, null, 2)}</pre>
      </code>
    </Container>
  );
}

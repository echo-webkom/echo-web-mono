import { unstable_noStore as noStore } from "next/cache";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { getFullHappenings } from "@/data/happenings/queries";
import { ensureWebkom } from "@/lib/ensure";
import { unoWithAdmin } from "../../../../api/server";
import { HappeningTable } from "./_components/happening-table";

export default async function AdminHappeningsPage() {
  noStore();
  await ensureWebkom();

  const [happenings, groups] = await Promise.all([getFullHappenings(), unoWithAdmin.groups.all()]);

  return (
    <Container>
      <Heading className="mb-4">Arrangementer</Heading>

      <HappeningTable happenings={happenings} groups={groups} />
    </Container>
  );
}

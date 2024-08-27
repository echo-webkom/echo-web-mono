import { unstable_noStore as noStore } from "next/cache";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { getStudentGroups } from "@/data/groups/queries";
import { getFullHappenings } from "@/data/happenings/queries";
import { ensureWebkom } from "@/lib/ensure";
import { HappeningTable } from "./_components/happening-table";

export default async function AdminHappeningsPage() {
  noStore();
  await ensureWebkom();

  const [happenings, groups] = await Promise.all([getFullHappenings(), getStudentGroups()]);

  return (
    <Container>
      <Heading className="mb-4">Arrangementer</Heading>

      <HappeningTable happenings={happenings} groups={groups} />
    </Container>
  );
}

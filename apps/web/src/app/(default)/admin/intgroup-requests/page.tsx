import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { ensureWebkomOrHovedstyret } from "@/lib/ensure";

import { unoWithAdmin } from "../../../../api/server";
import { IntgroupRequestList } from "./_components/intgroup-request-list";

export default async function IntgroupRequestsPage() {
  await ensureWebkomOrHovedstyret();
  const requests = await unoWithAdmin.groups.intgroupRequests();

  return (
    <Container>
      <Heading className="mb-4">Interessegruppeforespørsler</Heading>
      <IntgroupRequestList requests={requests} />
    </Container>
  );
}

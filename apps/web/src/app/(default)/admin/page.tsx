import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

import { featureFlags } from "../../../data/kv/namespaces";
import ToggleHsApplications from "./toggle-components/hs-applications-toggle";

export default async function Dashboard() {
  const flag = await featureFlags.get("HS-Application");
  const val = flag?.showHSApplications ?? false;

  return (
    <Container>
      <Heading className="mb-4">Dashboard</Heading>
      <Text>
        Velkommen til dashboardet. Her kan du se en oversikt over happenings, tilbakemeldinger,
        brukere, grupper, studieretninger og whitelist.
      </Text>
      <Text>Toggle componenter her:</Text>
      <ToggleHsApplications initialValue={val} />
    </Container>
  );
}

import { Suspense } from "react";

import { getAuth } from "@echo-webkom/auth";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { coffeeStriker } from "@/lib/coffee-striker";
import { userIsInGroup } from "@/lib/groups";
import { AdminButtonClient } from "./admin-button.client";

export default async function KitchenStrikes() {
  const strikes = await coffeeStriker.getStrikes();

  return (
    <Container>
      <Heading>Kjøkkenet</Heading>
      <Suspense fallback={null}>
        <AdminButton />
      </Suspense>

      <Text>Totalt har vi fått {strikes} anmerkninger</Text>
    </Container>
  );
}

async function AdminButton() {
  const user = await getAuth();

  if (!user) {
    return null;
  }

  const canAddStrike = (await userIsInGroup(user.id, ["hovedstyret"])) || user.type === "admin";

  if (!canAddStrike) {
    return null;
  }

  return <AdminButtonClient />;
}

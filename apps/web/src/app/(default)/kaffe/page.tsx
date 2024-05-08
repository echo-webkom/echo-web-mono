import { kaffeApi } from "@/api/kaffe";
import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Text } from "@/components/typography/text";
import { getUser } from "@/lib/get-user";
import { isMemberOf } from "@/lib/memberships";
import { StrikeButtons } from "./StrikeButtons";

export default async function KaffeAdmin() {
  const user = await getUser();

  if (!user) {
    return <div>Not logged in</div>;
  }

  if (!isMemberOf(user, ["hovedstyret", "webkom"])) {
    return <div>Not authorized</div>;
  }

  const strikes = await kaffeApi.getStrikes();

  return (
    <Container className="py-10">
      <Markdown
        content={`
# Kaffe-admin

Her kan du administrere prikker på kaffemaskinen. Du kan også resette prikkene.

## Regler for prikk

Hvis det går mindre enn en time mellom to rapporter, blir det lagt inn som en anmerkning.
Det må ikke være samme person som trykker.
Hvis det er over x (TBA) antall anmerkninger, fjernes kaffemaskinen.

Anmerkninger fjernes etter en uke.
      `}
      />

      <Text className="my-6 text-3xl">Antall prikker: {strikes}</Text>

      <StrikeButtons />
    </Container>
  );
}

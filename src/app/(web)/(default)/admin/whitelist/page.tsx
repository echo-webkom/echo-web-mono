import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { ensureWebkomOrHovedstyret } from "@/lib/ensure";
import { AccessRequestTable } from "./_components/access-request-table";
import { WhitelistButton } from "./_components/whitelist-button";
import { WhitelistTable } from "./_components/whitelist-table";

export default async function WhitelistPage() {
  await ensureWebkomOrHovedstyret();

  return (
    <Container>
      <div className="flex flex-row justify-between">
        <Heading>Whitelist</Heading>
        <WhitelistButton className="mx-4">Legg til</WhitelistButton>
      </div>

      <Text className="font-semibold">
        E-post adresser med tilgang uten å være medlemmer av echo.
      </Text>

      <Text className="mb-10">
        Legg til e-post adresser som skal ha tilgang til echo sine sider uten å være medlemmer av
        echo. Trykk på {'"Legg til"'} for å gi tilgang til en ny bruker. Trykk på {'"Endre"'} for å
        oppdatere utløpsdato eller slette tilgangen til en bruker. E-post adressen skal være på
        formen <i>fornavn.etternavn@student.uib.no</i>
      </Text>

      <div className="space-y-8">
        <AccessRequestTable />
        <WhitelistTable />
      </div>
    </Container>
  );
}

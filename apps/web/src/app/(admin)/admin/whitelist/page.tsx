import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import WhitelistButton from "@/components/whitelist-button";
import { shortDateNoTime } from "@/utils/date";

export const dynamic = "force-dynamic";

export default async function WhitelistPage() {
  const whitelisted = await db.query.whitelist.findMany();

  return (
    <Container>
      <div className="flex flex-row justify-between">
        <Heading level={1}>Whitelist</Heading>
        <WhitelistButton className="mx-4">Legg til</WhitelistButton>
      </div>
      <Text size="md" className="font-semibold">
        E-post adresser med tilgang uten å være medlemmer av echo.
      </Text>

      <Text size="md" className="mb-10">
        Legg til e-post adresser som skal ha tilgang til echo sine sider uten å være medlemmer av
        echo. Trykk på {"Legg til"} for å gi tilgang til en ny bruker. Trykk på {"Endre"} for å
        oppdatere utløpsdato eller slette tilgangen til en bruker. E-post adressen skal være på
        formen <i>fornavn.etternavn@student.uib.no</i>
      </Text>

      <table className="w-full table-fixed border-separate rounded-md border">
        <thead>
          <tr>
            <th className="border-b px-4 py-2 text-left text-sm font-medium text-neutral-500">
              E-post
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-medium text-neutral-500">
              Utløper
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-medium text-neutral-500">
              Grunn
            </th>
            <th className="w-32 border-b px-4 py-2 text-left text-sm font-medium text-neutral-500"></th>
          </tr>
        </thead>
        <tbody>
          {whitelisted.map((whitelistEntry) => (
            <tr key={whitelistEntry.email} className="group">
              <td className="border-x-0 border-b p-4 group-last:border-none ">
                {whitelistEntry.email}
              </td>
              <td className="border-x-0 border-b p-4 group-last:border-none ">
                {shortDateNoTime(whitelistEntry.expiresAt)}
              </td>
              <td className="break-words border-x-0 border-b p-4 group-last:border-none ">
                {whitelistEntry.reason}
              </td>
              <td className="border-x-0 border-b p-4 text-end group-last:border-none">
                {
                  <WhitelistButton variant="secondary" whitelistEntry={whitelistEntry}>
                    Endre
                  </WhitelistButton>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}

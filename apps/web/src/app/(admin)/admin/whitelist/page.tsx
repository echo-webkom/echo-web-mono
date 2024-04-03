import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import WhitelistButton from "@/components/whitelist-button";
import { getWhitelist } from "@/data/whitelist/queries";
import { ensureWebkomOrHovedstyret } from "@/lib/ensure";
import { shortDateNoTime } from "@/utils/date";

export default async function WhitelistPage() {
  await ensureWebkomOrHovedstyret();

  const whitelisted = await getWhitelist();

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>E-post</TableHead>
            <TableHead>Utløper</TableHead>
            <TableHead>Grunn</TableHead>
            <TableHead>{/* Actions */}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {whitelisted.map((whitelistEntry) => (
            <TableRow key={whitelistEntry.email} className="group">
              <TableCell>{whitelistEntry.email}</TableCell>
              <TableCell>{shortDateNoTime(whitelistEntry.expiresAt)}</TableCell>
              <TableCell>{whitelistEntry.reason}</TableCell>
              <TableCell>
                <WhitelistButton variant="secondary" whitelistEntry={whitelistEntry}>
                  Endre
                </WhitelistButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

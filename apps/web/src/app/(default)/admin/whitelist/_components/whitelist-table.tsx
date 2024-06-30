import { Heading } from "@/components/typography/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getWhitelist } from "@/data/whitelist/queries";
import { shortDateNoTime } from "@/utils/date";
import { WhitelistButton } from "./whitelist-button";

export const WhitelistTable = async () => {
  const whitelisted = await getWhitelist();

  return (
    <div>
      <Heading level={2} className="mb-4">
        Whitelist
      </Heading>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>E-post</TableHead>
            <TableHead>Utløper</TableHead>
            <TableHead>Grunn</TableHead>
            <TableHead>Gjør endringer</TableHead>
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
    </div>
  );
};

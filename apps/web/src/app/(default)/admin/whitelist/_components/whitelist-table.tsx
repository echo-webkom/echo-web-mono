import { Heading } from "@/components/typography/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortDateNoTime } from "@/utils/date";
import { unoWithAdmin } from "../../../../../api/server";
import { WhitelistButton } from "./whitelist-button";

export const WhitelistTable = async () => {
  const whitelisted = await unoWithAdmin.whitelist.all();

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

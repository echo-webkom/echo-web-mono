import { LuX as X } from "react-icons/lu";

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
import { getAccessRequests } from "@/data/access-requests/queries";
import { DeleteAccessRequestButton } from "./delete-access-request-button";
import { GrantAccessButton } from "./grant-access-button";

export const AccessRequestTable = async () => {
  const accessRequests = await getAccessRequests();

  if (accessRequests.length === 0) {
    return (
      <div>
        <Heading level={2} className="mb-4">
          Tilgangsforespørsler
        </Heading>
        <Text>Ingen tilgangsforespørsler</Text>
      </div>
    );
  }

  return (
    <div>
      <Heading level={2} className="mb-4">
        Tilgangsforespørsler
      </Heading>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>E-post</TableHead>
            <TableHead>Begrunnelse</TableHead>
            <TableHead>Gjør endringer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accessRequests.map((accessRequest) => {
            return (
              <TableRow key={accessRequest.email} className="group">
                <TableCell>{accessRequest.email}</TableCell>
                <TableCell>{accessRequest.reason}</TableCell>
                <TableCell className="flex flex-col items-center gap-2 md:flex-row">
                  <GrantAccessButton accessRequestId={accessRequest.id}>
                    Gi tilgang
                  </GrantAccessButton>
                  <DeleteAccessRequestButton accessRequestId={accessRequest.id}>
                    <X />
                  </DeleteAccessRequestButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

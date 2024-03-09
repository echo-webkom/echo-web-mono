import { RxDotsHorizontal as Dots } from "react-icons/rx";

import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createWebkomPage } from "@/lib/factories/page";
import { MembersModal } from "./members-modal";

export const dynamic = "force-dynamic";

export default createWebkomPage(async () => {
  const groups = await db.query.groups.findMany({
    with: {
      members: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return (
    <Container>
      <Heading>Grupper</Heading>

      <div className="flex flex-col gap-2 py-4">
        <p className="font-semibold">Oversikt over alle grupper og medlemmer.</p>

        <p>
          Denne siden kan brukes til debugging om noen sier at de ikke er medlem av en gruppe. Man
          også bruke denne siden til å debugge {"id"} på en gruppe. For at en undergruppe skal kunne
          se de som er påmeldt på arrangmentet sitt, så må {"id"} i databasen matche {"slug"} i
          Sanity på undergruppen.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>id</TableHead>
            <TableHead>{/* Actions */}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => {
            return (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.id}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Dots className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Gjør endringer</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <MembersModal
                        group={group}
                        users={group.members.map((m) => ({
                          id: m.user.id,
                          name: m.user.name ?? m.user.id,
                        }))}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
});

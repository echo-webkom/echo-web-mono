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
import { getAllUsers } from "@/data/users/queries";
import { ensureWebkom } from "@/lib/ensure";
import { UserForm } from "./user-form";

export const dynamic = "force-dynamic";

export type AllUsers = Awaited<ReturnType<typeof getAllUsers>>;

export default async function UsersOverview() {
  await ensureWebkom();

  const [users, groups] = await Promise.all([getAllUsers(), db.query.groups.findMany()]);

  return (
    <Container>
      <Heading className="mb-4">Brukere</Heading>

      <div className="flex flex-col gap-2 py-4">
        <p className="font-semibold">Oversikt over alle bukere.</p>

        <p>Totalt: {users.length}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>E-post</TableHead>
            <TableHead>{/* Actions */}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
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
                      <UserForm user={user} groups={groups} />
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
}

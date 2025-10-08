import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { RxDotsHorizontal as Dots } from "react-icons/rx";

import { type Group } from "@echo-webkom/db/schemas";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { type AllUsers } from "./page";
import { UserForm } from "./user-form";

type User = AllUsers[number];

type UserTableRowProps = {
  user: User;
  groups: Array<Group>;
};

export const UserTable = ({ user, groups }: UserTableRowProps) => {
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
          <DropdownMenuContent align="end" className="border bg-background p-2 font-semibold">
            <DropdownMenuLabel className="p-1">Gjør endringer</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <UserForm user={user} groups={groups} />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

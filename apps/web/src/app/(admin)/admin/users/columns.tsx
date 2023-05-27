"use client";

import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {type ColumnDef} from "@tanstack/react-table";

import {type User as DbUser, type StudentGroup} from "@echo-webkom/db/types";
import {userTypeToString} from "@echo-webkom/lib";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type User = {
  name: DbUser["name"];
  type: DbUser["type"];
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Navn",
  },
  {
    accessorKey: "studentGroups",
    header: "Studentgrupper",
    cell: ({row}) => {
      const groups = row.getValue<Array<StudentGroup>>("studentGroups");

      return (
        <div>{groups.length ? groups.map((group) => group.name).join(", ") : "Ingen grupper"}</div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({row}) => {
      const type = row.getValue<DbUser["type"]>("type");

      return <div>{userTypeToString[type]}</div>;
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Gjør endringer</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Dialog>
              <DialogTrigger>
                <DropdownMenuItem>Endre rolle</DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and
                    remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";

import { type User as DbUser, type Group } from "@echo-webkom/db";
import { groupToString, roleToString } from "@echo-webkom/lib";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Label } from "@radix-ui/react-label";

export type User = {
  name: DbUser["name"];
  role: DbUser["role"];
};

export const columns: Array<ColumnDef<User>> = [
  {
    accessorKey: "name",
    header: "Navn",
  },
  {
    accessorKey: "studentGroups",
    header: "Studentgrupper",
    cell: ({ row }) => {
      const groups = row.getValue<Array<Group>>("studentGroups");

      return (
        <div>
          {groups.length ? groups.map((group) => groupToString[group]).join(", ") : "Ingen grupper"}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Rolle",
    cell: ({ row }) => {
      const role = row.getValue<DbUser["role"]>("role");

      return <div>{roleToString[role]}</div>;
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
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Endre rolle
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Detaljer for person navn
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                  <div className="mb-2">
                    <Label>Navn</Label>
                    <p className="text-sm text-slate-500">NAVN</p>
                  </div>

                  <div className="mb-2">
                    <Label>E-post</Label>
                    <p className="text-sm text-slate-500">MAIL</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

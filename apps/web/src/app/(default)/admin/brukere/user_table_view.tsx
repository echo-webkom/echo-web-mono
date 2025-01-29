"use client";

import { useState } from "react";
import { RxDotsHorizontal as Dots } from "react-icons/rx";

import { type Group } from "@echo-webkom/db/schemas";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type AllUsers } from "./page";
import { UserForm } from "./user-form";

/**
 * Component used to display a table of users.
 * Created to be client sided.
 */
export const UserTableView = ({ users, groups }: { users: AllUsers; groups: Array<Group> }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search query
  const filteredUsers = (users ?? [])?.filter(
    (user) =>
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <Container className="flex justify-end">
      <Heading className="mb-4">Brukere</Heading>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2 py-4">
          <p className="font-semibold">Oversikt over alle bukere.</p>

          <p>Totalt: {filteredUsers.length}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Søk:</Label>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Søk..."
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>E-post</TableHead>
            <TableHead>Endre</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => {
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
};

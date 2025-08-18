"use client";

import { useEffect, useMemo, useState } from "react";

import { type Group } from "@echo-webkom/db/schemas";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type AllUsers } from "./page";
import { PaginationControls } from "./pagination/pagination-controls";
import { UserTable } from "./user-table";

/**
 * Component used to display a table of users.
 * Created to be client sided.
 */
export const UserTableView = ({ users, groups }: { users: AllUsers; groups: Array<Group> }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter users based on search query
  const filteredUsers = (users ?? [])?.filter(
    (user) =>
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, pageSize]);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const paginatedUsers = useMemo(
    () => filteredUsers.slice((page - 1) * pageSize, page * pageSize),
    [filteredUsers, page, pageSize],
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
          {paginatedUsers.map((user) => (
            <UserTable key={user.id} user={user} groups={groups} />
          ))}
        </TableBody>
      </Table>
      <PaginationControls
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </Container>
  );
};

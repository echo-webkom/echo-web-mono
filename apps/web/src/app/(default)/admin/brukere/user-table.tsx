"use client";

import { useMemo, useState } from "react";
import { RxArrowLeft, RxArrowRight } from "react-icons/rx";

import { type Group } from "@echo-webkom/db/schemas";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { HoldableButton } from "@/components/ui/holdable-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type AllUsers } from "./page";
import { UserTable } from "./user-table-row";

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

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  const handleNextPage = () => {
    if (page === totalPages) return;
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const handleHoldPreviousPage = () => {
    if (page === 1) return;
    setPage(1);
  };

  const handleHoldNextPage = () => {
    if (page === totalPages) return;
    setPage(totalPages);
  };

  if (page > totalPages) {
    setPage(totalPages);
  }

  const paginatedUsers = useMemo(
    () => filteredUsers.slice((page - 1) * pageSize, page * pageSize),
    [filteredUsers, page, pageSize],
  );

  return (
    <Container>
      <Heading className="mb-4">Brukere</Heading>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-2">
          <div className="mt-auto flex items-center gap-2">
            <HoldableButton
              variant="outline"
              size="icon"
              onClick={handlePreviousPage}
              disabled={page === 1}
              onHold={handleHoldPreviousPage}
            >
              <span className="sr-only">Tilbake</span>
              <RxArrowLeft className="h-4 w-4" />
            </HoldableButton>
            <span>
              {page} av {totalPages}
            </span>
            <HoldableButton
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              onHold={handleHoldNextPage}
              disabled={page === totalPages}
            >
              <span className="sr-only">Neste</span>
              <RxArrowRight className="h-4 w-4" />
            </HoldableButton>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex max-w-18.75 flex-col gap-2">
              <Label>Antall:</Label>
              <Input
                type="number"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setPage(1);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Søk:</Label>
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Søk..."
              />
            </div>
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

        <span className="font-medium">Totalt: {filteredUsers.length} brukere</span>
      </div>
    </Container>
  );
};

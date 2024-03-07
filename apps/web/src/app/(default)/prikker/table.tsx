"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";

import { Heading } from "@/components/typography/heading";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserWithStrikes = {
  id: string;
  name: string | null;
  isBanned: boolean;
  strikes: number;
};

export default function StrikesTable({
  usersWithStrikes,
}: {
  usersWithStrikes: Array<UserWithStrikes>;
}) {
  const [search, setSearch] = useState("");

  const filtered = usersWithStrikes.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="flex justify-between">
        <Heading>Prikker</Heading>
        <div className="max-w-60">
          <StrikesTableInput search={search} setSearch={setSearch} />
        </div>
      </div>
      <div className="flex flex-col gap-2 py-4">
        <p className="font-semibold">Oversikt over alle brukere og deres prikker.</p>
        <p>Trykk på navnet for mer detaljer.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Navn</TableHead>
            <TableHead scope="col">Antall gyldige prikker</TableHead>
            <TableHead scope="col"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <Link href={`/prikker/${user.id}`}>{user.name ?? user.id}</Link>
                </TableCell>
                <TableCell>{user.strikes}</TableCell>
                <TableCell className="font-bold text-destructive">
                  {user.isBanned ? "UTESTENGT" : ""}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

function StrikesTableInput({
  search,
  setSearch,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  return (
    <>
      <Input
        value={search}
        maxLength={50}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        type="text"
        placeholder="Søk etter navn..."
        className=" bg-transparent pr-6"
      />
    </>
  );
}

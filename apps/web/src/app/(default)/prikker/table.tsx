"use client";

import { useState } from "react";
import Link from "next/link";

import { Heading } from "@/components/typography/heading";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [showBanned, setShowBanned] = useState(false);

  const filtered = usersWithStrikes
    .filter((user) => user.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((user) => (showBanned ? user.isBanned : true));

  return (
    <>
      <Heading>Prikker</Heading>
      <div className="justify-between lg:flex">
        <div className="flex flex-col gap-2 py-4">
          <p className="font-semibold">Oversikt over alle brukere og deres prikker.</p>
          <p>Trykk på navnet for mer detaljer.</p>
        </div>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center lg:justify-end">
            <Label htmlFor="banned" className="mr-2 cursor-pointer">
              Vis kun utestengte
            </Label>
            <Checkbox
              id="banned"
              checked={showBanned}
              onCheckedChange={() => setShowBanned(!showBanned)}
            />
          </div>
          <Input
            value={search}
            maxLength={50}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            type="text"
            placeholder="Søk etter navn..."
            className="max-w-60 bg-transparent"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Navn</TableHead>
            <TableHead scope="col">Antall gyldige prikker</TableHead>
            <TableHead scope="col">{/* isBanned */}</TableHead>
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
                <TableCell className="text-destructive">
                  {user.isBanned ? "Utestengt" : ""}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

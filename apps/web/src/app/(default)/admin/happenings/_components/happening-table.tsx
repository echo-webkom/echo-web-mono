"use client";

import { useState } from "react";
import { RxArrowLeft, RxArrowRight } from "react-icons/rx";

import { Button } from "@/components/ui/button";
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
import { type getFullHappenings } from "@/data/happenings/queries";

type HappeningTableProps = {
  happenings: Awaited<ReturnType<typeof getFullHappenings>>;
};

export const HappeningTable = ({ happenings }: HappeningTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [numberOfHappenings, setNumberOfHappenings] = useState(10);

  const happeningsToShow = happenings.filter((happening) => {
    const isMatchingTitle = happening.title.toLowerCase().includes(searchTerm.toLowerCase());
    const isMatchingSlug = happening.slug.toLowerCase().includes(searchTerm.toLowerCase());

    return isMatchingTitle || isMatchingSlug;
  });

  const totalPages = Math.ceil(happeningsToShow.length / numberOfHappenings) || 1;

  const handleNextPage = () => {
    if (page === totalPages) return;
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const paginatedHappenings = happeningsToShow.slice(
    (page - 1) * numberOfHappenings,
    page * numberOfHappenings,
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        <div className="mt-auto flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousPage}>
            <span className="sr-only">Tilbake</span>
            <RxArrowLeft className="h-4 w-4" />
          </Button>
          <span>
            {page} av {totalPages}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextPage}>
            <span className="sr-only">Oppdater</span>
            <RxArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex max-w-[75px] flex-col gap-2">
            <Label>Antall:</Label>
            <Input
              type="number"
              value={numberOfHappenings}
              onChange={(e) => setNumberOfHappenings(parseInt(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Søk:</Label>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Søk..."
            />
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tittel</TableHead>
            <TableHead>Slug</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedHappenings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>
                <p>Fant ingen arrangementer som matcher søket ditt.</p>
              </TableCell>
            </TableRow>
          ) : (
            paginatedHappenings.map((happening) => {
              return (
                <TableRow key={happening.id}>
                  <TableCell>{happening.title}</TableCell>
                  <TableCell>{happening.slug}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

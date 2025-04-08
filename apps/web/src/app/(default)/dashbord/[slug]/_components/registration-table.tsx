"use client";

import { useState } from "react";

import { type Group, type Question } from "@echo-webkom/db/schemas";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { filterRegistrations } from "../_lib/filter-registrations";
import { type RegistrationWithUser } from "../_lib/types";
import { useRegistrationFilter } from "../_lib/use-registration-filter";
import { RegistrationRow } from "./registration-row";
import { GroupFilter, SearchFilter, StatusFilter, YearFilter } from "./registration-table-filters";

type RegistrationTableProps = {
  registrations: Array<RegistrationWithUser>;
  studentGroups: Array<Group>;
  slug: string;
  questions: Array<Question>;
  isBedpres: boolean;
  happeningDate: Date | null;
};

export const RegistrationTable = ({
  registrations,
  studentGroups,
  isBedpres,
  happeningDate,
}: RegistrationTableProps) => {
  const [showIndex, setShowIndex] = useState(false);
  const { filters, resetFilters, setSearchTerm, setYearFilter, setStatusFilter, setGroupFilter } =
    useRegistrationFilter();

  const filteredRegistrations = filterRegistrations(registrations, studentGroups, filters);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 pb-2 pt-2 md:flex-row md:pb-4">
        <SearchFilter searchTerm={filters.searchTerm} setSearchTerm={setSearchTerm} />
        <YearFilter yearFilter={filters.yearFilter} setYearFilter={setYearFilter} />
        <StatusFilter statusFilter={filters.statusFilter} setStatusFilter={setStatusFilter} />
        <GroupFilter
          studentGroups={studentGroups}
          groupFilter={filters.groupFilter}
          setGroupFilter={setGroupFilter}
        />
        <div className="mt-auto w-full max-w-fit">
          <Button onClick={resetFilters}>Nullstill filter</Button>
        </div>
      </div>

      <div>
        <div className="flex flex-row justify-between py-2">
          <p className="text-muted-foreground">Antall resultater: {filteredRegistrations.length}</p>

          <div className="flex gap-2">
            <Label htmlFor="show-index">Vis nummer</Label>
            <Checkbox
              id="show-index"
              name="show-index"
              checked={showIndex}
              onCheckedChange={(e) => setShowIndex(e === true)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {showIndex && (
                <TableHead scope="col" className="w-12">
                  #
                </TableHead>
              )}
              <TableHead scope="col" className="w-12">
                Info
              </TableHead>
              <TableHead scope="col">Navn</TableHead>
              <TableHead scope="col">Status</TableHead>
              <TableHead scope="col" className="w-16">
                Mer
              </TableHead>
              <TableHead scope="col" className="w-12">
                {/* Empty */}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.length === 0 && (
              <TableRow>
                <td colSpan={showIndex ? 6 : 5}>
                  <p className="py-6 text-center text-xl font-medium text-muted-foreground">
                    Ingen resultater
                  </p>
                </td>
              </TableRow>
            )}
            {filteredRegistrations.map((registration, i) => (
              <RegistrationRow
                key={registration.user.id}
                index={i}
                registration={registration}
                showIndex={showIndex}
                isBedpres={isBedpres}
                happeningDate={happeningDate}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

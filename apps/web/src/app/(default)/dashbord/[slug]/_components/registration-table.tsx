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
import { RegistrationList } from "./registration-list";
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
  slug,
}: RegistrationTableProps) => {
  const [showIndex, setShowIndex] = useState(false);
  const { filters, resetFilters, setSearchTerm, setYearFilter, setStatusFilter, setGroupFilter } =
    useRegistrationFilter();

  const filteredRegistrations = filterRegistrations(registrations, studentGroups, filters);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 pt-2 pb-2 md:flex-row md:pb-4">
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

        <RegistrationList
          registrations={registrations}
          studentGroups={studentGroups}
          slug={slug}
          isBedpres={isBedpres}
          happeningDate={happeningDate}
        />
      </div>
    </div>
  );
};

"use client";

import { useMemo, useState } from "react";

import { type Group, type Question } from "@echo-webkom/db/schemas";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { filterRegistrations } from "../_lib/filter-registrations";
import { getColumns } from "../_lib/get-columns";
import { type RegistrationWithUser } from "../_lib/types";
import { useRegistrationFilter } from "../_lib/use-registration-filter";
import { DownloadCsvButton } from "./download-csv-button";
import { RandomPersonButton } from "./random-person-button";
import { RegistrationRow } from "./registration-row";
import { RegistrationTableContext } from "./registration-table-context";
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
  slug,
  questions,
  isBedpres,
  happeningDate,
}: RegistrationTableProps) => {
  const headers = useMemo(() => getColumns(questions), [questions]);
  const [selectedHeaders, setSelectedHeaders] = useState<Array<string>>(headers);
  const [showIndex, setShowIndex] = useState(false);
  const { filters, resetFilters, setSearchTerm, setYearFilter, setStatusFilter, setGroupFilter } =
    useRegistrationFilter();

  const filteredRegistrations = filterRegistrations(registrations, studentGroups, filters);

  return (
    <RegistrationTableContext.Provider value={{ headers, selectedHeaders, setSelectedHeaders }}>
      <div className="rounded-lg border p-4 shadow-md">
        <div className="overflow-y-auto">
          <div className="flex flex-col items-center gap-4 px-4 pb-2 pt-2 md:flex-row md:pb-4">
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

          <div className="mt-auto flex flex-col justify-between px-4 md:flex-row">
            <div className="mt-auto flex w-full flex-col items-center gap-2 md:w-auto md:flex-row">
              <RandomPersonButton
                registrations={registrations
                  .filter((r) => r.status === "registered")
                  .map((r) => r.user.name ?? r.user.email)}
              />
              <DownloadCsvButton slug={slug} />
              <RemoveAllRegistrationsButton slug={slug} />
            </div>
          </div>

          <div className="flex flex-row justify-between px-4 py-2">
            <p>Antall resultater: {filteredRegistrations.length}</p>

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
                <TableHead scope="col">Grunn</TableHead>
                <TableHead scope="col">Mer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
    </RegistrationTableContext.Provider>
  );
};

"use client";

import React, { useState } from "react";

import {
  type Group,
  type Registration,
  type RegistrationStatus,
  type User,
} from "@echo-webkom/db/schemas";
import { registrationStatusToString } from "@echo-webkom/lib";

import { EditRegistrationButton } from "@/components/edit-registration-button";
import { cn } from "@/utils/cn";
import { DownloadCsvButton } from "./download-csv-button";
import { HoverProfileView } from "./hover-profile-view";
import { RandomPersonButton } from "./random-person-button";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export type RegistrationWithUser = Omit<Registration, "userId"> & {
  user: User & {
    memberships: Array<{
      group: Group | null;
    }>;
  };
};

export function RegistrationTable({
  registrations,
  studentGroups,
  happeningId,
}: {
  registrations: Array<RegistrationWithUser>;
  studentGroups: Array<Group>;
  happeningId: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [showIndex, setShowIndex] = useState(false);

  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearchTerm =
      (registration.user.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registration.user.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registration.user.alternativeEmail ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYearFilter =
      yearFilter === "" || registration.user.year?.toString() === yearFilter;

    const matchesStatusFilter =
      statusFilter === "" ||
      (statusFilter === "påmeldt" && registration.status === "registered") ||
      (statusFilter === "venteliste" && registration.status === "waiting") ||
      (statusFilter === "avmeldt" && registration.status === "unregistered") ||
      (statusFilter === "fjernet" && registration.status === "removed") ||
      (statusFilter === "under behandling" && registration.status === "pending");

    const matchesGroupFilter =
      groupFilter === "" ||
      studentGroups.some((group) => {
        return (
          groupFilter.toLowerCase() === group.name.toLowerCase() &&
          registration.user.memberships.some(
            (membership) => membership.group?.name.toLowerCase() === group.name.toLowerCase(),
          )
        );
      });
    return matchesSearchTerm && matchesYearFilter && matchesStatusFilter && matchesGroupFilter;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setYearFilter("");
    setStatusFilter("");
    setGroupFilter("");
  };

  return (
    <div className="h-full w-full overflow-y-auto rounded-lg border shadow-md">
      <div className="overflow-y-auto">
        <div className="flex flex-col items-center gap-4 p-4 md:flex-row">
          <div className="flex w-full flex-col gap-1">
            <Label htmlFor="search">Søk:</Label>
            <Input
              id="search"
              type="text"
              placeholder="Søk etter navn eller e-post"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col gap-1">
            <Label htmlFor="year">Trinn:</Label>
            <Select id="year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="">Alle</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
          </div>
          <div className="flex w-full flex-col gap-1">
            <Label htmlFor="status">Status:</Label>
            <Select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Alle</option>
              <option value="påmeldt">Bare påmeldt</option>
              <option value="venteliste">Bare venteliste</option>
              <option value="avmeldt">Bare avmeldt</option>
              <option value="fjernet">Bare fjernet</option>
            </Select>
          </div>

          <div className="flex w-full flex-col gap-1">
            <Label htmlFor="group">Undergruppe:</Label>
            <Select id="group" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
              <option value="">Alle</option>
              {studentGroups.map((group) => (
                <option key={group.id}>{group.name}</option>
              ))}
            </Select>
          </div>

          <div className="mt-auto w-full max-w-fit">
            <Button onClick={resetFilters}>Nullstill filter</Button>
          </div>
        </div>
        <div className="flex flex-row justify-between px-4 py-2">
          <div className="mt-auto w-full space-x-2">
            <RandomPersonButton registrations={registrations} />
            <DownloadCsvButton id={happeningId} />
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
              <TableHead scope="col" className="sm:w-48">
                Handling
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.map((registration, i) => (
              <RegistrationRow
                key={registration.user.id}
                registration={registration}
                index={i}
                showIndex={showIndex}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const statusColor = {
  registered: "text-green-600",
  waiting: "text-yellow-600",
  unregistered: "text-red-600",
  removed: "text-red-600",
  pending: "text-blue-600",
} satisfies Record<RegistrationStatus, string>;

const RegistrationRow = ({
  registration,
  index,
  showIndex,
}: {
  registration: RegistrationWithUser;
  index: number;
  showIndex: boolean;
}) => {
  const id = registration.happeningId;
  const reason = registration.unregisterReason
    ? registration.unregisterReason.length > 200
      ? " " + registration.unregisterReason.substring(0, 200) + "..."
      : " " + registration.unregisterReason
    : "";
  const group = registration.user.memberships
    .map((membership) => " " + membership.group?.name)
    .join(",");

  return (
    <TableRow key={registration.user.id}>
      {showIndex && <TableCell>{index + 1}</TableCell>}
      <TableCell>
        <HoverProfileView
          user={registration.user}
          group={group}
          changedAt={registration.registrationChangedAt}
        />
      </TableCell>
      <TableCell>{registration.user.name}</TableCell>
      <TableCell className={cn(statusColor[registration.status])}>
        {registrationStatusToString[registration.status]}
      </TableCell>
      <TableCell>{reason}</TableCell>
      <TableCell>
        <EditRegistrationButton id={id} registration={registration} />
      </TableCell>
    </TableRow>
  );
};

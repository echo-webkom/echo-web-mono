"use client";

import React, { useState } from "react";
import Link from "next/link";
import Confetti from "react-confetti";

import {
  type Group,
  type Registration,
  type RegistrationStatus,
  type User,
} from "@echo-webkom/db/schemas";
import { registrationStatusToString } from "@echo-webkom/lib";

import { EditRegistrationButton } from "@/components/edit-registration-button";
import { cn } from "@/utils/cn";
import { mailTo } from "@/utils/prefixes";
import { RandomPersonButton } from "./random-person-button";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";

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
}: {
  registrations: Array<RegistrationWithUser>;
  studentGroups: Array<Group>;
}) {
  const [showConfetti, setShowConfetti] = useState(false);
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
    <div className="overflow-x-auto rounded-lg border shadow-md">
      <div className="overflow-x-auto">
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
          <div className="mt-auto w-full">
            <RandomPersonButton registrations={registrations} setShowConfetti={setShowConfetti} />
            {showConfetti && (
              <Confetti
                className="fixed left-0 top-0"
                width={window.window.innerWidth}
                height={window.window.innerHeight}
              />
            )}
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

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-sm text-gray-500">
            <thead className="bg-table-header-background text-xs uppercase text-table-header-foreground">
              <tr>
                {showIndex && (
                  <th scope="col" className="px-6 py-4 text-left">
                    Index
                  </th>
                )}
                <th scope="col" className="px-6 py-4 text-left">
                  Navn
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  E-post
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  Grunn
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  Årstrinn
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  Medlem av
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  Handling
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((registration, i) => (
                <RegistrationRow
                  key={registration.user.id}
                  registration={registration}
                  index={i}
                  showIndex={showIndex}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const RegistrationRow = ({
  registration,
  index,
  showIndex,
}: {
  registration: RegistrationWithUser;
  index: number;
  showIndex: boolean;
}) => {
  const email = registration.user.alternativeEmail ?? registration.user.email ?? "";
  const id = registration.happeningId;
  const statusClass = getStatusClassColor(registration.status);

  return (
    <tr
      key={registration.user.id}
      className={cn("border-b bg-table-background text-table-foreground", {
        "bg-table-background-alt": index % 2 === 0,
      })}
    >
      {showIndex && <td className="px-6 py-4">{index + 1}</td>}
      <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium">
        {registration.user.name}
      </th>
      <td className="px-6 py-4">
        <Link className="hover:underline" href={mailTo(email)}>
          {email}
        </Link>
      </td>
      <td className={`px-6 py-4`}>
        <span className={`${statusClass}`}>{registrationStatusToString[registration.status]}</span>
      </td>
      <td className="px-6 py-4">{registration.unregisterReason}</td>
      <td className="px-6 py-4">{registration.user.year}</td>
      <td className="px-6 py-4">
        {registration.user.memberships.map((membership) => membership.group?.name).join(", ")}
        {registration.user.memberships.length === 0 && "Ingen"}
      </td>
      <td className="px-6 py-4">
        <EditRegistrationButton id={id} registration={registration} />
      </td>
    </tr>
  );
};

function getStatusClassColor(status: RegistrationStatus): string {
  switch (status) {
    case "registered":
      return "text-green-600";
    case "waiting":
      return "text-yellow-600";
    case "unregistered":
      return "text-red-600";
    case "removed":
      return "text-red-600";
    case "pending":
      return "text-blue-600";
    default:
      return "";
  }
}

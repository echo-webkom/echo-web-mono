"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Label } from "@radix-ui/react-label";

import {
  RegistrationStatus,
  type Group,
  type Registration,
  type User,
} from "@echo-webkom/db/schemas";
import { registrationStatusToString } from "@echo-webkom/lib";

import { EditRegistrationButton } from "@/components/edit-registration-button";
import { cn } from "@/utils/cn";
import { Button } from "./ui/button";
import { RandomPersonButton } from "./random-person-button";
import Confetti from 'react-confetti';

export type RegistrationWithUser = Omit<Registration, "userId"> & {
  user: User & {
    memberships: Array<{
      group: Group | null;
    }>;
  };
};

export function RegistrationTable({
  registrations,
}: {
  registrations: Array<RegistrationWithUser>;
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [showIndex, setShowIndex] = useState(false);

  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearchTerm =
      registration.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.user.alternativeEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYearFilter =
      yearFilter === "" || registration.user.year?.toString() === yearFilter;

    const matchesStatusFilter =
      statusFilter === "" ||
      (statusFilter === "påmeldt" && registration.status === "registered") ||
      (statusFilter === "venteliste" && registration.status === "waiting") ||
      (statusFilter === "avmeldt" && registration.status === "unregistered") ||
      (statusFilter === "fjernet" && registration.status === "removed");

    const matchesGroupFilter =
      groupFilter === "" ||
      (groupFilter === "webkom" &&
        registration.user.memberships.some(
          (membership) => membership.group?.name === "Webkom",
          )) ||
      (groupFilter === "bedkom" &&
        registration.user.memberships.some(
          (membership) => membership.group?.name === "Bedkom",
          )) ||
      (groupFilter === "hyggkom" &&
        registration.user.memberships.some(
          (membership) => membership.group?.name === "Hyggkom",
          )) ||
      (groupFilter === "gnist" &&
        registration.user.memberships.some(
          (membership) => membership.group?.name === "Gnist",
          )) ||
      (groupFilter === "programmerbar" &&
        registration.user.memberships.some(
          (membership) => membership.group?.name === "Programmerbar",
        )) ||
      (groupFilter === "hovedstyret" &&
        registration.user.memberships.some(
          (membership) => membership.group?.name === "Hovedstyret",
        )) ||
      (groupFilter === "makerspace" &&
        registration.user.memberships.some(
          (membership) => membership.group?.name === "Makerspace",
        )) ||
      (groupFilter === "tilde" &&
        registration.user.memberships.some(
          (membership) => membership.group?.name === "Tilde",
          )) ||
      (groupFilter === "esc" &&
        registration.user.memberships.some(
          (membership) => membership.group?.name === "Esc"));

    return matchesSearchTerm && matchesYearFilter && matchesStatusFilter && matchesGroupFilter;
  });


  const resetFilters = () => {
    setSearchTerm("");
    setYearFilter("");
    setStatusFilter("");
    setGroupFilter("");
  };

  return (
    <div className="relative overflow-x-auto border shadow-md sm:rounded-lg">

      <div className="relative overflow-x-auto pt-2">
        <div className="flex w-full gap-5 p-4 pt-0">
          <div className="flex flex-col">
            <Label className="px-2">Søk:</Label>
            <input
              className="sm:rounded-lg"
              type="text"
              placeholder="Søk etter navn eller e-post"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Label className="px-2">Trinn:</Label>
            <select
              className="sm:rounded-lg"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="">Alle</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="flex flex-col">
            <Label className="px-2">Status:</Label>
            <select
              className="sm:rounded-lg"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Alle</option>
              <option value="påmeldt">Bare påmeldt</option>
              <option value="venteliste">Bare venteliste</option>
              <option value="avmeldt">Bare avmeldt</option>
              <option value="fjernet">Bare fjernet</option>
            </select>
          </div>

          <div className="flex flex-col">
            <Label className="px-2">Undergruppe:</Label>

            <select
              className="sm:rounded-lg"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            >
              <option value="">Alle</option>
              <option value="gnist">Gnist</option>
              <option value="programmerbar">Programmerbar</option>
              <option value="bedkom">Bedkom</option>
              <option value="hyggkom">Hyggkom</option>
              <option value="webkom">Webkom</option>
              <option value="hovedstyret">Hovedstyret</option>
              <option value="makerspace">Makerspace</option>
              <option value="tilde">Tilde</option>
              <option value="esc">Esc</option>
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <Button onClick={resetFilters}>Nullstill filter</Button>
          </div>
          <div className="flex flex-col justify-end">
          {showConfetti && <Confetti width={window.window.innerWidth} height={window.window.innerHeight} />}
      <RandomPersonButton registrations={registrations} setShowConfetti={setShowConfetti}></RandomPersonButton>
      </div>
        </div>
        <div className="flex flex-row justify-between px-5 pb-2">
          <Label>Antall resultater: {filteredRegistrations.length}</Label>
          <div className="flex gap-2">
            <Label>Vis nummer</Label>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-primary"
              checked={showIndex}
              onChange={(e) => setShowIndex(e.target.checked)}
            />
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full table-auto text-left text-sm text-gray-500">
            <thead className="bg-gray-200 text-xs uppercase">
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
                <RegistrationRow key={registration.user.id} registration={registration} index={i} showIndex={showIndex}/>
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
  const slug = registration.happeningSlug;
  const statusClass = getStatusClassColor(registration.status);

  return (
    <tr
      key={registration.user.id}
      className={cn("border-b", {
        "bg-white": index % 2 === 0,
      })}
    >
      {showIndex && (
        <td className="px-6 py-4">{index + 1}</td>
      )}
      <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium">
        {registration.user.name}
      </th>
      <td className="px-6 py-4">
        <Link className="hover:underline" href={"mailto:" + email}>
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
        <EditRegistrationButton slug={slug} registration={registration} />
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
    default:
      return "";
  }
}


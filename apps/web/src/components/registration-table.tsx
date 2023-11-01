"use client";

import Link from "next/link";

import {
  RegistrationStatus,
  type Group,
  type Registration,
  type User,
} from "@echo-webkom/db/schemas";
import { registrationStatusToString } from "@echo-webkom/lib";

import { EditRegistrationButton } from "@/components/edit-registration-button";
import { cn } from "@/utils/cn";

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
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full table-auto text-left text-sm text-gray-500">
        <thead className="bg-gray-200 text-xs uppercase">
          <tr>
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
              Trinn
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              Undergrupper
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              Handling
            </th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration, i) => (
            <RegistrationRow key={registration.user.id} registration={registration} index={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const RegistrationRow = ({
  registration,
  index,
}: {
  registration: RegistrationWithUser;
  index: number;
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

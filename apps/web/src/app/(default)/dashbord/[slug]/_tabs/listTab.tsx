"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type getFullHappening } from "@/data/happenings/queries";
import { getRegistrationStatus } from "@/lib/registrations";
import { cn } from "@/utils/cn";
import { filterRegistrations } from "../_lib/filter-registrations";
import { statusColor } from "../_lib/status-color";
import { type RegistrationWithUser } from "../_lib/types";
import { useRegistrationFilter } from "../_lib/use-registration-filter";
import { SearchFilter } from "./../_components/registration-table-filters";

type ListTabProps = {
  happening: Exclude<Awaited<ReturnType<typeof getFullHappening>>, undefined>;
  registrations: Array<RegistrationWithUser>;
};

export const ListTab = ({ happening, registrations }: ListTabProps) => {
  const [crossedIds, setCrossedIds] = useState<Set<string>>(new Set());

  const { filters, setSearchTerm } = useRegistrationFilter();

  const filteredRegistrations = filterRegistrations(registrations, [], filters);

  if (registrations.length < 1) {
    return (
      <div className="mx-auto mt-8 flex w-fit flex-col gap-8 p-5">
        <h3 className="text-center text-xl font-medium">Ingen registrerte!</h3>
        <Image
          className="rounded-lg"
          src="/gif/empty-shelves-john-travolta.gif"
          alt="Travolta looking around in an empty store"
          width={600}
          height={600}
        />
      </div>
    );
  }

  const handleClick = (id: string) => {
    setCrossedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchFilter searchTerm={filters.searchTerm} setSearchTerm={setSearchTerm} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Navn</TableHead>
            <TableHead scope="col">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRegistrations.map((registration) => {
            const crossed = crossedIds.has(registration.user.id);
            return (
              <TableRow
                key={registration.user.id}
                onClick={() => handleClick(registration.user.id)}
                className={cn("cursor-pointer", crossed && "opacity-50")}
              >
                <TableCell className={cn("cursor-pointer", crossed && "line-through")}>
                  {registration.user.name}
                </TableCell>
                <TableCell className={cn(statusColor[registration.status])}>
                  {getRegistrationStatus(registration, happening.date)}
                </TableCell>
                <TableCell>
                  {registration.answers.map((answer) => (
                    <div key={answer.id}>{answer.text}</div>
                  ))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

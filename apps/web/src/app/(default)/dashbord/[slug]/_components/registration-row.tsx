"use client";

import Link from "next/link";
import { RxDotsHorizontal as Dots } from "react-icons/rx";

import { EditRegistrationForm } from "@/components/edit-registration-button";
import { HoverProfileView } from "@/components/hover-profile-view";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { getRegistrationStatus } from "@/lib/registrations";
import { cn } from "@/utils/cn";
import { statusColor } from "../_lib/status-color";
import { type RegistrationWithUser } from "../_lib/types";

type RegistrationRowProps = {
  registration: RegistrationWithUser;
  index: number;
  showIndex: boolean;
  isBedpres: boolean;
  happeningDate: Date | null;
};

export const RegistrationRow = ({
  registration,
  index,
  showIndex,
  isBedpres,
  happeningDate,
}: RegistrationRowProps) => {
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
        <HoverProfileView user={registration.user} group={group} />
      </TableCell>
      <TableCell>{registration.user.name}</TableCell>
      <TableCell className={cn(statusColor[registration.status])}>
        {getRegistrationStatus(registration, happeningDate)}
      </TableCell>
      <TableCell>{reason}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Dots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Handlinger</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <EditRegistrationForm id={registration.happeningId} registration={registration} />
            {isBedpres && (
              <>
                <DropdownMenuSeparator />

                <Link
                  target="_blank"
                  className="hover:cursor-default"
                  href={`/prikker/${registration.user.id}`}
                >
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                    className="pr-10"
                  >
                    Prikker
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
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
  const [showMore, setShowMore] = useState(false);
  const group = registration.user.memberships
    .map((membership) => " " + membership.group?.name)
    .join(",");

  return (
    <>
      <TableRow key={registration.user.id}>
        {showIndex && <TableCell>{index + 1}</TableCell>}
        <TableCell>
          <HoverProfileView user={registration.user} group={group} />
        </TableCell>
        <TableCell>{registration.user.name}</TableCell>
        <TableCell className={cn(statusColor[registration.status])}>
          {getRegistrationStatus(registration, happeningDate)}
        </TableCell>
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
        <TableCell>
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center justify-center p-0"
          >
            <ChevronDown
              className={cn("h-4 w-4", {
                "rotate-180 transform": showMore,
              })}
            />
          </button>
        </TableCell>
      </TableRow>
      {showMore && (
        <TableRow className="col-span-6 bg-muted p-4">
          <TableCell colSpan={showIndex ? 6 : 5}>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Epost:</span>{" "}
              {registration.user.alternativeEmail ?? registration.user.email}
            </p>
            {group.length > 1 && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Grupper:</span> {group}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Årstrinn:</span> {registration.user.year}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Linje:</span>{" "}
              {registration.user.degreeId?.toUpperCase() ?? "N/A"}
            </p>
            {(registration.answers?.length ?? 0) > 0 && (
              <>
                <hr className="my-4" />

                <p>
                  <span className="font-semibold text-muted-foreground">Spørsmål:</span>
                  {registration.answers?.map((answer) => {
                    const ans = Array.isArray(answer.answer?.answer)
                      ? answer.answer.answer.join(", ")
                      : answer.answer?.answer;

                    return (
                      <span key={answer.questionId}>
                        <br />
                        <span className="font-semibold text-muted-foreground">
                          {answer.question.title}:
                        </span>{" "}
                        {ans}
                      </span>
                    );
                  })}
                </p>
              </>
            )}
            {registration.unregisterReason && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Avregistreringsgrunn:</span>{" "}
                {registration.unregisterReason}
              </p>
            )}
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

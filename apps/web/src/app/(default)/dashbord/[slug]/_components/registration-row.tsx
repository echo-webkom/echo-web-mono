"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { RxDotsHorizontal as Dots, RxExclamationTriangle as Warning } from "react-icons/rx";

import { type SpotRange } from "@/api/uno/client";
import { EditRegistrationForm } from "@/components/edit-registration-button";
import { HoverProfileView } from "@/components/hover-profile-view";
import { Callout } from "@/components/typography/callout";
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
  spotRanges: Array<SpotRange>;
};

export const RegistrationRow = ({
  registration,
  index,
  showIndex,
  isBedpres,
  happeningDate,
  spotRanges,
}: RegistrationRowProps) => {
  const [showMore, setShowMore] = useState(false);
  const group = registration.user.memberships
    .map((membership) => " " + membership.group?.name)
    .join(",");

  const userYear = registration.user.year;
  const outsideAllRanges =
    registration.status === "registered" &&
    spotRanges.length > 0 &&
    (userYear === null ||
      !spotRanges.some((sr) => userYear >= sr.minYear && userYear <= sr.maxYear));

  return (
    <>
      <TableRow key={registration.user.id}>
        {showIndex && <TableCell>{index + 1}</TableCell>}
        <TableCell>
          <HoverProfileView user={registration.user} group={group} />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Link href={`/auth/user/${registration.user.id}`} className="hover:underline">
              {registration.user.name}
            </Link>
            {outsideAllRanges && (
              <Warning
                className="text-warning-dark h-4 w-4 shrink-0"
                title="Brukeren passer ikke til noen spot ranges"
              />
            )}
          </div>
        </TableCell>
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
        <TableRow className="bg-muted col-span-6 p-4">
          <TableCell colSpan={showIndex ? 6 : 5}>
            {outsideAllRanges && (
              <Callout type="warning" className="mb-4 text-sm">
                Brukeren sitt årstrinn ({userYear ?? "ukjent"}) passer ikke til noen av
                plassintervallene for dette arrangementet. Dette kan påvirke beregningen av ledige
                plasser.
              </Callout>
            )}
            <p className="text-muted-foreground text-sm">
              <span className="font-semibold">Epost:</span>{" "}
              {registration.user.alternativeEmail ?? registration.user.email}
            </p>
            <p className="text-muted-foreground text-sm">
              <span className="font-semibold">Registrert:</span>{" "}
              <span className="font-mono">
                {registration.createdAt.toLocaleString("no-NO", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
                .{registration.createdAt.getMilliseconds().toString().padStart(3, "0")}
              </span>
            </p>
            {registration.changedAt && (
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold">Status endret:</span>{" "}
                <span className="font-mono">
                  {registration.changedAt.toLocaleString("no-NO", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                  .{registration.changedAt.getMilliseconds().toString().padStart(3, "0")}
                </span>
                {registration.changedByUser && <span> av {registration.changedByUser.name}</span>}
              </p>
            )}
            {registration.prevStatus && (
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold">Forrige status:</span>{" "}
                {getRegistrationStatus(
                  { ...registration, status: registration.prevStatus, prevStatus: null },
                  happeningDate,
                )}
              </p>
            )}
            {group.length > 1 && (
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold">Grupper:</span> {group}
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              <span className="font-semibold">Årstrinn:</span> {registration.user.year}
            </p>
            <p className="text-muted-foreground text-sm">
              <span className="font-semibold">Linje:</span>{" "}
              {registration.user.degreeId?.toUpperCase() ?? "N/A"}
            </p>
            {(registration.answers?.length ?? 0) > 0 && (
              <>
                <hr className="my-4" />

                <p>
                  <span className="text-muted-foreground font-semibold">Spørsmål:</span>
                  {registration.answers?.map((answer) => {
                    const ans = Array.isArray(answer.answer?.answer)
                      ? answer.answer.answer.join(", ")
                      : typeof answer.answer === "string"
                        ? answer.answer
                        : null;

                    return (
                      <span key={answer.questionId}>
                        <br />
                        <span className="text-muted-foreground font-semibold">
                          {answer.question.title}:
                        </span>{" "}
                        <span className="text-muted-foreground">{ans}</span>
                      </span>
                    );
                  })}
                </p>
              </>
            )}
            {registration.unregisterReason && (
              <p className="text-muted-foreground text-sm">
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

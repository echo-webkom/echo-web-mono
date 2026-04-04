"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { type unoWithAdmin } from "@/api/server";
import { type CMSHappening } from "@/api/uno/client";

type HappeningDebugPanelProps = {
  event: CMSHappening;
  spotRanges: Awaited<ReturnType<typeof unoWithAdmin.happenings.spotRanges>>;
  registrations: Awaited<ReturnType<typeof unoWithAdmin.happenings.registrations>>;
  questionsCount: number;
  hostGroups: Array<string>;
  hideRegistrations: boolean;
  isRegistrationOpen: boolean;
  isNormalRegistrationOpen: boolean;
  isGroupRegistrationOpen: boolean;
  isClosed: boolean;
  registrationOpensIn24Hours: boolean;
};

type RowProps = {
  label: string;
  value: React.ReactNode;
};

const Row = ({ label, value }: RowProps) => (
  <div className="flex justify-between gap-4 py-1 text-xs">
    <span className="text-muted-foreground shrink-0 font-medium">{label}</span>
    <span className="font-mono">{value}</span>
  </div>
);

export function HappeningDebugPanel({
  event,
  spotRanges,
  registrations,
  questionsCount,
  hostGroups,
  hideRegistrations,
  isRegistrationOpen,
  isNormalRegistrationOpen,
  isGroupRegistrationOpen,
  isClosed,
  registrationOpensIn24Hours,
}: HappeningDebugPanelProps) {
  const [open, setOpen] = useState(false);

  const registeredCount = registrations.filter((r) => r.status === "registered").length;
  const waitlistCount = registrations.filter((r) => r.status === "waiting").length;
  const totalCapacity = spotRanges.reduce((acc, r) => acc + r.spots, 0);

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-red-700 dark:text-red-400"
      >
        <span>🛠 Debug</span>
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {open && (
        <div className="divide-y divide-red-100 border-t border-red-200 px-3 pb-3 dark:divide-red-900 dark:border-red-900">
          <div className="pt-2">
            <p className="mb-1 text-xs font-semibold tracking-wide text-red-600 uppercase dark:text-red-400">
              Happening
            </p>
            <Row label="ID" value={event._id} />
            <Row label="Slug" value={event.slug} />
            <Row label="Type" value={event.happeningType} />
            <Row
              label="Pris"
              value={
                event.cost !== null && event.cost !== undefined ? `${event.cost} kr` : "Gratis"
              }
            />
            <Row label="Ekstern lenke" value={event.externalLink ?? "—"} />
            <Row label="Spørsmål" value={questionsCount} />
          </div>

          <div className="pt-2">
            <p className="mb-1 text-xs font-semibold tracking-wide text-red-600 uppercase dark:text-red-400">
              Registrations
            </p>
            <Row label="Registered" value={`${registeredCount} / ${totalCapacity}`} />
            <Row label="Waitlist" value={waitlistCount} />
            <Row label="Total" value={registrations.length} />
          </div>

          <div className="pt-2">
            <p className="mb-1 text-xs font-semibold tracking-wide text-red-600 uppercase dark:text-red-400">
              Spot ranges
            </p>
            {spotRanges.length === 0 ? (
              <p className="text-muted-foreground text-xs">Ingen spot ranges</p>
            ) : (
              spotRanges.map((sr, i) => (
                <Row
                  key={i}
                  label={`Trinn ${sr.minYear}–${sr.maxYear}`}
                  value={`${sr.spots} plasser`}
                />
              ))
            )}
          </div>

          <div className="pt-2">
            <p className="mb-1 text-xs font-semibold tracking-wide text-red-600 uppercase dark:text-red-400">
              Datoer
            </p>
            <Row
              label="Reg. start"
              value={
                event.registrationStart
                  ? new Date(event.registrationStart).toLocaleString("no")
                  : "—"
              }
            />
            <Row
              label="Tidlig reg. start"
              value={
                event.registrationStartGroups
                  ? new Date(event.registrationStartGroups).toLocaleString("no")
                  : "—"
              }
            />
            <Row
              label="Reg. slutt"
              value={
                event.registrationEnd ? new Date(event.registrationEnd).toLocaleString("no") : "—"
              }
            />
          </div>

          {event.registrationGroups && event.registrationGroups.length > 0 && (
            <div className="pt-2">
              <p className="mb-1 text-xs font-semibold tracking-wide text-red-600 uppercase dark:text-red-400">
                Tidlig reg. grupper
              </p>
              {event.registrationGroups.map((g) => (
                <Row key={g} label={g} value="" />
              ))}
            </div>
          )}

          <div className="pt-2">
            <p className="mb-1 text-xs font-semibold tracking-wide text-red-600 uppercase dark:text-red-400">
              Påmeldingstilstand
            </p>
            <Row label="Åpen" value={isRegistrationOpen ? "Ja" : "Nei"} />
            <Row label="Normal åpen" value={isNormalRegistrationOpen ? "Ja" : "Nei"} />
            <Row label="Gruppe åpen" value={isGroupRegistrationOpen ? "Ja" : "Nei"} />
            <Row label="Stengt" value={isClosed ? "Ja" : "Nei"} />
            <Row label="Åpner innen 24t" value={registrationOpensIn24Hours ? "Ja" : "Nei"} />
            <Row label="Skjul påmeldinger" value={hideRegistrations ? "Ja" : "Nei"} />
          </div>

          <div className="pt-2">
            <p className="mb-1 text-xs font-semibold tracking-wide text-red-600 uppercase dark:text-red-400">
              Tilganger
            </p>
            <Row
              label="Arrangørgrupper"
              value={hostGroups.length > 0 ? hostGroups.join(", ") : "—"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

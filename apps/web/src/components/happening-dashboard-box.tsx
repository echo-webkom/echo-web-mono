"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import nb from "date-fns/locale/nb";

import { type Bedpres } from "@/sanity/bedpres";
import { type Event } from "@/sanity/event";
import { cn } from "@/utils/cn";
import { urlFor } from "@/utils/image-builder";
import { capitalize } from "@/utils/string";

type HappeningDashboardBoxProps =
  | {
    type: "EVENT";
    happenings: Array<Event>;
  }
  | {
    type: "BEDPRES";
    happenings: Array<Bedpres>;
  };

type HappeningType = HappeningDashboardBoxProps["type"];

const happeningTypeToString: Record<HappeningType, string> = {
  EVENT: "arrangementer",
  BEDPRES: "bedriftspresentasjoner",
};

export function HappeningDashboardBox({ type, happenings }: HappeningDashboardBoxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const firstResultRef = useRef<HTMLLIElement | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && firstResultRef.current) {
      const href = firstResultRef.current.querySelector('a')?.getAttribute('href');
      if (href) {
        window.location.href = href;
      }
    }
  };

  const filteredHappenings = happenings.filter((happening) => {
    const title = happening.title.toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h2 className="text-center text-xl font-semibold md:text-3xl">
        {capitalize(happeningTypeToString[type])}
      </h2>

      <hr className="my-3" />

      <input
        type="text"
        placeholder="Søk..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md mb-3"
        onKeyDown={handleKeyPress}
      />

      {filteredHappenings.length > 0 ? (
        <ul className="flex h-full flex-col divide-y">
          {filteredHappenings.map((happening, index) => (
            <li
              key={happening._id}
              className="py-3"
              ref={(el) => index === 0 && (firstResultRef.current = el)}
            >
              {type === "EVENT" && <EventPreview event={happening as Event} />}
              {type === "BEDPRES" && <BedpresPreview bedpres={happening as Bedpres} />}
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-3 py-5 text-center text-lg font-medium">
          <p>Ingen kommende {happeningTypeToString[type]}</p>
          {/* TODO: Add funny gif */}
        </div>
      )}
    </div>
  );
}

type EventPreviewProps = {
  event: Event;
};

export function EventPreview({ event }: EventPreviewProps) {
  return (
    <Link href={`/dashbord/${event.slug}`}>
      <div className={cn("flex h-full items-center gap-5 p-5", "hover:bg-muted")}>
        <div className="overflow-x-hidden">
          <h3 className="line-clamp-1 text-lg font-semibold md:text-2xl">{event.title}</h3>
          <ul className="text-sm md:text-base">
            <li>
              <span className="font-semibold">Gruppe:</span>{" "}
              {capitalize(event.organizers.map((o) => o.name).join(", "))}
            </li>
            {event.date && (
              <li>
                <span className="font-semibold">Dato:</span>{" "}
                {format(new Date(event.date), "d. MMMM yyyy", { locale: nb })}
              </li>
            )}
            <li>
              <span className="font-semibold">Påmelding:</span>{" "}
              {event.registrationStart
                ? format(new Date(event.registrationStart), "d. MMMM yyyy", {
                  locale: nb,
                })
                : "Påmelding åpner snart"}
            </li>
            <li>
              <span className="font-semibold">Frist for påmelding:</span>{" "}
              {event.registrationEnd
                ? format(new Date(event.registrationEnd), "d. MMMM yyyy", {
                  locale: nb,
                })
                : "Ikke bestemt"}
            </li>
            <li>
              <span className="font-semibold">Antall plasser:</span>{" "}
              {event.spotRanges?.length != null
                ? event.spotRanges.length
                : "Ikke bestemt"}
            </li>
            <li>
              <span className="font-semibold">Arrangement status:</span>{" "}
              {getRegistrationStatus({ event })}
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
}

type BedpresPreviewProps = {
  bedpres: Bedpres;
};

export function BedpresPreview({ bedpres }: BedpresPreviewProps) {
  return (
    <Link href={`/dashbord/${bedpres.slug}`}>
      <div className={cn("flex h-full items-center gap-5 p-5", "hover:bg-muted")}>
        <div className="overflow-hidden rounded-full border">
          <div className="relative aspect-square h-20 w-20">
            <Image
              src={urlFor(bedpres.company.image).url()}
              alt={`${bedpres.company.name} logo`}
              fill
            />
          </div>
        </div>
        <div className="overflow-x-hidden">
          <h3 className="line-clamp-1 text-lg font-semibold md:text-2xl">{bedpres.title}</h3>
          <ul className="text-sm md:text-base">
            {bedpres.date && (
              <li>
                <span className="font-semibold">Dato:</span>{" "}
                {format(new Date(bedpres.date), "d. MMMM yyyy", { locale: nb })}
              </li>
            )}
            <li>
              <span className="font-semibold">Påmelding:</span>{" "}
              {bedpres.registrationStart
                ? format(new Date(bedpres.registrationStart), "d. MMMM yyyy", {
                  locale: nb,
                })
                : "Påmelding åpner snart"}
            </li>
            <li>
              <span className="font-semibold">Frist:</span>{" "}
              {bedpres.registrationEnd
                ? format(new Date(bedpres.registrationEnd), "d. MMMM yyyy", {
                  locale: nb,
                })
                : "Ikke bestemt"}
            </li>
            <li>
              <span className="font-semibold">Antall plasser:</span>{" "}
              {bedpres.spotRanges?.[0]?.spots != null
                ? bedpres.spotRanges[0].spots : "Ikke bestemt"}
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
}

function getRegistrationStatus({ event }: EventPreviewProps) {
  const currentDate = new Date();
  if (!event.registrationStart && !event.registrationEnd) {
    return "Planlagt";
  } else if (event.registrationStart && event.registrationEnd) {
    if (currentDate >= new Date(event.registrationStart) && currentDate <= new Date(event.registrationEnd)) {
      return "Aktiv";
    } else if (currentDate > new Date(event.registrationEnd)) {
      return "Avsluttet";
    }
  }
  return "Planlagt";
}

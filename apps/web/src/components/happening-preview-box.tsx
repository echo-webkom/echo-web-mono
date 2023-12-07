import Image from "next/image";
import Link from "next/link";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, isAfter, isBefore, isToday } from "date-fns";
import nb from "date-fns/locale/nb";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type Registration } from "@echo-webkom/db/schemas";

import { type Bedpres } from "@/sanity/bedpres";
import { type Event } from "@/sanity/event";
import { cn } from "@/utils/cn";
import { urlFor } from "@/utils/image-builder";
import { capitalize } from "@/utils/string";
import { type Happening } from "./event-filter";

type HappeningPreviewBoxProps =
  | {
      type: "EVENT";
      happenings: Array<Event>;
    }
  | {
      type: "BEDPRES";
      happenings: Array<Bedpres>;
    };

type HappeningType = HappeningPreviewBoxProps["type"];

const happeningTypeToString: Record<HappeningType, string> = {
  EVENT: "arrangementer",
  BEDPRES: "bedriftspresentasjoner",
};

const typeToLink: Record<HappeningType, string> = {
  EVENT: "/for-studenter/arrangementer?type=arrangement",
  BEDPRES: "/for-studenter/arrangementer?type=bedpres",
};

const getSpotRangeInfo = <TSpotRange extends { spots: number; minYear: number; maxYear: number }>(
  spotRanges: Array<TSpotRange>,
  registrations: Array<Registration>,
) => {
  const maxCapacity = spotRanges.reduce((acc, curr) => acc + curr.spots, 0);
  const registeredCount = registrations.filter(
    (registration) => registration.status === "registered",
  ).length;
  return {
    maxCapacity,
    registeredCount,
  };
};

export function HappeningPreviewBox({ type, happenings }: HappeningPreviewBoxProps) {
  return (
    <div>
      <Link href={typeToLink[type]}>
        <h2 className="text-center text-xl font-semibold md:text-3xl">
          {capitalize(happeningTypeToString[type])}
        </h2>
      </Link>

      <hr className="my-3" />

      {happenings.length > 0 ? (
        <ul className="flex h-full flex-col divide-y ">
          {happenings.map((happening) => (
            <li key={happening._id} className="h-28 py-3">
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

export async function EventPreview({ event }: EventPreviewProps) {
  const spotRanges = event.spotRanges;
  const registrations = await db.query.registrations.findMany({
    where: (registration) => eq(registration.happeningSlug, event.slug),
    with: {
      user: true,
    },
  });
  const { maxCapacity, registeredCount } = getSpotRangeInfo(spotRanges ?? [], registrations);
  const registrationStatus = (maxCapacity: number, registeredCount: number) => {
    if (!event.registrationStart) {
      return null;
    }
    if (isToday(new Date()) && isBefore(new Date(), new Date(event.registrationStart))) {
      return "Påmelding i dag";
    } else if (isBefore(new Date(), new Date(event.registrationStart))) {
      return "Påmelding: " + format(new Date(event.registrationStart), "dd. MMM", { locale: nb });
    } else if (isAfter(new Date(), new Date(event.registrationStart))) {
      return registeredCount + "/" + (maxCapacity || ("Uendelig" && "∞"));
    }
    return "Fullt";
  };
  return (
    <Link href={`/arrangement/${event.slug}`}>
      <div className={cn("flex h-full items-center gap-5 p-5", "hover:bg-muted")}>
        <div className="flex w-full justify-between overflow-x-hidden">
          <h3 className="text-md my-auto line-clamp-1 text-lg font-semibold sm:text-2xl">
            {event.title}
          </h3>
          <ul className="text-sm md:text-base">
            {event.date && (
              <li className="flex justify-end">
                <CalendarIcon className="my-auto mr-1" />
                {format(new Date(event.date), "dd. MMM", { locale: nb })}
              </li>
            )}
            <li className="flex justify-end">{registrationStatus(maxCapacity, registeredCount)}</li>
          </ul>
        </div>
      </div>
    </Link>
  );
}

type BedpresPreviewProps = {
  bedpres: Bedpres;
};

export async function BedpresPreview({ bedpres }: BedpresPreviewProps) {
  const spotRanges = bedpres.spotRanges;
  const registrations = await db.query.registrations.findMany({
    where: (registration) => eq(registration.happeningSlug, bedpres.slug),
    with: {
      user: true,
    },
  });
  const { maxCapacity, registeredCount } = getSpotRangeInfo(spotRanges ?? [], registrations);
  const registrationStatus = (maxCapacity: number, registeredCount: number) => {
    if (!bedpres.registrationStart) {
      return null;
    }
    if (isToday(new Date()) && isBefore(new Date(), new Date(bedpres.registrationStart))) {
      return "Påmelding i dag";
    } else if (isBefore(new Date(), new Date(bedpres.registrationStart))) {
      return "Påmelding: " + format(new Date(bedpres.registrationStart), "dd. MMM", { locale: nb });
    } else if (isAfter(new Date(), new Date(bedpres.registrationStart))) {
      return registeredCount + "/" + (maxCapacity || ("Uendelig" && "∞"));
    }
    return "Fullt";
  };
  return (
    <Link href={`/bedpres/${bedpres.slug}`}>
      <div className={cn("flex h-full items-center gap-5 p-3", "hover:bg-muted")}>
        <div className="overflow-hidden rounded-full border">
          <div className="relative aspect-square h-16 w-16">
            <Image
              src={urlFor(bedpres.company.image).url()}
              alt={`${bedpres.company.name} logo`}
              fill
            />
          </div>
        </div>
        <div className="flex flex-1 justify-between overflow-x-hidden">
          <h3 className="my-auto line-clamp-1 text-lg font-semibold md:text-2xl">
            {bedpres.title}
          </h3>
          <ul className="text-sm md:text-base">
            {bedpres.date && (
              <li className="flex justify-end">
                <CalendarIcon className="my-auto mr-1" />
                {format(new Date(bedpres.date), "dd. MMM", { locale: nb })}
              </li>
            )}
            <li className="flex justify-end">{registrationStatus(maxCapacity, registeredCount)}</li>
          </ul>
        </div>
      </div>
    </Link>
  );
}

type CombinedHappeningPreviewProps = {
  happening: Happening;
};

export function CombinedHappeningPreview({ happening }: CombinedHappeningPreviewProps) {
  return (
    <Link href={`/${happening.type}/${happening.slug}`}>
      <div className={cn("flex h-full items-center justify-between gap-5 p-5", "hover:bg-muted")}>
        <div className="overflow-x-hidden">
          <h3 className="line-clamp-1 text-2xl font-semibold">{happening.title}</h3>
          <ul>
            {happening.type === "arrangement" && (
              <li>
                <span className="font-semibold">Gruppe:</span>{" "}
                {capitalize(happening.organizers.map((o) => o.name).join(", "))}
              </li>
            )}
            {happening.date && (
              <li>
                <span className="font-semibold">Dato:</span>{" "}
                {format(new Date(happening.date), "d. MMMM yyyy", { locale: nb })}
              </li>
            )}
            <li>
              <span className="font-semibold">Påmelding:</span>{" "}
              {happening.registrationStart
                ? format(new Date(happening.registrationStart), "d. MMMM yyyy", {
                    locale: nb,
                  })
                : "Påmelding åpner snart"}
            </li>
          </ul>
        </div>
        {happening.type === "bedpres" && (
          <div className="hidden overflow-hidden rounded-full border sm:block">
            <div className="relative aspect-square h-20 w-20">
              <Image
                src={urlFor(happening.company.image).url()}
                alt={`${happening.company.name} logo`}
                fill
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

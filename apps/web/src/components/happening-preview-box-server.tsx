import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CalendarIcon } from "@radix-ui/react-icons";
import { format, isFuture, isPast, isToday } from "date-fns";
import nb from "date-fns/locale/nb";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type Registration } from "@echo-webkom/db/schemas";

import { type Happening, type HappeningType } from "@/sanity/happening/schemas";
import { cn } from "@/utils/cn";
import { urlFor } from "@/utils/image-builder";
import { capitalize } from "@/utils/string";

const happeningTypeToString: Record<HappeningType, string> = {
  external: "arrangementer",
  event: "arrangementer",
  bedpres: "bedriftspresentasjoner",
};

const typeToLink: Record<HappeningType, string> = {
  external: "/for-studenter/arrangementer?type=external",
  event: "/for-studenter/arrangementer?type=arrangement",
  bedpres: "/for-studenter/arrangementer?type=bedpres",
};

type HappeningPreviewBoxProps = {
  type: HappeningType;
  happenings: Array<Happening>;
};

export function HappeningPreviewBox({ type, happenings }: HappeningPreviewBoxProps) {
  return (
    <div>
      <Link href={typeToLink[type]}>
        <h2 className="group text-center text-xl font-semibold decoration-1 underline-offset-8 hover:underline md:text-3xl">
          {capitalize(happeningTypeToString[type])}
          <ArrowRightIcon className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-2" />
        </h2>
      </Link>
      <hr className="my-3" />

      {happenings.length > 0 ? (
        <ul className="flex h-full flex-col divide-y">
          {happenings.map((happening) => (
            <li key={happening._id} className="h-28 py-3">
              {type === "event" && <EventPreview event={happening} />}
              {type === "bedpres" && <BedpresPreview bedpres={happening} />}
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
  event: Happening;
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

const getRegistrationStatus = (registrationDate: string, capacity: number, registered: number) => {
  if (isToday(new Date(registrationDate)) && isFuture(new Date(registrationDate))) {
    return <p className="text-right">Påmelding i dag</p>;
  } else if (isFuture(new Date(registrationDate))) {
    return (
      <p className="text-right">
        Påmelding {format(new Date(registrationDate), "dd. MMM", { locale: nb })}
      </p>
    );
  } else if (isPast(new Date(registrationDate))) {
    return registered + "/" + (capacity || ("Uendelig" && "∞"));
  }
  return "Fullt";
};

export async function EventPreview({ event }: EventPreviewProps) {
  const spotRanges = await db.query.spotRanges
    .findMany({
      where: (spotRange) => eq(spotRange.happeningId, event._id),
    })
    .catch(() => []);
  const registrations = await db.query.registrations
    .findMany({
      where: (registration) => eq(registration.happeningId, event._id),
      with: {
        user: true,
      },
    })
    .catch(() => []);
  const { maxCapacity, registeredCount } = getSpotRangeInfo(spotRanges ?? [], registrations);
  return (
    <Link href={`/arrangement/${event.slug}`}>
      <div className={cn("flex h-full items-center gap-5 p-5", "hover:bg-muted")}>
        <div className="flex w-full justify-between overflow-x-hidden">
          <h3 className="my-auto text-sm font-semibold sm:text-xl">{event.title}</h3>
          <ul className="ml-2 w-20 text-sm md:text-base">
            {event.date && (
              <li className="flex justify-end">
                <CalendarIcon className="my-auto mr-1 font-semibold" />
                {format(new Date(event.date), "dd. MMM", { locale: nb })}
              </li>
            )}
            <li className="flex justify-end">
              {event.registrationStart &&
                getRegistrationStatus(event.registrationStart, maxCapacity, registeredCount)}
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
}

type BedpresPreviewProps = {
  bedpres: Happening;
};

export async function BedpresPreview({ bedpres }: BedpresPreviewProps) {
  const spotRanges = await db.query.spotRanges
    .findMany({
      where: (spotRange) => eq(spotRange.happeningId, bedpres._id),
    })
    .catch(() => []);
  const registrations = await db.query.registrations
    .findMany({
      where: (registration) => eq(registration.happeningId, bedpres._id),
      with: {
        user: true,
      },
    })
    .catch(() => []);

  const { maxCapacity, registeredCount } = getSpotRangeInfo(spotRanges ?? [], registrations);
  return (
    <Link href={`/bedpres/${bedpres.slug}`}>
      <div className={cn("flex h-full items-center gap-5 p-3", "hover:bg-muted")}>
        <div className="overflow-hidden rounded-full border">
          <div className="relative aspect-square h-16 w-16">
            {bedpres.company && (
              <Image
                src={urlFor(bedpres.company.image).url()}
                alt={`${bedpres.company.name} logo`}
                fill
              />
            )}
          </div>
        </div>
        <div className="flex flex-1 justify-between overflow-x-hidden">
          <h3 className="my-auto text-lg font-semibold md:text-xl">{bedpres.title}</h3>
          <ul className="w-20 text-sm md:text-base">
            {bedpres.date && (
              <li className="flex justify-end">
                <CalendarIcon className="my-auto mr-1" />
                {format(new Date(bedpres.date), "dd. MMM", { locale: nb })}
              </li>
            )}
            <li className="flex justify-end">
              {bedpres.registrationStart &&
                getRegistrationStatus(bedpres.registrationStart, maxCapacity, registeredCount)}
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
}

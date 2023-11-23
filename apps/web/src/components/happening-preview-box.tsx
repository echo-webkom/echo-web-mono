import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import nb from "date-fns/locale/nb";

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
            <li key={happening._id} className="py-3">
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
    <Link href={`/arrangement/${event.slug}`}>
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
    <Link href={`/bedpres/${bedpres.slug}`}>
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

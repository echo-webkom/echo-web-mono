import Image from "next/image";
import Link from "next/link";
import {format} from "date-fns";
import nb from "date-fns/locale/nb";

import {type Bedpres} from "@/sanity/bedpres";
import {type Event} from "@/sanity/event";
import {cn} from "@/utils/cn";
import {urlFor} from "@/utils/image-builder";
import {capitalize} from "@/utils/string";

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

export function HappeningPreviewBox({type, happenings}: HappeningPreviewBoxProps) {
  return (
    <div>
      <h2 className="text-center text-3xl font-semibold hover:underline">
        {capitalize(happeningTypeToString[type])}
      </h2>

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
        <div className="flex h-full flex-col items-center justify-center text-lg font-medium">
          <p>Ingen kommende {happeningTypeToString[type]}</p>
        </div>
      )}
    </div>
  );
}

type EventPreviewProps = {
  event: Event;
};

export function EventPreview({event}: EventPreviewProps) {
  return (
    <Link href={`/event/${event.slug}`}>
      <div className={cn("flex h-full items-center gap-5 p-5", "hover:bg-muted")}>
        <div className="overflow-x-hidden">
          <h3 className="line-clamp-1 text-2xl font-semibold">{event.title}</h3>
          <ul>
            <li>
              <span className="font-semibold">Gruppe:</span>{" "}
              {capitalize(event.organizers.map((o) => o.name).join(", "))}
            </li>
            {event.date && (
              <li>
                <span className="font-semibold">Dato:</span>{" "}
                {format(new Date(event.date), "d. MMMM yyyy", {locale: nb})}
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

export function BedpresPreview({bedpres}: BedpresPreviewProps) {
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
          <h3 className="line-clamp-1 text-2xl font-semibold">{bedpres.title}</h3>
          <ul>
            {bedpres.date && (
              <li>
                <span className="font-semibold">Dato:</span>{" "}
                {format(new Date(bedpres.date), "d. MMMM yyyy", {locale: nb})}
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

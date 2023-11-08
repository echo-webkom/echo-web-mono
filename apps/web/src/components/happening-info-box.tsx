import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { isAfter, isBefore } from "date-fns";

import { type Happening } from "@echo-webkom/db/schemas";

import { maxCapacityBySlug } from "@/lib/queries/happening";
import { fetchBedpresBySlug, type Bedpres } from "@/sanity/bedpres";
import { fetchEventBySlug, type Event } from "@/sanity/event";
import { urlFor } from "@/utils/image-builder";
import { capitalize } from "@/utils/string";
import { norwegianDateString } from "@/utils/date";

export async function HappeningInfoBox({ happening }: { happening: Happening }) {
  return (
    <div>
      {happening.type === "event" && <EventInfoBox event={await getEventBySlug(happening.slug)} />}
      {happening.type === "bedpres" && (
        <BedpresInfoBox bedpres={await getBedpresBySlug(happening.slug)} />
      )}
    </div>
  );
}

async function getBedpresBySlug(slug: string) {
  const bedpres = await fetchBedpresBySlug(slug);

  if (!bedpres) {
    return notFound();
  }

  return bedpres;
}

async function fetchMaxCapacity(slug: string) {
  const capacity = await maxCapacityBySlug(slug);
  return capacity === 0 ? "Uendelig" : capacity;
}

async function getEventBySlug(slug: string) {
  const happening = await fetchEventBySlug(slug);

  if (!happening) {
    return notFound();
  }

  return happening;
}



async function EventInfoBox({ event }: { event: Event }) {
  const isRegistrationOpen =
    event?.registrationStart &&
    event?.registrationEnd &&
    isAfter(new Date(), new Date(event.registrationStart)) &&
    isBefore(new Date(), new Date(event.registrationEnd));

  const capacity = await fetchMaxCapacity(event.slug);

  return (
    <div className="flex h-full items-center rounded-xl border gap-5 p-5 bg-card overflow-x-auto sm:rounded-lg">
      <div className="overflow-x-hidden">
        <h1 className="line-clamp-1 text-lg font-semibold md:text-2xl">
          {capitalize(event.title)}
        </h1>
        <p className="text-sm md:text-base">Arrangement</p>

        <div className="py-4">
          <div>Sted: {event.location?.name ? event.location.name : "Ikke bestemt"}</div>
          <div>
            Kapasitet:{" "}
            {capacity}
          </div>
          <div>Publisert: {norwegianDateString(event._createdAt)}</div>
          <div>Sist oppdatert: {norwegianDateString(event._updatedAt)}</div>
          <div>
            Kontakt:{" "}
            {event.contacts && event.contacts.length > 0 ? (
              <a className="hover:underline" href={"mailto:" + event.contacts[0]?.email}>
                {event.contacts[0]?.email}
              </a>
            ) : (
              "Ikke angitt"
            )}
          </div>
          <div>
            Påmelding:{" "}
            {isRegistrationOpen ? (
              <span className="text-green-600">Åpen</span>
            ) : (
              <span className="text-red-600">Lukket</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

async function BedpresInfoBox({ bedpres }: { bedpres: Bedpres }) {
  const isRegistrationOpen =
    bedpres?.registrationStart &&
    bedpres?.registrationEnd &&
    isAfter(new Date(), new Date(bedpres.registrationStart)) &&
    isBefore(new Date(), new Date(bedpres.registrationEnd));

  const capacity = await fetchMaxCapacity(bedpres.slug);
  return (
    <div
      className="flex h-full items-center gap-5 p-5 bg-card border overflow-x-auto sm:rounded-lg">
      <div className="flex-1">
        {!bedpres && (
          <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
            <p className="font-semibold">Fant ikke arrangementet.</p>
            <p>Kontakt Webkom!</p>
          </div>
        )}

        <h1 className="line-clamp-1 text-lg font-semibold md:text-2xl">
          {capitalize(bedpres.title)}
        </h1>

        <Link href={bedpres.company.website} className="hover:underline">
          Bedriftspresentasjon {bedpres.company.name}
          <ExternalLinkIcon className="ml-1 inline-block h-4 w-4" />
        </Link>

        <div className="py-4">
          <div>Sted: {bedpres.location?.name ? bedpres.location.name : "Ikke bestemt"}</div>
          <div>
            Kapasitet:{" "}
            {capacity}
          </div>
          <div>Publisert: {norwegianDateString(bedpres._createdAt)}</div>
          <div>Sist oppdatert: {norwegianDateString(bedpres._updatedAt)}</div>
          <div>
            Kontakt:{" "}
            {bedpres.contacts && bedpres.contacts.length > 0
              ? bedpres.contacts[0]?.email
              : "Ikke angitt"}
          </div>
          <div>
            Påmelding:{" "}
            {isRegistrationOpen ? (
              <span className="text-green-600">Åpen</span>
            ) : (
              <span className="text-red-600">Lukket</span>
            )}
          </div>
        </div>
      </div>
      <div className="invisible flex w-1/3 justify-end md:visible">
        <div className="overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={urlFor(bedpres.company.image).url()}
              alt={`${bedpres.company.name} logo`}
              width={10}
              height={10}
              layout="responsive"
            />
          </div>
        </div>
      </div>
    </div>
  );
}




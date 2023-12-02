import { isAfter, isBefore } from "date-fns";

import { maxCapacityBySlug } from "@/lib/queries/happening";
import { type Happening } from "@/sanity/happening/schemas";
import { norwegianDateString } from "@/utils/date";
import { capitalize } from "@/utils/string";

async function fetchMaxCapacity(slug: string) {
  const capacity = await maxCapacityBySlug(slug);
  return capacity === 0 ? "Uendelig" : capacity;
}

export async function HappeningInfoBox(happening: Happening) {
  const isRegistrationOpen =
    happening?.registrationStart &&
    happening?.registrationEnd &&
    isAfter(new Date(), new Date(happening.registrationStart)) &&
    isBefore(new Date(), new Date(happening.registrationEnd));

  const capacity = await fetchMaxCapacity(happening.slug);

  return (
    <div className="flex h-full items-center gap-5 overflow-x-auto rounded-xl border bg-card p-5 sm:rounded-lg">
      <div className="overflow-x-hidden">
        <h1 className="line-clamp-1 text-lg font-semibold md:text-2xl">
          {capitalize(happening.title)}
        </h1>
        <p className="text-sm md:text-base">Arrangement</p>

        <div className="py-4">
          <div>Sted: {happening.location?.name ? happening.location.name : "Ikke bestemt"}</div>
          <div>Kapasitet: {capacity}</div>
          <div>Publisert: {norwegianDateString(happening._createdAt)}</div>
          <div>Sist oppdatert: {norwegianDateString(happening._updatedAt)}</div>
          <div>
            Kontakt:{" "}
            {happening.contacts && happening.contacts.length > 0 ? (
              <a className="hover:underline" href={"mailto:" + happening.contacts[0]?.email}>
                {happening.contacts[0]?.email}
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
